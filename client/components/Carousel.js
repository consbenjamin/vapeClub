"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function getVisibleCount() {
  if (typeof window === "undefined") return 4;
  const w = window.innerWidth;
  if (w < 640) return 2;
  if (w < 1024) return 3;
  return 4;
}

export default function Carousel({ products: productsProp = [] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const products = useMemo(() => {
    if (!Array.isArray(productsProp)) return [];
    return productsProp.filter((p) => p.destacado === true);
  }, [productsProp]);

  useEffect(() => {
    setVisibleCount(getVisibleCount());
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / visibleCount));

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (products.length === 0) return null;

  const cardWidthPercent = 100 / visibleCount;

  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3">
        Destacados
      </h2>
      <div className="relative overflow-hidden rounded-xl bg-surface-hover/50 dark:bg-surface border border-border">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            width: `${totalPages * 100}%`,
            transform: `translateX(-${currentPage * (100 / totalPages)}%)`,
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="flex flex-shrink-0 flex-row"
              style={{ width: `${100 / totalPages}%` }}
            >
              {products
                .slice(pageIndex * visibleCount, pageIndex * visibleCount + visibleCount)
                .map((product) => (
                  <div
                    key={product._id}
                    className="flex-shrink-0 px-2 py-2 sm:px-3 sm:py-3"
                    style={{ width: `${cardWidthPercent}%` }}
                  >
                    <Link
                      href={`/producto/${product._id}`}
                      className="flex items-center gap-2 sm:gap-3 rounded-lg bg-surface border border-border p-2 sm:p-3 shadow-sm hover:shadow-md hover:ring-2 hover:ring-brand/30 dark:hover:ring-brand/50 transition-all duration-200 h-full min-h-[80px] sm:min-h-[88px]"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-hover">
                        <Image
                          src={product.imagen}
                          alt={product.nombre}
                          fill
                          sizes="(max-width: 640px) 80px, 96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-display font-semibold text-foreground line-clamp-2">
                          {product.nombre}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-brand dark:text-brand-light mt-0.5">
                          ${Number(product.precio).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <>
            <button
              type="button"
              onClick={prevPage}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface border border-border shadow-sm text-foreground hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors z-10 flex items-center justify-center"
              aria-label="Anterior"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextPage}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface border border-border shadow-sm text-foreground hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors z-10 flex items-center justify-center"
              aria-label="Siguiente"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="flex justify-center gap-1.5 py-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentPage
                      ? "w-5 bg-brand dark:bg-brand-light"
                      : "w-1.5 bg-border hover:bg-foreground/30"
                  }`}
                  aria-label={`Ir a página ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
