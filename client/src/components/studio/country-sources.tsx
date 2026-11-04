import { useEffect, useState } from "react";
import RequestStatus from "@/components/status/RequestStatus";
import { getClimate } from "@/utils/openMeteo";
import type { ClimateSummary, ColombianGrid } from "@/utils/sourceTypes";
import { getColombianGrid } from "@/utils/xm";

type SourceStatus = "loading" | "error" | "empty" | "ready";

type CountrySourcesProps = {
  code: string;
  lat: number;
  lng: number;
};

function oneDecimal(value: number): string {
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 }).format(value);
}

function SourceBox({
  title,
  status,
  rows,
  note,
}: {
  title: string;
  status: SourceStatus;
  rows: { label: string; value: string }[];
  note?: string;
}) {
  return (
    <section className="border-t border-border bg-white px-4 py-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {status === "ready" ? (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="text-sm font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="mt-3">
          <RequestStatus status={status} />
          {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
        </div>
      )}
    </section>
  );
}

export default function CountrySources({ code, lat, lng }: CountrySourcesProps) {
  const [climateStatus, setClimateStatus] = useState<SourceStatus>("loading");
  const [climate, setClimate] = useState<ClimateSummary | null>(null);
  const [gridStatus, setGridStatus] = useState<SourceStatus>(code === "CO" ? "loading" : "empty");
  const [grid, setGrid] = useState<ColombianGrid | null>(null);

  useEffect(() => {
    let active = true;
    getClimate(lat, lng)
      .then((summary) => {
        if (!active) return;
        setClimate(summary);
        setClimateStatus(summary ? "ready" : "empty");
      })
      .catch(() => {
        if (active) setClimateStatus("error");
      });

    if (code !== "CO") return () => {
      active = false;
    };

    getColombianGrid()
      .then((summary) => {
        if (!active) return;
        setGrid(summary);
        setGridStatus(summary ? "ready" : "empty");
      })
      .catch(() => {
        if (active) setGridStatus("error");
      });

    return () => {
      active = false;
    };
  }, [code, lat, lng]);

  return (
    <>
      <SourceBox
        title="Clima 2024 · Open-Meteo"
        status={climateStatus}
        rows={[
          { label: "Temperatura", value: climate ? `${oneDecimal(climate.temperatureC)} °C` : "" },
          { label: "Viento", value: climate ? `${oneDecimal(climate.windKmh)} km/h` : "" },
          { label: "Sol", value: climate ? `${oneDecimal(climate.solarMj)} MJ/m²` : "" },
        ]}
      />
      <SourceBox
        title={grid ? `Red · XM · ${grid.date}` : "Red · XM"}
        status={gridStatus}
        note={code === "CO" ? undefined : "XM publica la red de Colombia."}
        rows={[
          { label: "Demanda", value: grid ? `${oneDecimal(grid.demandGwh)} GWh` : "" },
          { label: "Punta", value: grid ? `${oneDecimal(grid.peakGw)} GW` : "" },
          { label: "Generación", value: grid ? `${oneDecimal(grid.generationGwh)} GWh` : "" },
          { label: "Precio de bolsa", value: grid ? `${oneDecimal(grid.priceCopPerKwh)} COP/kWh` : "" },
        ]}
      />
    </>
  );
}
