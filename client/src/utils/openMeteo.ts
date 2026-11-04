import { REQUEST_ERROR } from "./messages";
import type { ClimateSummary } from "./sourceTypes";

const CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate";
const CLIMATE_YEAR = "2024";

type ClimateResponse = {
  daily?: {
    temperature_2m_mean?: Array<number | null>;
    wind_speed_10m_mean?: Array<number | null>;
    shortwave_radiation_sum?: Array<number | null>;
  };
};

function average(values: Array<number | null> | undefined): number | null {
  if (!values) return null;
  const numbers = values.filter((value): value is number => typeof value === "number");
  if (numbers.length === 0) return null;
  const total = numbers.reduce((sum, value) => sum + value, 0);
  return total / numbers.length;
}

export async function getClimate(lat: number, lng: number): Promise<ClimateSummary | null> {
  const url = new URL(CLIMATE_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("start_date", `${CLIMATE_YEAR}-01-01`);
  url.searchParams.set("end_date", `${CLIMATE_YEAR}-12-31`);
  url.searchParams.set(
    "daily",
    "temperature_2m_mean,wind_speed_10m_mean,shortwave_radiation_sum",
  );

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(REQUEST_ERROR);
  }

  const data = (await response.json()) as ClimateResponse;
  const temperatureC = average(data.daily?.temperature_2m_mean);
  const windKmh = average(data.daily?.wind_speed_10m_mean);
  const solarMj = average(data.daily?.shortwave_radiation_sum);
  if (temperatureC === null || windKmh === null || solarMj === null) {
    return null;
  }

  return { temperatureC, windKmh, solarMj };
}
