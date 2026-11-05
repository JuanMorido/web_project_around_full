import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { createUser, login, recoverPassword } from "./controllers/users.js";
import { auth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { signinLimiter, signupLimiter } from "./middleware/limiter.js";
import router from "./routes/index.js";
import { readColombianGrid } from "./sources/xm.js";
import { readUsGrid } from "./sources/pudl.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/aroundb";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";
const localHosts = new Set(["localhost", "127.0.0.1"]);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin || origin === CLIENT_ORIGIN) {
    return true;
  }

  try {
    const configured = new URL(CLIENT_ORIGIN);
    const incoming = new URL(origin);
    return (
      localHosts.has(configured.hostname) &&
      localHosts.has(incoming.hostname) &&
      configured.protocol === incoming.protocol &&
      configured.port === incoming.port
    );
  } catch {
    return false;
  }
}

app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, origin ?? true);
        return;
      }
      callback(null, false);
    },
  }),
);
app.use(express.json());

const dbReady = mongoose.connect(MONGODB_URI, { maxPoolSize: 10 });
app.use((_req, _res, next) => {
  dbReady.then(() => next()).catch(next);
});

app.get("/health", (_req, res) => {
  res.status(200).send({ status: "ok" });
});

app.get("/sources/xm", async (req, res) => {
  const date = typeof req.query.date === "string" ? req.query.date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).send({ message: "Fecha inválida" });
    return;
  }

  try {
    const grid = await readColombianGrid(date);
    if (!grid) {
      res.status(200).send({ empty: true });
      return;
    }
    res.status(200).send(grid);
  } catch {
    res.status(502).send({ message: "No se pudo consultar XM" });
  }
});

app.get("/sources/pudl", async (_req, res) => {
  try {
    const grid = await readUsGrid();
    if (!grid) {
      res.status(200).send({ empty: true });
      return;
    }
    res.status(200).send(grid);
  } catch {
    res.status(502).send({ message: "No se pudo consultar PUDL" });
  }
});

app.post("/signup", signupLimiter, createUser);
app.post("/signin", signinLimiter, login);
app.post("/recover", signinLimiter, recoverPassword);

app.use(auth);
app.use(router);

app.use((_req, res) => {
  res.status(404).send({ message: "Recurso solicitado no encontrado" });
});

app.use(errorHandler);

if (!process.env.VERCEL) {
  dbReady
    .then(() => {
      console.log("Conectado a MongoDB (aroundb)");
      app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
      });
    })
    .catch((error: unknown) => {
      console.error("Error al conectar a MongoDB:", error);
    });
}

export default app;
