const express = require("express");
const mongoose = require("mongoose");
const Producto = require("../models/Producto");
const cloudinary = require('../../cloudinaryConfig');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const requireAdmin = require("../middlewares/requireAdmin");

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al listar productos" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, marca, sabores } = req.body;
    if (!nombre || !descripcion || !marca) {
      return res.status(400).json({ error: "Nombre, descripción y marca son obligatorios" });
    }
    const precioNum = Number(precio);
    if (Number.isNaN(precioNum) || precioNum < 0) {
      return res.status(400).json({ error: "Precio debe ser un número mayor o igual a 0" });
    }
    const saboresSanitized = Array.isArray(sabores)
      ? sabores.slice(0, 50).map((s) => ({ sabor: String(s?.sabor ?? s).trim().slice(0, 100) })).filter((s) => s.sabor)
      : [];

    const nuevoProducto = new Producto({
      nombre: String(nombre).trim().slice(0, 200),
      descripcion: String(descripcion).trim().slice(0, 2000),
      precio: precioNum,
      marca: String(marca).trim().slice(0, 100),
      sabores: saboresSanitized,
      imagen: '',
    });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

router.post('/:id/imagen', authenticateToken, requireAdmin, upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Se debe proporcionar una imagen.' });
    }
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { imagen: uploadResult.secure_url },
      { new: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(400).json({ error: 'Error al subir la imagen' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    const updates = {};
    if (req.body.nombre != null) updates.nombre = String(req.body.nombre).trim().slice(0, 200);
    if (req.body.descripcion != null) updates.descripcion = String(req.body.descripcion).trim().slice(0, 2000);
    if (req.body.precio != null) {
      const p = Number(req.body.precio);
      if (Number.isNaN(p) || p < 0) return res.status(400).json({ error: 'Precio inválido' });
      updates.precio = p;
    }
    if (req.body.marca != null) updates.marca = String(req.body.marca).trim().slice(0, 100);
    if (req.body.sabores != null && Array.isArray(req.body.sabores)) {
      updates.sabores = req.body.sabores.slice(0, 50).map((s) => ({ sabor: String(s?.sabor ?? s).trim().slice(0, 100) })).filter((s) => s.sabor);
    }
    const producto = await Producto.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.put('/:id/imagen', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere una imagen para actualizar.' });
    }
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { imagen: uploadResult.secure_url },
      { new: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar la imagen del producto:', error);
    res.status(400).json({ error: 'Error al actualizar la imagen' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;