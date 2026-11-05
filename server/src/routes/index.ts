import { Router } from "express";
import projectsRouter from "./projects.js";
import usersRouter from "./users.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/projects", projectsRouter);

export default router;
