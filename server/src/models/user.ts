import mongoose from "mongoose";

// Valida enlaces http(s) con dominio y ruta opcional (avatar / link de tarjeta).
const urlRegex = /^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([/#?]?.*)?$/i;

const DEFAULT_AVATAR =
  "https://practicum-content.s3.us-west-1.amazonaws.com/web-lat/avatar.jpg";

const userSchema = new mongoose.Schema({
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
    maxlength: 40,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: "Explorador",
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
