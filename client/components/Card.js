import React from "react";
import Image from "next/image";

export default function Card({
  imagen,
  nombre,
  precio,
  marca,
  onClick,
  onToggleWishlist,
  isWishlisted = false,
  wishlistAriaLabel = "Agregar a favoritos",
}) {
  return (
    <div className="mx-auto w-full max-w-xs">
      <div
        className="flex h-full min-h-[300px] sm:min-h-[320px] cursor-pointer flex-col rounded-xl bg-surface border border-border p-3 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:ring-2 hover:ring-brand/30 dark:hover:ring-brand/50"
        onClick={onClick}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        role="button"
        tabIndex={0}
        aria-label={`Ver ${nombre}`}
      >
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleWishlist();
            }}
            aria-label={wishlistAriaLabel}
            className={`absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isWishlisted
                ? "bg-brand text-white border-brand shadow-md"
                : "bg-surface text-foreground/70 border-border hover:text-brand hover:border-brand"
            }`}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.001 5.2c1.9-2.08 5.2-2.32 7.38-.64 2.53 1.95 2.66 5.75.4 7.86L12 20.2l-7.78-7.78c-2.26-2.11-2.13-5.91.4-7.86 2.18-1.68 5.48-1.44 7.38.64z"
              />
            </svg>
          </button>
        )}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-hover">
          <Image
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            src={imagen}
            alt={nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="mt-3 flex flex-1 flex-col justify-between">
          <p className="font-display font-semibold text-foreground line-clamp-2">{nombre}</p>
          {marca && (
            <p className="mt-1 text-sm text-foreground/70">{marca}</p>
          )}
          <p className="mt-3 text-xl font-bold text-brand dark:text-brand-light">${Number(precio).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
