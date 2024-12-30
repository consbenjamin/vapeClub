const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productosRoutes = require('./routes/productos');
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['https://vape-club-20.vercel.app', 'https://vape-club-20.vercel.app/auth/register', 'https://vape-club-20.vercel.app/auth/login'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

console.log("Variables de entorno:");
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

app.use("/api/productos", productosRoutes);
app.use("/api/user", userRoutes);
app.use('/api/payment', paymentRoutes);


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