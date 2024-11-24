import React, { useEffect } from "react";
import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/NavBar";
import useStore from "@/store/store";

export default function Home() {
  const { products, fetchProducts, loading, error } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
