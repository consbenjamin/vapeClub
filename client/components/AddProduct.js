import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useStore from "../store/store";

export default function AddProduct({ onAdd, onCancel }) {
  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    marca: "",
    sabores: [],
    imagen: null,
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
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddSabor = () => {
    setProduct((prev) => ({
      ...prev,
      sabores: [...prev.sabores, ""],
    }));
  };

  const handleRemoveSabor = (index) => {
    setProduct((prev) => ({
      ...prev,
      sabores: prev.sabores.filter((_, i) => i !== index),
    }));
  };

  const handleSaborChange = (index, value) => {
    const newSabores = [...product.sabores];
    newSabores[index] = value;
    setProduct((prev) => ({ ...prev, sabores: newSabores }));
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
      sabores: product.sabores.filter((sabor) => sabor.trim() !== "").map((sabor) => ({ sabor: sabor.trim() })),
      destacado: product.destacado,
    };

    try {
      await addProduct(productoAEnviar, product.imagen);
      toast.success("Producto agregado exitosamente!");
      onAdd();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      toast.error("Error al agregar el producto.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg container">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Agregar Producto
      </h2>
      <div className="overflow-y-scroll scrollbar-none max-h-[75vh]"> 
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={product.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 resize-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400"
              placeholder="Marca del producto"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Sabores</label>
            {product.sabores.map((sabor, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={sabor}
                  onChange={(e) => handleSaborChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400"
                  placeholder="Sabor"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSabor(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSabor}
              className="mt-2 text-blue-500"
            >
              + Añadir sabor
            </button>
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400"
            />
            {product.imagen && (
              <img
                src={URL.createObjectURL(product?.imagen)}
                alt="Previsualización"
                className="mt-2 max-h-32 w-auto object-contain border border-gray-300 rounded-lg"
              />
            )}
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
    </div>
  );
}
