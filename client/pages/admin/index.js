import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";

export default function AdminDashboard() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/productos");
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleView = (producto) => {
    console.log("Ver producto:", producto);
  };

  const handleEdit = (producto) => {
    console.log("Editar producto:", producto);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }
        fetchProductos();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Productos</h1>
      <ProductList
        productos={productos}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
