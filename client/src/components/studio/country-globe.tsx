"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-50m.json";
import { identifyCountry, type CountryIdentity } from "@/lib/countries";
import { publicUrl } from "@/utils/publicUrl";
import { representativePoint, type LatLng } from "@/lib/geo";

type CountryPolygon = {
  type: "Feature";
  id?: string | number;
  properties: CountryIdentity & { english: string };
  geometry: GeoJSON.Geometry;
};

type CountryGlobeProps = {
  paused?: boolean;
  countryName?: string;
  selectedCode?: string;
  focusRequest?: string;
  onSelect?: (country: CountryIdentity) => void;
};

type LoadedCountries = {
  ok: boolean;
  polygons: CountryPolygon[];
  places: Map<string, LatLng>;
};

const SELECTED = "rgba(36, 112, 72, 0.62)";
const HOVER = "rgba(36, 112, 72, 0.34)";
const IDLE = "rgba(255, 255, 255, 0.06)";
const SELECTED_SIDE = "rgba(24, 86, 54, 0.45)";
const IDLE_SIDE = "rgba(255, 255, 255, 0.02)";

function detectWebgl(): boolean {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

function loadCountries(): LoadedCountries {
  const topo = worldAtlas as unknown as Topology;
  const countries = topo.objects.countries;
  if (!countries) return { ok: false, polygons: [], places: new Map() };
  const collection = feature(topo, countries);
  if (collection.type !== "FeatureCollection") return { ok: false, polygons: [], places: new Map() };
  const polygons: CountryPolygon[] = [];
  const places = new Map<string, LatLng>();
  for (const item of collection.features) {
    const english = typeof item.properties?.name === "string" ? item.properties.name : "Territorio";
    const identity = identifyCountry(item.id, english);
    const place = representativePoint(item.geometry);
    if (place) places.set(identity.code, place);
    polygons.push({
      type: "Feature",
      id: item.id,
      properties: { ...identity, english },
      geometry: item.geometry,
    });
  }
  polygons.sort((a, b) => a.properties.name.localeCompare(b.properties.name, "es"));
  return { ok: true, polygons, places };
}

export function CountryGlobe({
  paused = false,
  countryName = "",
  selectedCode = "",
  focusRequest = "",
  onSelect,
}: CountryGlobeProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const onSelectRef = useRef(onSelect ?? (() => {}));

  useEffect(() => {
    onSelectRef.current = onSelect ?? (() => {});
  }, [onSelect]);
  const loaded = useMemo(() => loadCountries(), []);
  const [webgl] = useState(detectWebgl);
  const [hoverCode, setHoverCode] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !globeReady || !webgl) return;
    const place = loaded.places.get(selectedCode);
    const globe = globeRef.current;
    if (!place || !globe) return;
    const current = globe.pointOfView();
    globe.pointOfView({ lat: place.lat, lng: place.lng, altitude: current.altitude || 2.2 }, 700);
    // Recentrar solo al cambiar de proyecto. Un clic en el país no debe mover la cámara.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest, globeReady, loaded.places, paused, webgl]);

  const hint = paused
    ? ""
    : !loaded.ok
      ? "No se pudo cargar el mapa de países."
      : !webgl
        ? "Elige el país en la lista."
        : globeReady
          ? "Arrastra para girar. Clic para elegir el país."
          : "Cargando el mapa de países…";

  const tone = (code: string) => {
    if (code === selectedCode) return "selected" as const;
    if (code === hoverCode) return "hover" as const;
    return "idle" as const;
  };

  let stage: ReactNode;
  if (!loaded.ok) {
    stage = (
      <p className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">
        No se pudo cargar el mapa de países.
      </p>
    );
  } else if (!webgl) {
    stage = paused ? (
      <div className="grid h-full place-items-center">
        <div className="size-[min(46vh,380px)] rounded-full bg-[radial-gradient(circle_at_32%_32%,#d9d9d9,#8a8a8a_42%,#4a4a4a)]" />
      </div>
    ) : (
      <div className="grid h-full content-center justify-items-center gap-3 px-6 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Este navegador no puede dibujar el globo. Elige el país en la lista.
        </p>
        <select
          className="h-9 w-full max-w-xs rounded-lg border border-border bg-white px-2 text-sm"
          value={selectedCode}
          aria-label="País"
          onChange={(event) => {
            const polygon = loaded.polygons.find((item) => item.properties.code === event.target.value);
            if (!polygon) return;
            onSelectRef.current({ code: polygon.properties.code, name: polygon.properties.name });
          }}
        >
          {loaded.polygons.map((polygon) => (
            <option
              key={`${polygon.properties.code}-${String(polygon.id ?? polygon.properties.english)}`}
              value={polygon.properties.code}
            >
              {polygon.properties.name}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (size.width > 0 && size.height > 0) {
    stage = (
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(247, 245, 240, 0)"
        rendererConfig={{ antialias: true, alpha: true }}
        globeImageUrl={publicUrl("earth-day.jpg")}
        showAtmosphere
        atmosphereColor={paused ? "#c8c8c8" : "#c5ddd4"}
        atmosphereAltitude={0.18}
        enablePointerInteraction={!paused}
        polygonsData={loaded.polygons}
        polygonGeoJsonGeometry={(polygon) =>
          (polygon as CountryPolygon).geometry as unknown as { type: string; coordinates: number[] }
        }
        polygonCapColor={(polygon) => {
          if (paused) return IDLE;
          const state = tone((polygon as CountryPolygon).properties.code);
          if (state === "selected") return SELECTED;
          if (state === "hover") return HOVER;
          return IDLE;
        }}
        polygonSideColor={(polygon) =>
          !paused && (polygon as CountryPolygon).properties.code === selectedCode ? SELECTED_SIDE : IDLE_SIDE
        }
        polygonStrokeColor={(polygon) =>
          !paused && (polygon as CountryPolygon).properties.code === selectedCode
            ? "rgba(18, 72, 44, 0.95)"
            : "rgba(255, 255, 255, 0.28)"
        }
        polygonAltitude={(polygon) => {
          if (paused) return 0.002;
          const state = tone((polygon as CountryPolygon).properties.code);
          if (state === "selected") return 0.012;
          if (state === "hover") return 0.007;
          return 0.002;
        }}
        polygonsTransitionDuration={180}
        polygonLabel={(polygon) => (paused ? "" : (polygon as CountryPolygon).properties.name)}
        onPolygonHover={(polygon) => {
          if (paused) return;
          setHoverCode(polygon ? (polygon as CountryPolygon).properties.code : null);
        }}
        onPolygonClick={(polygon) => {
          if (paused) return;
          const country = polygon as CountryPolygon;
          onSelectRef.current({ code: country.properties.code, name: country.properties.name });
        }}
        onGlobeReady={() => {
          const controls = globeRef.current?.controls();
          if (controls) {
            controls.autoRotate = false;
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.rotateSpeed = 0.72;
            controls.zoomSpeed = 0.55;
            controls.minDistance = 120;
            controls.maxDistance = 480;
            if (paused) {
              controls.enabled = false;
              controls.enableZoom = false;
            } else {
              controls.enableZoom = window.matchMedia("(min-width: 768px)").matches;
            }
          }
          globeRef.current?.pointOfView({ lat: 3.5, lng: -72.7, altitude: 2.25 });
          setGlobeReady(true);
        }}
      />
    );
  } else {
    stage = (
      <div className="grid h-full place-items-center">
        <div className="size-[min(46vh,380px)] rounded-full bg-[radial-gradient(circle_at_32%_32%,#e7f3ea,#7fad98_42%,#315e86)]" />
      </div>
    );
  }

  return (
    <div className="grid h-[min(52vh,420px)] grid-rows-[minmax(0,1fr)_auto] md:h-full md:min-h-0">
      <div
        ref={stageRef}
        className={`min-h-0 overflow-hidden ${paused ? "pointer-events-none grayscale" : "touch-none"}`}
      >
        {stage}
      </div>
      <div className="px-4 pt-1 pb-5 text-center">
        <p className="text-base font-medium">{paused ? "Sin país" : countryName}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}
