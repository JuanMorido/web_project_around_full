import mongoose from "mongoose";

// Valida enlaces http(s) con dominio y ruta opcional (avatar / link de tarjeta).
const urlRegex = /^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([/#?]?.*)?$/i;

const DEFAULT_AVATAR =
  "https://practicum-content.s3.us-west-1.amazonaws.com/web-lat/avatar.jpg";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Usuario",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: "Proyectos de energía",
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR,
    validate: {
      validator: (value: string) => urlRegex.test(value),
      message: "El avatar debe ser una URL válida",
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
export { urlRegex };
