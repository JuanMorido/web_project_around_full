import { REQUEST_ERROR } from "./messages";
import type { ColombianGrid, XmHourlyResponse } from "./sourceTypes";

const XM_HOURLY = "https://servapibi.xm.com.co/hourly";

function publishedGridDate(now = new Date()): string {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - 21);
  return date.toISOString().slice(0, 10);
}

function readHours(values: Record<string, string> | undefined): number[] {
  if (!values) return [];
  const hours: number[] = [];
  for (let hour = 1; hour <= 24; hour += 1) {
    const value = Number(values[`Hour${String(hour).padStart(2, "0")}`]);
    if (Number.isFinite(value)) hours.push(value);
  }
  return hours;
}

function summarize(date: string, demand: number[], generation: number[], price: number[]): ColombianGrid | null {
  if (demand.length === 0 || generation.length === 0 || price.length === 0) return null;
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  return {
    date,
    demandGwh: sum(demand) / 1_000_000,
    peakGw: Math.max(...demand) / 1_000_000,
    generationGwh: sum(generation) / 1_000_000,
    priceCopPerKwh: sum(price) / price.length,
  };
}

async function readMetric(date: string, metricId: string): Promise<number[]> {
  const response = await fetch(XM_HOURLY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      MetricId: metricId,
      StartDate: date,
      EndDate: date,
      Entity: "Sistema",
    }),
  });
  if (!response.ok) {
    throw new Error(REQUEST_ERROR);
  }
  const data = (await response.json()) as XmHourlyResponse;
  return readHours(data.Items?.[0]?.HourlyEntities?.[0]?.Values);
}

function isGrid(value: unknown): value is ColombianGrid {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.date === "string" &&
    typeof record.demandGwh === "number" &&
    typeof record.peakGw === "number" &&
    typeof record.generationGwh === "number" &&
    typeof record.priceCopPerKwh === "number"
  );
}

async function readGridFromServer(date: string): Promise<ColombianGrid | null> {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error(REQUEST_ERROR);
  }
  const response = await fetch(`${base}/sources/xm?date=${date}`);
  if (!response.ok) {
    throw new Error(REQUEST_ERROR);
  }
  const data: unknown = await response.json();
  if (typeof data === "object" && data !== null && "empty" in data && data.empty === true) {
    return null;
  }
  if (!isGrid(data)) {
    throw new Error(REQUEST_ERROR);
  }
  return data;
}

export async function getColombianGrid(): Promise<ColombianGrid | null> {
  const date = publishedGridDate();
  try {
    const [demand, generation, price] = await Promise.all([
      readMetric(date, "DemaReal"),
      readMetric(date, "Gene"),
      readMetric(date, "PrecBolsNaci"),
    ]);
    return summarize(date, demand, generation, price);
  } catch {
    return readGridFromServer(date);
  }
}
