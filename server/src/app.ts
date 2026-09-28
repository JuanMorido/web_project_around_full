import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { createUser, login } from "./controllers/users.js";
import { auth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { signinLimiter, signupLimiter } from "./middleware/limiter.js";
import router from "./routes/index.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/aroundb";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";

app.set("trust proxy", 1);
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send({ status: "ok" });
});

app.post("/signup", signupLimiter, createUser);
app.post("/signin", signinLimiter, login);

app.use(auth);
app.use(router);

app.use((_req, res) => {
  res.status(404).send({ message: "Recurso solicitado no encontrado" });
});

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI, { maxPoolSize: 10 })
  .then(() => {
    console.log("Conectado a MongoDB (aroundb)");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Error al conectar a MongoDB:", error);
  });
