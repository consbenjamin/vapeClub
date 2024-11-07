const express = require("express");
const Producto = require("../models/Producto");
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, marca, sabores, destacado } = req.body;
  
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      marca,
      sabores,
      imagen: '',
      destacado,
    });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

module.exports = router;