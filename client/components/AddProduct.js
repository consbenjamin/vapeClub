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

  const inputClass = "w-full px-4 py-2 border border-border rounded-lg bg-surface text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand";
  const labelClass = "block text-foreground font-medium mb-1";

  return (
    <div className="max-w-md mx-auto bg-surface border border-border p-6 sm:p-8 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-6 text-center">
        Agregar Producto
      </h2>
      <div className="overflow-y-auto scrollbar-none max-h-[75vh]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={product.nombre}
              onChange={handleChange}
              className={inputClass}
              placeholder="Nombre del producto"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              name="descripcion"
              value={product.descripcion}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              placeholder="Descripción del producto"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Precio</label>
            <input
              type="number"
              name="precio"
              value={product.precio}
              onChange={handleChange}
              className={inputClass}
              placeholder="Precio del producto"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Marca</label>
            <input
              type="text"
              name="marca"
              value={product.marca}
              onChange={handleChange}
              className={inputClass}
              placeholder="Marca del producto"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Sabores</label>
            {product.sabores.map((sabor, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={sabor}
                  onChange={(e) => handleSaborChange(index, e.target.value)}
                  className={inputClass}
                  placeholder="Sabor"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSabor(index)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shrink-0"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSabor}
              className="mt-2 text-brand dark:text-brand-light font-medium hover:underline"
            >
              + Añadir sabor
            </button>
          </div>
          <div>
            <label className={labelClass}>Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`${inputClass} file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-brand file:text-white file:text-sm`}
            />
            {product.imagen && (
              <img
                src={URL.createObjectURL(product?.imagen)}
                alt="Previsualización"
                className="mt-2 max-h-32 w-auto object-contain border border-border rounded-lg bg-surface-hover"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="destacado"
              checked={product.destacado}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-brand focus:ring-brand bg-surface"
            />
            <label className="text-foreground">Destacado</label>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark dark:hover:bg-brand-light text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Agregar Producto
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-surface-hover hover:opacity-90 text-foreground font-semibold py-2 rounded-lg border border-border transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
