import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  REVIEW_PASSWORD,
  REVIEW_USERNAME,
  TOKEN_EXPIRES_IN,
} from "../config.js";
import User from "../models/user.js";

const formatOwnUser = (user: {
  _id: unknown;
  username?: string | null;
  email: string;
  name: string;
  about: string;
  avatar: string;
}) => ({
  _id: user._id,
  username: user.username ?? "",
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

const readUsername = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const username = value.trim();
  if (!/^[A-Za-z0-9_]{2,30}$/.test(username)) return null;
  return username;
};

const readEmail = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
};

const readName = (value: unknown): string | null => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return "";
  return value.trim();
};

const rejectName = (res: Response) => {
  res.status(400).send({
    message: `El nombre debe tener entre ${NAME_MIN_LENGTH} y ${NAME_MAX_LENGTH} caracteres`,
  });
};

const issueToken = (user: {
  _id: { toString(): string };
  username?: string | null;
  email: string;
  name: string;
  about: string;
  avatar: string;
}) => {
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET!, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
  return { token, ...formatOwnUser(user) };
};

const ensureReviewUser = async () => {
  const existing = await User.findOne({ username: REVIEW_USERNAME });
  if (existing) return existing;

  return User.create({
    username: REVIEW_USERNAME,
    email: "admin@mundinamo.local",
    password: await bcrypt.hash(REVIEW_PASSWORD, 10),
    name: "Admin",
  });
};

export const createUser = async (req: Request, res: Response) => {
  const { about, avatar } = req.body;
  const username = readUsername(req.body.username);
  const email = readEmail(req.body.email);
  const password = req.body.password;
  const name = readName(req.body.name) ?? username;

  if (!username) {
    res.status(400).send({
      message: "El usuario debe tener de 2 a 30 letras, números o guion bajo",
    });
    return;
  }

  if (!email) {
    res.status(400).send({
      message: "El correo de recuperación no es válido",
    });
    return;
  }

  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    res.status(400).send({
      message: "La contraseña debe tener al menos 8 caracteres",
    });
    return;
  }

  if (name !== null && (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH)) {
    rejectName(res);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      ...(name ? { name } : {}),
      about,
      avatar,
    });
    res.status(201).send(formatOwnUser(user));
  } catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      const field = Object.keys(err.keyPattern ?? {})[0];
      res.status(409).send({
        message:
          field === "username"
            ? "Ese usuario ya está registrado"
            : "Ese correo ya está registrado",
      });
      return;
    }
    throw err;
  }
};

export const login = async (req: Request, res: Response) => {
  const username = readUsername(req.body.username);
  const password = req.body.password;

  if (!username || typeof password !== "string" || !password) {
    res.status(400).send({
      message: "Los campos usuario y contraseña son obligatorios",
    });
    return;
  }

  if (username === REVIEW_USERNAME && password === REVIEW_PASSWORD) {
    const reviewUser = await ensureReviewUser();
    res.send(issueToken(reviewUser));
    return;
  }

  const user = await User.findOne({ username }).select("+password");
  const invalidCredentials = () => {
    res.status(401).send({ message: "Usuario o contraseña incorrectos" });
  };

  if (!user || password.length < PASSWORD_MIN_LENGTH) {
    invalidCredentials();
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    invalidCredentials();
    return;
  }

  res.send(issueToken(user));
};

export const recoverPassword = async (req: Request, res: Response) => {
  const email = readEmail(req.body.email);
  const password = req.body.password;

  if (!email) {
    res.status(400).send({ message: "Escribe el correo de recuperación" });
    return;
  }

  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    res.status(400).send({
      message: "La contraseña debe tener al menos 8 caracteres",
    });
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(404).send({ message: "No hay una cuenta con ese correo" });
    return;
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  res.send({ message: "Contraseña actualizada. Ya puedes entrar con tu usuario." });
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
  const name = readName(req.body.name);
  const about = typeof req.body.about === "string" ? req.body.about.trim() : "";

  if (name === null || name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    rejectName(res);
    return;
  }

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
