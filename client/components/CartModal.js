import useStore from "@/store/store";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CartModal({ onClose }) {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    try {
      setIsLoading(true);
      
      // Llamada a la API de preferencia de pago
      const response = await fetch('http://localhost:5000/api/payment/create_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart })
      });

      if (!response.ok) {
        throw new Error('No se pudo crear la preferencia de pago');
      }

      const data = await response.json();

      // Redirigir al punto de inicio de pago
      window.location.href = data.init_point;
    } catch (error) {
      console.error('Error en el checkout:', error);
      toast.error("Hubo un problema al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };


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

        {cart.length > 0 && (
          <button
            onClick={handleCheckout}
            className="mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Comprar
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
