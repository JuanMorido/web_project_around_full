import mongoose from "mongoose";

// Valida enlaces http(s) con dominio y ruta opcional (avatar / link de tarjeta).
const urlRegex =
  /^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([/#?]?.*)?$/i;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => urlRegex.test(value),
      message: "El avatar debe ser una URL válida",
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
export { urlRegex };
