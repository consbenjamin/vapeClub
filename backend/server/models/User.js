const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor, usa un email válido"],
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github", "facebook"],
      required: true,
      default: "credentials"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para hashear contraseñas antes de guardar (omitir si no hay password, ej. usuarios Google)
UserSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (inputPassword) {
  const result = await bcrypt.compare(inputPassword, this.password);
  return result;
};

module.exports = mongoose.model("User", UserSchema);
