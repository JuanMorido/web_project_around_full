import { REQUEST_ERROR } from "./messages";
import { publicUrl } from "./publicUrl";

export type Technology = {
  id: string;
  nombre: string;
  queEs: string;
  queMandaElCosto: string;
};

export type CountryGrid = {
  capacidad: string;
  demanda: string;
  punta: string;
  matriz: string;
};

export type Country = {
  id: string;
  code: string;
  nombre: string;
  red: CountryGrid;
};

export type Project = {
  id: string;
  name: string;
  tecnologiaId: string;
  paisId: string;
  nivel: string;
  capex: string;
};

export type Catalog = {
  tecnologias: Technology[];
  paises: Country[];
  proyectos: Project[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown, fallback = "—"): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function readTechnology(value: unknown): Technology | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  const nombre = text(value.nombre, "");
  if (!nombre) return null;
  return {
    id: value.id,
    nombre,
    queEs: text(value.queEs),
    queMandaElCosto: text(value.queMandaElCosto),
  };
}

function readCountry(value: unknown): Country | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  const nombre = text(value.nombre, "");
  if (!nombre) return null;
  const red = isRecord(value.red) ? value.red : {};
  return {
    id: value.id,
    code: value.id.toUpperCase(),
    nombre,
    red: {
      capacidad: text(red.capacidad),
      demanda: text(red.demanda),
      punta: text(red.punta),
      matriz: text(red.matriz),
    },
  };
}

function readProject(value: unknown): Project | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  const nombre = text(value.nombre, "");
  if (!nombre) return null;
  return {
    id: value.id,
    name: nombre,
    tecnologiaId: text(value.tecnologiaId, ""),
    paisId: text(value.paisId, ""),
    nivel: text(value.nivel),
    capex: text(value.capex),
  };
}

function readList<T>(value: unknown, readItem: (item: unknown) => T | null): T[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map(readItem);
  if (items.some((item) => item === null)) return null;
  return items as T[];
}

export async function getCatalog(): Promise<Catalog> {
  const response = await fetch(publicUrl("projects.json"));
  if (!response.ok) {
    throw new Error(REQUEST_ERROR);
  }

  const data: unknown = await response.json();
  if (!isRecord(data)) {
    throw new Error(REQUEST_ERROR);
  }

  const tecnologias = readList(data.tecnologias, readTechnology);
  const paises = readList(data.paises, readCountry);
  const proyectos = readList(data.proyectos, readProject);
  if (!tecnologias || !paises || !proyectos) {
    throw new Error(REQUEST_ERROR);
  }

  return { tecnologias, paises, proyectos };
}
