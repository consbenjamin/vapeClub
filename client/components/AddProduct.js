import React, { useState, useEffect  } from 'react';
import toast from 'react-hot-toast';
import useStore from '../store/store';

export default function AddProduct({ onAdd, onCancel }) {
  const [product, setProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    marca: '',
    sabores: '',
    imagen: '',
    destacado: false,
  });

  const { addProduct, productAdded, set } = useStore();

  useEffect(() => {
    if (productAdded) {
      onCancel();
      window.location.reload();
      set({ productAdded: false });
    }
  }, [productAdded, onCancel, set]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({
        ...prev,
        imagen: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoAEnviar = {
      nombre: product.nombre,
      descripcion: product.descripcion,
      marca: product.marca,
      precio: parseFloat(product.precio),
      sabores: product.sabores.split(',').map((sabor) => ({
        sabor: sabor.trim()
      })),
      destacado: product.destacado,
    };

    const imageFile = product.imagen;

    try {
      await addProduct(productoAEnviar, imageFile);
      toast.success("Producto agregado exitosamente!");
      onClose();
    } catch (error) {
      toast.error("Error al agregar el producto.");
    }
  };

  if (!onAdd) return null;

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg container">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={product.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nombre del producto"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={product.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Descripción del producto"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            value={product.precio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Precio del producto"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Marca</label>
          <input
            type="text"
            name="marca"
            value={product.marca}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Marca del producto"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Sabores <span className="text-sm text-gray-500">(separados por comas)</span></label>
          <input
            type="text"
            name="sabores"
            value={product.sabores}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ej. Fresa, Chocolate"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="destacado"
            checked={product.destacado}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          />
          <label className="text-gray-700">Destacado</label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-150 ease-in-out"
          >
            Agregar Producto
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-150 ease-in-out"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
