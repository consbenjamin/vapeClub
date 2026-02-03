import React from "react";
import Image from "next/image";

export default function Card({ imagen, nombre, precio, marca, onClick }) {
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
