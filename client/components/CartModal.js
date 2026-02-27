import useStore from "@/store/store";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Wallet } from "@mercadopago/sdk-react";

export default function CartModal({ onClose }) {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);

  const URL = process.env.NEXT_PUBLIC_NEXT_LOCAL_URL || process.env.NEXT_LOCAL_URL || process.env.NEXT_PUBLIC_URL;

  const subtotal = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }
    if (!URL) {
      toast.error(
        "URL del backend no configurada. Revisá .env.local (NEXT_PUBLIC_NEXT_LOCAL_URL) y reiniciá el dev server."
      );
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/api/payment/create_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detailMsg =
          typeof data.details === "string"
            ? data.details
            : data.details?.message;
        toast.error(
          detailMsg || data.error || "No se pudo crear la preferencia de pago"
        );
        return;
      }
      if (!data.id) {
        toast.error(data.error || "No se recibió la preferencia de pago");
        return;
      }
      const hasPublicKey = !!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY?.trim();
      if (!hasPublicKey && data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      setPreferenceId(data.id);
    } catch (error) {
      toast.error(error.message || "Hubo un problema al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-20 md:bg-black/20"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar carrito"
      />
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-surface border-l border-border shadow-2xl z-30 overflow-y-auto flex flex-col">
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Tu Carrito</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-foreground/70 hover:bg-surface-hover transition-colors"
              aria-label="Cerrar carrito"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-foreground/70 py-8">Tu carrito está vacío.</p>
          ) : (
            <ul className="space-y-4 flex-1">
              {cart.map((item) => (
                <li
                  key={`${item._id}-${item.sabor || ""}`}
                  className="flex items-center gap-3 sm:gap-4 bg-surface-hover p-3 rounded-xl"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-border">
                    <Image
                      src={item.imagen || "/images/placeholder.png"}
                      alt={item.nombre}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.nombre}</h3>
                    {item.sabor && (
                      <p className="text-sm text-foreground/70">Sabor: {item.sabor}</p>
                    )}
                    <p className="text-sm text-brand dark:text-brand-light font-medium">
                      ${Number(item.precio).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id, item.sabor)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition-colors shrink-0"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between items-center text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-brand dark:text-brand-light">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {!preferenceId ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark dark:hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Procesando..." : "Pagar con Mercado Pago"}
                    </button>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="w-full py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-surface-hover transition-colors"
                    >
                      Vaciar carrito
                    </button>
                  </>
                ) : process.env.NEXT_PUBLIC_MP_PUBLIC_KEY?.trim() ? (
                  <>
                    <div className="min-h-[48px]">
                      <Wallet initialization={{ preferenceId }} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreferenceId(null)}
                      className="w-full py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-surface-hover transition-colors"
                    >
                      Volver al carrito
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-foreground/70 py-2">Clave de Mercado Pago no configurada. Volvé a intentar más tarde.</p>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-6 py-2.5 rounded-xl bg-surface-hover text-foreground font-medium hover:opacity-90 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
}
