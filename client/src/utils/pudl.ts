import { REQUEST_ERROR } from "./messages";
import type { UsGrid } from "./sourceTypes";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

function isGrid(value: unknown): value is UsGrid {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.operationsDate === "string" &&
    typeof record.demandGwh === "number" &&
    typeof record.peakGw === "number" &&
    typeof record.generationGwh === "number" &&
    typeof record.interchangeDate === "string" &&
    typeof record.interchangeGwh === "number" &&
    typeof record.largestFlow === "string" &&
    typeof record.largestFlowGwh === "number" &&
    typeof record.planningDate === "string" &&
    typeof record.planningDemandGwh === "number" &&
    typeof record.planningPeakGw === "number" &&
    typeof record.planningAreas === "number"
  );
}

export async function getUsGrid(): Promise<UsGrid | null> {
  const response = await fetch(`${API_URL}/sources/pudl`);
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
