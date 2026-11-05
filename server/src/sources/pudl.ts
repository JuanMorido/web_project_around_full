import { DuckDBInstance } from "@duckdb/node-api";

const OPERATIONS = "s3://pudl.catalyst.coop/nightly/out_eia930__hourly_operations.parquet";
const INTERCHANGE = "s3://pudl.catalyst.coop/nightly/core_eia930__hourly_interchange.parquet";
const PLANNING = "s3://pudl.catalyst.coop/nightly/out_ferc714__hourly_planning_area_demand.parquet";
const FOREIGN_AUTHORITIES = "('AESO','BCHA','CEN','CFE','HQT','IESO','MHEB','NBSO','SPC')";
const CACHE_MS = 12 * 60 * 60 * 1000;

export type UsGrid = {
  operationsDate: string;
  demandGwh: number;
  peakGw: number;
  generationGwh: number;
  interchangeDate: string;
  interchangeGwh: number;
  largestFlow: string;
  largestFlowGwh: number;
  planningDate: string;
  planningDemandGwh: number;
  planningPeakGw: number;
  planningAreas: number;
};

let databasePromise: ReturnType<typeof DuckDBInstance.create> | null = null;
let cached: { at: number; grid: UsGrid } | null = null;

async function database() {
  if (!databasePromise) {
    databasePromise = DuckDBInstance.create(":memory:");
  }
  const instance = await databasePromise;
  const connection = await instance.connect();
  await connection.run("INSTALL httpfs; LOAD httpfs;");
  await connection.run(
    "CREATE OR REPLACE SECRET pudl (TYPE s3, PROVIDER config, REGION 'us-west-2', URL_STYLE 'path');",
  );
  return connection;
}

function asDay(value: unknown): string {
  const text = value instanceof Date ? value.toISOString() : String(value);
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  if (!match) {
    throw new Error("PUDL no devolvió una fecha");
  }
  return match[0];
}

function asNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

async function latestCompleteDay(connection: Awaited<ReturnType<typeof database>>, table: string): Promise<string> {
  const result = await connection.runAndReadAll(`
    SELECT CASE
      WHEN hour(latest) >= 23 THEN CAST(latest AS DATE)
      ELSE CAST(latest AS DATE) - INTERVAL 1 DAY
    END AS day
    FROM (SELECT max(datetime_utc) AS latest FROM read_parquet('${table}'))
  `);
  const row = result.getRowObjectsJS()[0];
  return asDay(row?.day);
}

export async function readUsGrid(): Promise<UsGrid | null> {
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return cached.grid;
  }

  const connection = await database();
  const operationsDate = await latestCompleteDay(connection, OPERATIONS);
  const interchangeDate = await latestCompleteDay(connection, INTERCHANGE);
  const planningDate = await latestCompleteDay(connection, PLANNING);

  const operations = await connection.runAndReadAll(`
    WITH hourly AS (
      SELECT
        datetime_utc,
        sum(demand_imputed_pudl_mwh) AS demand_mwh,
        sum(net_generation_adjusted_mwh) AS generation_mwh
      FROM read_parquet('${OPERATIONS}')
      WHERE datetime_utc >= TIMESTAMP '${operationsDate}'
        AND datetime_utc < TIMESTAMP '${operationsDate}' + INTERVAL 1 DAY
        AND balancing_authority_code_eia NOT IN ${FOREIGN_AUTHORITIES}
      GROUP BY 1
    )
    SELECT
      count(*) AS hours,
      sum(demand_mwh) / 1e3 AS demand_gwh,
      max(demand_mwh) / 1e3 AS peak_gw,
      sum(generation_mwh) / 1e3 AS generation_gwh
    FROM hourly
  `);
  const operationsRow = operations.getRowObjectsJS()[0];
  if (!operationsRow || asNumber(operationsRow.hours) < 20) {
    return null;
  }

  const interchange = await connection.runAndReadAll(`
    WITH pairs AS (
      SELECT
        balancing_authority_code_eia AS origin,
        balancing_authority_code_adjacent_eia AS neighbor,
        sum(interchange_reported_mwh) AS flow_mwh
      FROM read_parquet('${INTERCHANGE}')
      WHERE datetime_utc >= TIMESTAMP '${interchangeDate}'
        AND datetime_utc < TIMESTAMP '${interchangeDate}' + INTERVAL 1 DAY
        AND balancing_authority_code_eia NOT IN ${FOREIGN_AUTHORITIES}
      GROUP BY 1, 2
    )
    SELECT
      sum(abs(flow_mwh)) / 2e3 AS interchange_gwh,
      (SELECT origin || ' → ' || neighbor FROM pairs ORDER BY abs(flow_mwh) DESC LIMIT 1) AS largest_flow,
      (SELECT abs(flow_mwh) / 1e3 FROM pairs ORDER BY abs(flow_mwh) DESC LIMIT 1) AS largest_flow_gwh
    FROM pairs
  `);
  const interchangeRow = interchange.getRowObjectsJS()[0];

  const planning = await connection.runAndReadAll(`
    WITH hourly AS (
      SELECT
        datetime_utc,
        sum(demand_imputed_pudl_mwh) AS demand_mwh,
        count(DISTINCT respondent_id_ferc714) AS areas
      FROM read_parquet('${PLANNING}')
      WHERE datetime_utc >= TIMESTAMP '${planningDate}'
        AND datetime_utc < TIMESTAMP '${planningDate}' + INTERVAL 1 DAY
      GROUP BY 1
    )
    SELECT
      count(*) AS hours,
      sum(demand_mwh) / 1e3 AS demand_gwh,
      max(demand_mwh) / 1e3 AS peak_gw,
      max(areas) AS areas
    FROM hourly
  `);
  const planningRow = planning.getRowObjectsJS()[0];
  if (!planningRow || asNumber(planningRow.hours) < 20 || !interchangeRow?.largest_flow) {
    return null;
  }

  const grid: UsGrid = {
    operationsDate,
    demandGwh: asNumber(operationsRow.demand_gwh),
    peakGw: asNumber(operationsRow.peak_gw),
    generationGwh: asNumber(operationsRow.generation_gwh),
    interchangeDate,
    interchangeGwh: asNumber(interchangeRow.interchange_gwh),
    largestFlow: String(interchangeRow.largest_flow),
    largestFlowGwh: asNumber(interchangeRow.largest_flow_gwh),
    planningDate,
    planningDemandGwh: asNumber(planningRow.demand_gwh),
    planningPeakGw: asNumber(planningRow.peak_gw),
    planningAreas: asNumber(planningRow.areas),
  };
  cached = { at: Date.now(), grid };
  return grid;
}
