import React from "react";
import Image from "next/image";

export default function Card({ imagen, nombre, precio, marca, onClick }) {
  return (
    
    <div className="mx-auto">
      <div 
        className="max-w-xs cursor-pointer rounded-lg bg-slate-50 p-2 shadow duration-150 hover:scale-105 hover:shadow-md flex flex-col h-full"
        onClick={onClick}
      >
        <Image
          className="w-full rounded-lg object-cover object-center"
          src={imagen}
          alt={nombre}
          width={300}
          height={200}
        />
        <div className="flex flex-col justify-between flex-grow">
          <p className="my-2 pl-4 font-bold text-gray-700">{nombre}</p>
          <p className="mb-4 ml-4 text-sm text-gray-600">{marca}</p>
          <p className="mb-4 ml-4 text-xl font-semibold text-gray-800">${precio}</p>
        </div>
      </div>
    </div>
  );
}