import React from "react";

export default function CartModal({ onClose }) {
  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-20">
      <div className="p-4 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4">Tu Carrito</h2>
        <p className="text-gray-600">Aquí aparecerán tus productos seleccionados.</p>
        <button
          onClick={onClose}
          className="mt-auto bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
