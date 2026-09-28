import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const unauthorized = (res: Response) => {
  res.status(401).send({ message: "Se requiere autorización" });
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    unauthorized(res);
    return;
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof payload === "string" || typeof payload._id !== "string") {
      unauthorized(res);
      return;
    }

    req.user = { _id: payload._id };
    next();
  } catch {
    unauthorized(res);
  }
};
