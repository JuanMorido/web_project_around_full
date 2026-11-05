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

export type XmHourlyResponse = {
  Items?: Array<{
    HourlyEntities?: Array<{
      Values?: Record<string, string>;
    }>;
  }>;
};
