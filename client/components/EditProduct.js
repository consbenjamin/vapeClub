import React, { useState } from "react";
import useStore from "../store/store";
import toast from "react-hot-toast";

export default function EditProduct({ product = {}, onEdit, onCancel }) {
  const { editProduct, fetchProducts } = useStore();
  const [editedProduct, setEditedProduct] = useState(product);
  const [newImage, setNewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: 
        name === "sabores" 
        ? value.split(",").map((s) => s.trim())
        : type === "checkbox" 
        ? checked 
        : value,
    });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleProductUpdate = async () => {
    try {
      await editProduct(editedProduct, newImage);
      fetchProducts();
      onEdit(); 
    } catch (error) {
      toast.error("Error al actualizar el producto");
      console.error("Error al actualizar el producto:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg container">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Editar Producto</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProductUpdate(editedProduct);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-gray-600 font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={editedProduct.nombre || ""}
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
            value={editedProduct.descripcion || ""}
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
            value={editedProduct.precio || ""}
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
            value={editedProduct.marca || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Marca del producto"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Sabores
          </label>
          {editedProduct.sabores && editedProduct.sabores.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item.sabor || ""}
                onChange={(e) => {
                  const updatedSabores = [...editedProduct.sabores];
                  updatedSabores[index] = { sabor: e.target.value };
                  setEditedProduct({ ...editedProduct, sabores: updatedSabores });
                }}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={`Sabor ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const updatedSabores = editedProduct.sabores.filter((_, i) => i !== index);
                  setEditedProduct({ ...editedProduct, sabores: updatedSabores });
                }}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const updatedSabores = [...(editedProduct.sabores || []), { sabor: "" }];
              setEditedProduct({ ...editedProduct, sabores: updatedSabores });
            }}
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Agregar Sabor
          </button>
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
            checked={editedProduct.destacado || false}
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
            Guardar Cambios
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
