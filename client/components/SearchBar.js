import React from "react";

export default function SearchBar({ value, onChange, placeholder = "Buscar por nombre o marca..." }) {
  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="search" className="sr-only">
        Buscar productos
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-foreground placeholder-foreground/50 bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        aria-label="Buscar productos"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none" aria-hidden>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </div>
  );
}
