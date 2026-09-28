import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
} from "../controllers/users.js";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/me", getCurrentUser);
usersRouter.patch("/me", updateProfile);
usersRouter.patch("/me/avatar", updateAvatar);
usersRouter.get("/:id", getUserById);

export default usersRouter;
