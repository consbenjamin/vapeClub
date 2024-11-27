import React from "react";
import useStore from "@/store/store";

export default function CartModal({ onClose }) {
  
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-20">
      <div className="p-4 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4">Tu Carrito</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold">{item.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    ${item.precio} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="mt-4 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
          >
            Vaciar Carrito
          </button>
        )}
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
