'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Perfil() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // Regresa a la página anterior
  };

  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Por favor, inicia sesión</h1>
        <p className="text-lg text-center text-gray-600">No tienes acceso a esta página sin una sesión activa.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Mi Perfil</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong className="font-semibold">Nombre:</strong> {session.user.name}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong className="font-semibold">Email:</strong> {session.user.email}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-700">
            <strong className="font-semibold">Role:</strong> {session.user.role || "No asignado"}
          </p>
        </div>
        
        {/* Botón para volver */}
        <div className="flex justify-center">
          <button 
            onClick={handleBackClick}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
