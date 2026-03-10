const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const requireAdmin = require("../middlewares/requireAdmin");
const { securityLog } = require("../middlewares/securityLogger");

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
router.put("/profile", authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil actualizado", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const emailRegex = /^\S+@\S+\.\S+$/;
const sanitizeEmail = (e) => String(e).trim().toLowerCase().slice(0, 254);

router.post("/google", async (req, res) => {
  const { email, name, image } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Email y nombre son requeridos" });
  }
  const emailSanitized = sanitizeEmail(email);
  if (!emailRegex.test(emailSanitized)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Configuración del servidor incompleta" });
    }

    let user = await User.findOne({ email: emailSanitized });

    if (!user) {
      user = new User({
        name: String(name).trim().slice(0, 120),
        email: emailSanitized,
        image: typeof image === "string" ? image.slice(0, 500) : null,
        provider: "google",
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password, provider = "credentials" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const emailSanitized = sanitizeEmail(email);
  if (!emailRegex.test(emailSanitized)) {
    return res.status(400).json({ error: "Email inválido" });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }

  try {
    const existingUser = await User.findOne({ email: emailSanitized });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // A02 OWASP: el modelo User tiene pre('save') que hashea; no hashear aquí para evitar doble hash
    const user = new User({
      name: String(name).trim().slice(0, 120),
      email: emailSanitized,
      password,
      provider,
    });

    await user.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  const emailSanitized = sanitizeEmail(email);
  if (!emailRegex.test(emailSanitized)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en el entorno");
    }

    const user = await User.findOne({ email: emailSanitized }).select("+password");
    if (!user) {
      securityLog("LOGIN_FAILED", { reason: "user_not_found", email: emailSanitized });
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      securityLog("LOGIN_FAILED", { reason: "invalid_password", userId: user._id?.toString() });
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role, 
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
