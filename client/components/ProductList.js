import React from "react";

const ProductList = ({ productos, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Marca
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Sabores
            </th>
            <th className="px-6 py-3 border-b text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
              Imagen
            </th>
            <th className="px-6 py-3 border-b text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
              Destacado
            </th>
            <th className="px-6 py-3 border-b text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto._id} className="hover:bg-gray-100">
              <td className="px-6 py-4 border-b text-sm text-gray-800">
                {producto.nombre}
              </td>
              <td className="px-6 py-4 border-b text-sm text-gray-800">
                {producto.descripcion}
              </td>
              <td className="px-6 py-4 border-b text-sm text-gray-800">
                ${producto.precio.toFixed(2)}
              </td>
              <td className="px-6 py-4 border-b text-sm text-gray-800">
                {producto.marca}
              </td>
              <td className="px-6 py-4 border-b text-sm text-gray-800">
                {producto.sabores.map((sabor) => sabor.sabor).join(", ")}
              </td>
              <td className="px-6 py-4 border-b text-sm text-gray-800">
                <img
                  src={producto?.imagen}
                  alt={producto.nombre}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </td>
              <td className="px-6 py-4 border-b text-center tex t-sm text-gray-800">
                {producto.destacado ? "Sí" : "No"}
              </td>
              <td className="px-6 py-4 border-b text-center text-sm">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => onEdit(producto)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(producto._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
