// pages/admin/index.js

import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";
import Sidebar from "@/components/Sidebar";
import AddProduct from "@/components/AddProduct";
import EditProduct from "@/components/EditProduct";
import useStore from "@/store/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { products, fetchProducts, loading, error } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const URL = process.env.NEXT_PUBLIC_URL; 

  useEffect(() => {
    if (status === "loading") return; // Esperar a que la sesión esté cargada

    // Verificar si el rol del usuario no es 'admin'
    if (!session || session.user.role !== "admin") {
      router.push("/auth/login"); // Redirigir al login si no es admin
    } else {
      fetchProducts(); // Solo ejecutar la carga de productos si es admin
    }
  }, [status, session, router]);

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(
          `${URL}/api/productos/${id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Error al eliminar el producto");
        fetchProducts();
      } catch (error) {
        console.error("Error:", error);
      }
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
        <h1 className="text-2xl font-bold mb-6">
          Panel de Administrador - Productos
        </h1>
        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ProductList
            productos={products}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={handleDelete}
          />
        )}
      </div>
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <AddProduct
            onAdd={(newProduct) => {
              fetchProducts();
              setIsAddProductOpen(false);
            }}
            onCancel={() => setIsAddProductOpen(false)}
          />
        </div>
      )}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <EditProduct
            product={editingProduct}
            onEdit={(updatedProduct) => {
              fetchProducts();
              setEditingProduct(null);
            }}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}
    </div>
  );
}

// Proteger la ruta del lado del servidor
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // Verificar si la sesión existe y si el rol es 'admin'
  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/auth/login", // Redirigir al login si no es admin
        permanent: false,           // Redirección temporal
      },
    };
  }

  return {
    props: {}, // Pasar las props si el usuario tiene el rol adecuado
  };
}
