import React from 'react';
import Image from 'next/image';
import useStore from "@/store/store";

export default function ProductDetail({ _id, nombre, precio, descripcion, marca, imagen, sabores }) {
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({ _id, nombre, precio, descripcion, imagen });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="relative aspect-square">
          <Image
            src={imagen}
            alt={nombre}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{nombre}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{marca}</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">${precio}</p>
          <p className="text-gray-600">{descripcion}</p>
          
          {sabores && sabores.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">Sabores</h3>
              <div className="flex gap-2 mt-2">
                {sabores.map(({ sabor, _id }) => (
                  <span
                    key={_id}
                    className="px-4 py-2 border rounded-full text-sm text-gray-700 bg-gray-100"
                  >
                    {sabor}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4 mt-6">
          <button
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
