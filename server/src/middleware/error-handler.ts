import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err);

  let { statusCode = 500 } = err;

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  }

  const message =
    statusCode === 500 ? "Ha ocurrido un error en el servidor" : err.message;

  res.status(statusCode).send({ message });
};
