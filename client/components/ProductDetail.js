import React, { useState } from "react";
import Image from "next/image";
import useStore from "@/store/store";
import { toast } from "react-hot-toast";

export default function ProductDetail({ _id, nombre, precio, descripcion, marca, imagen, sabores }) {
  const addToCart = useStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [selectedSabor, setSelectedSabor] = useState(sabores?.[0]?.sabor ?? "");

  const handleAddToCart = () => {
    addToCart({ _id, nombre, precio, descripcion, imagen, quantity, sabor: selectedSabor });
    toast.success("Añadido al carrito");
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-hover border border-border shadow-lg">
          <Image
            src={imagen}
            alt={nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{nombre}</h1>
          {marca && (
            <p className="text-foreground/70 font-medium">{marca}</p>
          )}
          <p className="text-2xl sm:text-3xl font-bold text-brand dark:text-brand-light">${Number(precio).toFixed(2)}</p>
          {descripcion && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Descripción</h2>
              <p className="text-foreground/80 leading-relaxed">{descripcion}</p>
            </div>
          )}

          {sabores && sabores.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Sabores</h3>
              <div className="flex flex-wrap gap-2">
                {sabores.map(({ sabor, _id: saborId }) => (
                  <button
                    key={saborId}
                    type="button"
                    onClick={() => setSelectedSabor(sabor)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedSabor === sabor
                        ? "bg-brand text-white ring-2 ring-brand-dark dark:ring-brand-light"
                        : "bg-surface-hover text-foreground hover:bg-brand/10 hover:text-brand dark:hover:text-brand-light"
                    }`}
                  >
                    {sabor}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex items-center gap-3 bg-surface-hover rounded-xl p-2 w-fit">
              <button
                type="button"
                onClick={decrementQuantity}
                className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-surface border border-border text-foreground font-bold text-xl hover:bg-brand/10 hover:text-brand dark:hover:text-brand-light transition-colors"
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className="text-xl font-bold text-foreground min-w-[2rem] text-center">{quantity}</span>
              <button
                type="button"
                onClick={incrementQuantity}
                className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-surface border border-border text-foreground font-bold text-xl hover:bg-brand/10 hover:text-brand dark:hover:text-brand-light transition-colors"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 min-h-[3rem] bg-brand text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-dark dark:hover:bg-brand-light transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
