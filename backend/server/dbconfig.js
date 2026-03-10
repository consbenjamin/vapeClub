const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const productosRoutes = require('./routes/productos');
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5001;

// OWASP A05 - Cabeceras de seguridad
app.use(helmet({ contentSecurityPolicy: false }));

// OWASP A04/A07 - Limitación de tasa para evitar fuerza bruta (auth y APIs sensibles)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Demasiadas solicitudes, intente más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Demasiados intentos de acceso, intente más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://vapeclub.vercel.app',
  'https://vapeclub-production.up.railway.app',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use("/api/productos", apiLimiter, productosRoutes);
app.use("/api/user", authLimiter, userRoutes);
app.use('/api/payment', apiLimiter, paymentRoutes);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err);
    process.exit(1);
  });