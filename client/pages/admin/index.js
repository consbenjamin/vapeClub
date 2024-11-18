import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";
import Sidebar from "@/components/Sidebar";
import AddProduct from "@/components/AddProduct";

export default function AdminDashboard() {
  const [productos, setProductos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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

  return (
    <div className="flex h-screen">
      <button 
        className="md:hidden p-4" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" 
          />
        </svg>
      </button>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onAddProduct={() => setIsAddProductOpen(true)} 
      />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Panel de Administrador - Productos</h1>
        <ProductList
          productos={productos}
          onEdit={(producto) => console.log("Editar producto:", producto)}
          onDelete={async (id) => {
            if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
              try {
                const response = await fetch(`http://localhost:5000/api/productos/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error al eliminar el producto");
                fetchProductos();
              } catch (error) {
                console.error("Error:", error);
              }
            }
          }}
        />
      </div>
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <AddProduct onAdd={AddProduct} onCancel={() => setIsAddProductOpen(false)} />
        </div>
      )}
    </div>
  );
}
