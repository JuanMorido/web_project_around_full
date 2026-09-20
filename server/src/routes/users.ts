import { Router } from "express";
import {
  createUser,
  getCurrentUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
} from "../controllers/users.js";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.post("/", createUser);
usersRouter.get("/me", getCurrentUser);
usersRouter.patch("/me", updateProfile);
usersRouter.patch("/me/avatar", updateAvatar);
usersRouter.get("/:id", getUserById);

export default usersRouter;
