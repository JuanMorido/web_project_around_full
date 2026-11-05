import { REQUEST_ERROR } from "./messages";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export type EnergyProject = {
  _id: string;
  nombre: string;
  paisId: string;
  tecnologia: string;
  estado: string;
  nivel: string;
  demanda: string;
  capex: string;
  precioMwh: string;
  queEs: string;
  queMandaElCosto: string;
  seComercializa: string;
  combustible: string;
  owner: string;
};

export type ProjectInput = {
  nombre: string;
  paisId: string;
  tecnologia: string;
  estado: string;
  nivel: string;
  demanda: string;
  capex: string;
  precioMwh: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("jwt");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(REQUEST_ERROR);
  }
  return (await response.json()) as T;
}

export function getEnergyProjects(): Promise<EnergyProject[]> {
  return request<EnergyProject[]>("/projects");
}

export function createEnergyProject(draft: ProjectInput): Promise<EnergyProject> {
  return request<EnergyProject>("/projects", {
    method: "POST",
    body: JSON.stringify(draft),
  });
}

export function updateEnergyProject(
  id: string,
  patch: Partial<Omit<EnergyProject, "_id" | "owner">>,
): Promise<EnergyProject> {
  return request<EnergyProject>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteEnergyProject(id: string): Promise<EnergyProject> {
  return request<EnergyProject>(`/projects/${id}`, {
    method: "DELETE",
  });
}
