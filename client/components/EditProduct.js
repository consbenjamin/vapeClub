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
      console.error("Error al actualizar el producto", error);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-border rounded-lg bg-surface text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand";
  const labelClass = "block text-foreground font-medium mb-1";

  return (
    <div className="max-w-md mx-auto bg-surface border border-border p-6 sm:p-8 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-6 text-center">
        Editar Producto
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProductUpdate(editedProduct);
        }}
        className="space-y-4 overflow-y-auto scrollbar-none max-h-[75vh]"
      >
        <div>
          <label className={labelClass}>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={editedProduct.nombre || ""}
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
            value={editedProduct.descripcion || ""}
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
            value={editedProduct.precio || ""}
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
            value={editedProduct.marca || ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="Marca del producto"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Sabores</label>
          {editedProduct.sabores &&
            editedProduct.sabores.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={item.sabor || ""}
                  onChange={(e) => {
                    const updatedSabores = [...editedProduct.sabores];
                    updatedSabores[index] = { sabor: e.target.value };
                    setEditedProduct({ ...editedProduct, sabores: updatedSabores });
                  }}
                  className={inputClass}
                  placeholder={`Sabor ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedSabores = editedProduct.sabores.filter((_, i) => i !== index);
                    setEditedProduct({ ...editedProduct, sabores: updatedSabores });
                  }}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 shrink-0"
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
            className="mt-2 px-4 py-2 bg-brand hover:bg-brand-dark dark:hover:bg-brand-light text-white rounded-lg text-sm font-medium"
          >
            Agregar Sabor
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
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="destacado"
            checked={editedProduct.destacado || false}
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
            Guardar Cambios
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
  );
}
