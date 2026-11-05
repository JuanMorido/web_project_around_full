import mongoose from "mongoose";

const ESTADOS = ["Por diseñar", "Ya construida"] as const;
const NIVELES = ["Orden de magnitud", "Estudio más avanzado"] as const;
const PAISES = ["co", "cl", "mx", "us"] as const;

const projectSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80,
  },
  paisId: {
    type: String,
    required: true,
    enum: PAISES,
  },
  tecnologia: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80,
  },
  estado: {
    type: String,
    required: true,
    enum: ESTADOS,
  },
  nivel: {
    type: String,
    required: true,
    enum: NIVELES,
  },
  demanda: {
    type: String,
    required: true,
    maxlength: 80,
  },
  capex: {
    type: String,
    required: true,
    maxlength: 80,
  },
  precioMwh: {
    type: String,
    required: true,
    maxlength: 80,
  },
  queEs: {
    type: String,
    default: "",
    maxlength: 500,
  },
  queMandaElCosto: {
    type: String,
    default: "",
    maxlength: 500,
  },
  seComercializa: {
    type: String,
    default: "Sí",
    enum: ["Sí", "No"],
  },
  combustible: {
    type: String,
    default: "",
    maxlength: 80,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
