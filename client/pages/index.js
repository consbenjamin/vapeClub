import React, { useEffect, useState, useMemo } from "react";
import Card from "@/components/Card";
import Hero from "@/components/Hero";
import Navbar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import useStore from "@/store/store";
import { useRouter } from "next/router";
import Head from "next/head";

function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-xs mx-auto animate-pulse rounded-xl bg-surface-hover dark:bg-surface p-3 border border-border">
      <div className="aspect-[4/3] w-full rounded-lg bg-border" />
      <div className="mt-3 h-5 w-3/4 rounded bg-border" />
      <div className="mt-2 h-4 w-1/2 rounded bg-border" />
      <div className="mt-4 h-6 w-1/3 rounded bg-border" />
    </div>
  );
}

export default function Home() {
  const { products, fetchProducts, loading, error, toggleWishlist, wishlist } = useStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];
    const q = (searchQuery || "").toLowerCase().trim();
    if (q) {
      list = list.filter(
        (p) =>
          (p.nombre && p.nombre.toLowerCase().includes(q)) ||
          (p.marca && p.marca.toLowerCase().includes(q))
      );
    }
    if (sortBy === "price_asc") list.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
    if (sortBy === "price_desc") list.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
    return list;
  }, [products, searchQuery, sortBy]);

  const handleCardClick = (productId) => {
    router.push(`/producto/${productId}`);
  };

  return (
    <>
      <Head>
        <title>VapeClub – Tu tienda de vaping</title>
        <meta name="description" content="Encontrá los mejores productos de vaping. Liquidos, dispositivos y accesorios." />
      </Head>
      <Navbar />
      <div className="flex-grow flex flex-col">
        <Hero />

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 id="productos" className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Productos
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
              <div className="w-full sm:max-w-xs lg:max-w-sm">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <label htmlFor="sort" className="sr-only">Ordenar por</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand bg-surface"
                aria-label="Ordenar productos"
              >
                <option value="recent">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
          {error && (
            <p className="text-center text-red-500 dark:text-red-400 py-8" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-foreground/70 py-12">No hay productos disponibles.</p>
          )}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAndSortedProducts.map((product) => (
                <Card
                  key={product._id}
                  imagen={product.imagen}
                  nombre={product.nombre}
                  precio={product.precio}
                  marca={product.marca}
                  onClick={() => handleCardClick(product._id)}
                  onToggleWishlist={() => toggleWishlist(product)}
                  isWishlisted={wishlist.some((item) => item._id === product._id)}
                  wishlistAriaLabel={
                    wishlist.some((item) => item._id === product._id)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"
                  }
                />
              ))}
            </div>
          )}
          {!loading && !error && products.length > 0 && filteredAndSortedProducts.length === 0 && (
            <p className="text-center text-foreground/70 py-8">No hay productos que coincidan con tu búsqueda.</p>
          )}
        </div>
      </div>
    </>
  );
}
