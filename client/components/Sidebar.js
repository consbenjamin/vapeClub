import React from "react";
import Link from "next/link";

const Sidebar = ({ isOpen, onClose, onAddProduct }) => {
  return (
    <>
      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel lateral */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 flex-shrink-0
          bg-surface border-r border-border
          transform transition-transform duration-200 ease-out
          md:relative md:translate-x-0 md:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              Panel de Control
            </h2>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-surface-hover transition-colors"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl text-foreground hover:bg-surface-hover transition-colors font-medium"
              onClick={onClose}
            >
              Volver a la tienda
            </Link>
            <button
              type="button"
              onClick={() => {
                onAddProduct();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark dark:bg-brand-light dark:hover:bg-brand transition-colors text-left"
            >
              Agregar producto
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
