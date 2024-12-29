import React, { useEffect, useState } from 'react';
import ProductDetail from '@/components/ProductDetail';
import Navbar from '@/components/NavBar';
import { useRouter } from 'next/router';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  const URL = process.env.NEXT_PUBLIC_URL;  

  useEffect(() => {
    if (id) {
      fetch(`${URL}/api/productos/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error('Error fetching product:', err));
    }
  }, [id]);

  if (!product) {
    return (
      <>
        <Navbar />
        <p className="text-center py-8">Cargando detalles del producto...</p>
      </>
    );
  }

  return (
    <>
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
