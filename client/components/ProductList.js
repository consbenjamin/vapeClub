import React from "react";
import Image from "next/image";

export default function ProductList ({ productos, onEdit, onDelete }) {
  
  const headerClasses = "px-4 sm:px-6 py-3 border-b border-border text-sm font-bold text-foreground uppercase tracking-wider";

  const columns = [
    { name: "Nombre", align: "left" },
    { name: "Descripción", align: "left" },
    { name: "Precio", align: "left" },
    { name: "Marca", align: "left" },
    { name: "Sabores", align: "left" },
    { name: "Imagen", align: "left" },
    { name: "Destacado", align: "center" },
    { name: "Acciones", align: "center" },
  ];

  return (
    <div className="overflow-x-auto border border-border rounded-xl shadow-sm bg-surface">
      <table className="min-w-full bg-surface">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.name}
                className={`${headerClasses} ${col.align === "center" ? "text-center" : "text-left"}`}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto._id} className="hover:bg-surface-hover">
              <td className="px-4 sm:px-6 py-4 border-b border-border text-sm text-foreground max-w-[120px] truncate">{producto.nombre}</td>
              <td className="px-4 sm:px-6 py-4 border-b border-border text-sm text-foreground max-w-[150px] truncate">{producto.descripcion}</td>
              <td className="px-4 sm:px-6 py-4 border-b border-border text-sm text-foreground">${Number(producto.precio).toFixed(2)}</td>
              <td className="px-4 sm:px-6 py-4 border-b border-border text-sm text-foreground">{producto.marca}</td>
              <td className="px-4 sm:px-6 py-4 border-b border-border text-sm text-foreground max-w-[120px] truncate">
                {producto.sabores?.map((s) => s.sabor).join(", ") || "—"}
              </td>
              <td className="px-4 sm:px-6 py-4 border-b border-border text-sm text-foreground">
                <Image
                  width={64}
                  height={64}
                  src={producto?.imagen} 
                  alt={producto.nombre} 
                  className="w-16 h-16 object-cover rounded-md" />
              </td>
              <td className="px-4 sm:px-6 py-4 border-b border-border text-center text-sm text-foreground">
                {producto.destacado ? "Sí" : "No"}
              </td>
              <td className="px-4 sm:px-6 py-4 border-b border-border text-center text-sm">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => onEdit(producto)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(producto._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
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
