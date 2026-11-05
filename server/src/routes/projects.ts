import { Router } from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/projects.js";

const projectsRouter = Router();

projectsRouter.get("/", getProjects);
projectsRouter.post("/", createProject);
projectsRouter.patch("/:id", updateProject);
projectsRouter.delete("/:id", deleteProject);

export default projectsRouter;
