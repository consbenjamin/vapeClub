import React from "react";
import Head from "next/head";
import Navbar from "@/components/NavBar";
import Card from "@/components/Card";
import useStore from "@/store/store";
import { useRouter } from "next/router";

export default function FavoritosPage() {
  const router = useRouter();
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);

  const handleCardClick = (productId) => {
    router.push(`/producto/${productId}`);
  };

  return (
    <>
      <Head>
        <title>Favoritos – VapeClub</title>
        <meta name="description" content="Tu lista de productos favoritos en VapeClub." />
      </Head>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Favoritos</h1>
          <span className="text-sm text-foreground/70">
            {wishlist.length} {wishlist.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-foreground/80 text-lg">Tu lista está vacía.</p>
            <p className="text-foreground/60 mt-2">Guardá productos para verlos acá.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <Card
                key={product._id}
                imagen={product.imagen}
                nombre={product.nombre}
                precio={product.precio}
                marca={product.marca}
                onClick={() => handleCardClick(product._id)}
                onToggleWishlist={() => toggleWishlist(product)}
                isWishlisted
                wishlistAriaLabel="Quitar de favoritos"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
