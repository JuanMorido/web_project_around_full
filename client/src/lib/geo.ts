import type { Geometry, Position } from "geojson";

export type LatLng = {
  lat: number;
  lng: number;
};

function openRing(ring: Position[]): Position[] {
  if (ring.length < 2) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first && last && first[0] === last[0] && first[1] === last[1]) {
    return ring.slice(0, -1);
  }
  return ring;
}

function ringArea(ring: Position[]): number {
  let sum = 0;
  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % ring.length];
    if (!current || !next) continue;
    sum += current[0] * next[1] - next[0] * current[1];
  }
  return Math.abs(sum / 2);
}

function largestOuterRing(geometry: Geometry): Position[] | null {
  if (geometry.type === "Polygon") return openRing(geometry.coordinates[0] ?? []);
  if (geometry.type === "MultiPolygon") {
    let best: Position[] | null = null;
    let bestArea = -1;
    for (const polygon of geometry.coordinates) {
      const ring = openRing(polygon[0] ?? []);
      const area = ringArea(ring);
      if (area > bestArea) {
        best = ring;
        bestArea = area;
      }
    }
    return best;
  }
  return null;
}

function averageLongitude(values: number[]): number {
  let x = 0;
  let y = 0;
  for (const lng of values) {
    const radians = (lng * Math.PI) / 180;
    x += Math.cos(radians);
    y += Math.sin(radians);
  }
  if (Math.abs(x) < 1e-8 && Math.abs(y) < 1e-8) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  return (Math.atan2(y, x) * 180) / Math.PI;
}

export function representativePoint(geometry: Geometry): LatLng | null {
  const ring = largestOuterRing(geometry);
  if (!ring || ring.length === 0) return null;
  let lat = 0;
  const longitudes: number[] = [];
  for (const position of ring) {
    longitudes.push(position[0]);
    lat += position[1];
  }
  return {
    lng: averageLongitude(longitudes),
    lat: lat / ring.length,
  };
}
