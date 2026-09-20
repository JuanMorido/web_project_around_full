import type { Request, Response } from "express";
import User from "../models/user.js";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find({});
  res.send(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw Object.assign(new Error("ID de usuario no encontrado"), {
      statusCode: 404,
    });
  }

  res.send(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  const user = await User.create({ name, about, avatar });
  res.status(201).send(user);
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw Object.assign(new Error("ID de usuario no encontrado"), {
      statusCode: 404,
    });
  }

  res.send(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw Object.assign(new Error("ID de usuario no encontrado"), {
      statusCode: 404,
    });
  }

  res.send(user);
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw Object.assign(new Error("ID de usuario no encontrado"), {
      statusCode: 404,
    });
  }

  res.send(user);
};
