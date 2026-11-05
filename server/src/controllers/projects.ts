import type { Request, Response } from "express";
import Project from "../models/project.js";

const present = (project: InstanceType<typeof Project>) => {
  const data = project.toObject();
  return {
    ...data,
    owner: data.owner.toString(),
  };
};

const getOwnedProject = async (req: Request) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw Object.assign(new Error("No se encontró ningún proyecto con ese id"), {
      statusCode: 404,
    });
  }

  if (project.owner.toString() !== req.user?._id) {
    throw Object.assign(new Error("No tienes permiso para modificar este proyecto"), {
      statusCode: 403,
    });
  }

  return project;
};

export const getProjects = async (req: Request, res: Response) => {
  const projects = await Project.find({ owner: req.user?._id }).sort({ createdAt: -1 });
  res.send(projects.map(present));
};

export const createProject = async (req: Request, res: Response) => {
  const { nombre, paisId, tecnologia, estado, nivel, demanda, capex, precioMwh } = req.body;
  const project = await Project.create({
    nombre,
    paisId,
    tecnologia,
    estado,
    nivel,
    demanda,
    capex,
    precioMwh,
    owner: req.user?._id,
  });
  res.status(201).send(present(project));
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await getOwnedProject(req);
  const fields = [
    "nombre",
    "paisId",
    "tecnologia",
    "estado",
    "nivel",
    "demanda",
    "capex",
    "precioMwh",
    "queEs",
    "queMandaElCosto",
    "seComercializa",
    "combustible",
  ] as const;

  for (const field of fields) {
    if (typeof req.body[field] === "string") {
      project.set(field, req.body[field]);
    }
  }

  await project.save();
  res.send(present(project));
};

export const deleteProject = async (req: Request, res: Response) => {
  const project = await getOwnedProject(req);
  await project.deleteOne();
  res.send(present(project));
};
