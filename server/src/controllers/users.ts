import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.js";

const formatOwnUser = (user: {
  _id: unknown;
  email: string;
  name: string;
  about: string;
  avatar: string;
}) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
});

const formatPublicUser = (user: {
  _id: unknown;
  name: string;
  about: string;
  avatar: string;
}) => ({
  _id: user._id,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
});

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find({});
  res.send(users.map(formatPublicUser));
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw Object.assign(new Error("ID de usuario no encontrado"), {
      statusCode: 404,
    });
  }

  if (user._id.toString() === req.user?._id) {
    res.send(formatOwnUser(user));
    return;
  }

  res.send(formatPublicUser(user));
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, name, about, avatar } = req.body;

  if (!email || !password) {
    res.status(400).send({
      message: "Los campos email y password son obligatorios",
    });
    return;
  }

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).send({
      message: "Los campos email y password deben ser texto",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).send({
      message: "La contraseña debe tener al menos 8 caracteres",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });
    res.status(201).send(formatOwnUser(user));
  } catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      res.status(409).send({
        message: "El correo electrónico ya está registrado",
      });
      return;
    }
    throw err;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({
      message: "Los campos email y password son obligatorios",
    });
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  const invalidCredentials = () => {
    res.status(401).send({ message: "Correo o contraseña incorrectos" });
  };

  if (!user) {
    invalidCredentials();
    return;
  }

  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) {
    invalidCredentials();
    return;
  }

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.send({
    token,
    ...formatOwnUser(user),
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw Object.assign(new Error("ID de usuario no encontrado"), {
      statusCode: 404,
    });
  }

  res.send(formatOwnUser(user));
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

  res.send(formatOwnUser(user));
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

  res.send(formatOwnUser(user));
};
