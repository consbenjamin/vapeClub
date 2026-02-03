"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import CartModal from "./CartModal";
import useStore from "@/store/store";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { data: session } = useSession();
  const { cart, theme, setTheme } = useStore();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [];

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 dark:bg-surface backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-xl sm:text-2xl font-display font-bold text-foreground shrink-0">
              VapeClub
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-brand transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-foreground/80 hover:bg-surface-hover transition-colors"
                aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
              >
                {theme === "dark" ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                className="relative p-2 rounded-lg text-foreground/80 hover:bg-surface-hover transition-colors"
                aria-label="Abrir carrito"
                onClick={() => setIsCartOpen(true)}
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {session ? (
                <div className="hidden md:block relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 rounded-lg py-2 pl-2 pr-3 hover:bg-surface-hover transition-colors"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Usuario"}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-brand text-white text-sm font-semibold flex items-center justify-center">
                        {getInitials(session.user.name)}
                      </span>
                    )}
                    <span className="text-foreground font-medium max-w-[100px] sm:max-w-[120px] truncate">
                      {session.user.name}
                    </span>
                    <svg
                      className={`w-4 h-4 text-foreground/60 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-surface rounded-xl shadow-lg border border-border py-1 z-10">
                      <Link
                        href="/perfil"
                        className="block px-4 py-2.5 text-foreground hover:bg-surface-hover transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-foreground hover:bg-surface-hover transition-colors"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark dark:hover:bg-brand-light transition-colors"
                >
                  Iniciar sesión
                </Link>
              )}

              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-foreground/80 hover:bg-surface-hover transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/20 z-10 md:hidden"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 relative z-20 bg-surface rounded-b-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display font-semibold text-foreground">Menú</span>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg text-foreground/70 hover:bg-surface-hover"
                    aria-label="Cerrar menú"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <span className="text-sm text-foreground/80">Tema</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-surface-hover text-foreground"
                  >
                    {theme === "dark" ? "Claro" : "Oscuro"}
                  </button>
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-3 text-foreground hover:bg-surface-hover rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {session ? (
                    <>
                      <Link
                        href="/perfil"
                        className="px-4 py-3 text-foreground hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {session.user.image ? (
                          <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-brand text-white text-sm font-semibold flex items-center justify-center">
                            {getInitials(session.user.name)}
                          </span>
                        )}
                        Mi Perfil
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="px-4 py-3 text-left text-foreground hover:bg-surface-hover rounded-lg transition-colors"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="px-4 py-3 text-brand font-medium hover:bg-surface-hover rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                  )}
                </nav>
              </div>
            </>
          )}
        </div>
      </header>

      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
