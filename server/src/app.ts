import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/error-handler.js";
import router from "./routes/index.js";

const app = express();
const PORT = 3001;
const MONGODB_URI = "mongodb://127.0.0.1:27017/aroundb";

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Autorización temporal: reemplaza este _id por el del usuario de prueba en Compass.
app.use((req, _res, next) => {
  req.user = {
    _id: "6aa93338bc2fc2fe38e4a480",
  };
  next();
});

app.use(router);

app.use((_req, res) => {
  res.status(404).send({ message: "Recurso solicitado no encontrado" });
});

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB (aroundb)");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Error al conectar a MongoDB:", error);
  });
