const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  sabores: [
    {
      sabor: {
        type: String,
        required: true
      },
    },
  ],
  imagen: {
    type: String,
    required: false,
  },
  destacado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true});

module.exports = mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);