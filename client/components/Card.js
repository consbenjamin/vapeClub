import React from "react";
import Image from "next/image";

export default function Card({ imagen, nombre, precio }) {
  return (
    
    <div className="mx-auto">
      <div className="max-w-xs cursor-pointer rounded-lg bg-gray-100 p-2 shadow duration-150 hover:scale-105 hover:shadow-md">
        <Image
          className="w-full rounded-lg object-cover object-center"
          src={imagen}
          alt={nombre}
          width={300}
          height={200}
        />
        <p className="my-4 pl-4 font-bold text-gray-500">{nombre}</p>
        <p className="mb-4 ml-4 text-xl font-semibold text-gray-800">${precio}</p>
      </div>
    </div>
  );
}