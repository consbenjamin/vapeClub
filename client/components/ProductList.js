import React from "react";

const ProductList = ({ productos, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Marca
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Sabores
            </th>
            <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Destacado
            </th>
            <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
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
              <td className="px-6 py-4 border-b text-center text-sm text-gray-800">
                {producto.destacado ? "Sí" : "No"}
              </td>
              <td className="px-6 py-4 border-b text-center text-sm">
                <button
                  onClick={() => onView(producto)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                >
                  Ver
                </button>
                <button
                  onClick={() => onEdit(producto)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(producto._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
