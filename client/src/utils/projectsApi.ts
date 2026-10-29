import { REQUEST_ERROR } from "./messages";
import { publicUrl } from "./publicUrl";

export type Project = {
  id: string;
  name: string;
};

function isProject(value: unknown): value is Project {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.name === "string";
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(publicUrl("projects.json"));
  if (!response.ok) {
    throw new Error(REQUEST_ERROR);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || data.some((item) => !isProject(item))) {
    throw new Error(REQUEST_ERROR);
  }

  return data;
}
