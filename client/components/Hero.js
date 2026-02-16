"use client";

import React, { useState, useEffect } from "react";

// Video de vapor multicolor (Pexels - royalty free). Ideal para ecommerce de vapes.
const HERO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/1943483/1943483-uhd_2560_1440_25fps.mp4";

export default function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      aria-label="Bienvenido a VapeClub"
    >
      {/* Video de fondo */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 1440'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230d9488'/%3E%3Cstop offset='100%25' stop-color='%23134e4a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='2560' height='1440'/%3E%3C/svg%3E"
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Overlay para legibilidad y estética */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 dark:from-black/80 dark:via-black/60 dark:to-black/90 transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-100"
          }`}
        />
        {/* Acento de color brand sutil */}
        <div className="absolute inset-0 bg-brand-900/20 dark:bg-brand/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div
          className={`max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-brand-200 dark:text-brand-300 text-sm sm:text-base font-semibold tracking-[0.2em] uppercase mb-3 animate-fade-in">
            Bienvenido a
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-5 tracking-tight drop-shadow-lg animate-slide-up">
            <span className="inline-block">Vape</span>
            <span className="inline-block text-brand-300 dark:text-brand-200 animate-float">
              Club
            </span>
          </h1>
          <p
            className="text-white/90 text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-slide-up"
            style={{ transitionDelay: "400ms" }}
          >
            Productos de calidad, envíos rápidos y el mejor asesoramiento para tu experiencia de vaping.
          </p>
          <div
            className="flex justify-center animate-slide-up"
            style={{ transitionDelay: "600ms" }}
          >
            <a
              href="#productos"
              className="group inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-brand text-white font-semibold shadow-lg shadow-brand/30 hover:bg-brand-light dark:hover:bg-brand-light dark:text-slate-900 hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300"
            >
              Ver productos
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
