const XM_HOURLY = "https://servapibi.xm.com.co/hourly";

export type ColombianGrid = {
  date: string;
  demandGwh: number;
  peakGw: number;
  generationGwh: number;
  priceCopPerKwh: number;
};

type XmHourlyResponse = {
  Items?: Array<{
    HourlyEntities?: Array<{
      Values?: Record<string, string>;
    }>;
  }>;
};

function readHours(values: Record<string, string> | undefined): number[] {
  if (!values) return [];
  const hours: number[] = [];
  for (let hour = 1; hour <= 24; hour += 1) {
    const value = Number(values[`Hour${String(hour).padStart(2, "0")}`]);
    if (Number.isFinite(value)) hours.push(value);
  }
  return hours;
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
    throw new Error("XM no respondió");
  }
  const data = (await response.json()) as XmHourlyResponse;
  return readHours(data.Items?.[0]?.HourlyEntities?.[0]?.Values);
}

export async function readColombianGrid(date: string): Promise<ColombianGrid | null> {
  const [demand, generation, price] = await Promise.all([
    readMetric(date, "DemaReal"),
    readMetric(date, "Gene"),
    readMetric(date, "PrecBolsNaci"),
  ]);
  if (demand.length === 0 || generation.length === 0 || price.length === 0) {
    return null;
  }
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  return {
    date,
    demandGwh: sum(demand) / 1_000_000,
    peakGw: Math.max(...demand) / 1_000_000,
    generationGwh: sum(generation) / 1_000_000,
    priceCopPerKwh: sum(price) / price.length,
  };
}
