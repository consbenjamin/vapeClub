import React, { useEffect, useState } from "react";
import Head from "next/head";
import ProductDetail from "@/components/ProductDetail";
import Navbar from "@/components/NavBar";
import { useRouter } from "next/router";

const URL = process.env.NEXT_PUBLIC_NEXT_LOCAL_URL || process.env.NEXT_LOCAL_URL || process.env.NEXT_PUBLIC_URL;

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`${URL}/api/productos/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch(() => setProduct(null));
    }
  }, [id]);

  if (!product) {
    return (
      <>
        <Navbar />
        <Head>
          <title>Producto – VapeClub</title>
        </Head>
        <p className="text-center py-12 text-foreground/80">Cargando detalles del producto...</p>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{product.nombre} – VapeClub</title>
        <meta name="description" content={product.descripcion ? product.descripcion.slice(0, 160) : `Comprar ${product.nombre} en VapeClub`} />
      </Head>
      <Navbar />
      <ProductDetail
        key={product._id}
        _id={product._id}
        imagen={product.imagen}
        nombre={product.nombre}
        precio={product.precio}
        marca={product.marca}
        descripcion={product.descripcion}
        sabores={product.sabores}
      />
    </>
  );
}
