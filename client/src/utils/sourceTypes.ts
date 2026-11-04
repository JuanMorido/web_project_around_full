export type ClimateSummary = {
  temperatureC: number;
  windKmh: number;
  solarMj: number;
};

export type ColombianGrid = {
  date: string;
  demandGwh: number;
  peakGw: number;
  generationGwh: number;
  priceCopPerKwh: number;
};

export type XmHourlyResponse = {
  Items?: Array<{
    HourlyEntities?: Array<{
      Values?: Record<string, string>;
    }>;
  }>;
};
