import useStore from "@/store/store";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CartModal({ onClose }) {
  
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/payment/create_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la preferencia de pago");
      }

      const data = await response.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error en el checkout:", error);
      toast.error("Hubo un problema al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-gray-100 dark:bg-gray-900 shadow-xl z-20 overflow-y-auto">
      <div className="p-4 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Tu Carrito</h2>

        {cart.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Tu carrito está vacío.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow"
              >
                <Image
                  src={item.imagen || "/images/placeholder.png"}
                  alt={item.nombre}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.nombre}</h3>
                  {item.sabor && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sabor: {item.sabor}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${item.precio} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id, item.sabor)}
                  className="text-red-500 hover:text-red-600 transition font-bold"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        {cart.length > 0 && (
          <>
            <button
              onClick={clearCart}
              className="mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Vaciar Carrito
            </button>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className={`mt-4 py-2 rounded-lg transition ${
                isLoading
                  ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isLoading ? "Procesando..." : "Comprar"}
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-auto bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
