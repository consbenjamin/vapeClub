import React, { useEffect } from "react";
import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/NavBar";
import useStore from "@/store/store";
import { useRouter } from "next/router";

export default function Home() {
  const { products, fetchProducts, loading, error } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCardClick = (productId) => {
    router.push(`/producto/${productId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {loading && <p className="text-center">Cargando productos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product._id} 
              imagen={product.imagen} 
              nombre={product.nombre} 
              precio={product.precio}
              marca={product.marca}
              onClick={() => handleCardClick(product._id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
