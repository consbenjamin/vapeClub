import { useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ProductList from "@/components/ProductList";
import Sidebar from "@/components/Sidebar";
import AddProduct from "@/components/AddProduct";
import EditProduct from "@/components/EditProduct";
import useStore from "@/store/store";

const URL = process.env.NEXT_PUBLIC_NEXT_LOCAL_URL || process.env.NEXT_LOCAL_URL || process.env.NEXT_PUBLIC_URL;

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { products, fetchProducts, loading, error } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") {
      router.replace("/auth/login");
      return;
    }
    fetchProducts();
  }, [status, session, router, fetchProducts]);

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    try {
      const response = await fetch(`${URL}/api/productos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el producto");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading" || (!session && status !== "unauthenticated")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground">Cargando...</p>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return (
    <>
      <Head>
        <title>Panel de administración – VapeClub</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="flex min-h-screen bg-background">
        <button
          type="button"
          className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-surface border border-border shadow-sm text-foreground hover:bg-surface-hover transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
          </svg>
        </button>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onAddProduct={() => setIsAddProductOpen(true)}
        />
        <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Panel de administración
          </h1>
          <p className="text-foreground/80 mb-6">
            {Array.isArray(products) ? products.length : 0} producto(s) en catálogo
          </p>
          {loading ? (
            <p className="text-foreground/80">Cargando productos...</p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400">{error}</p>
          ) : (
            <ProductList
              productos={products}
              onEdit={(product) => setEditingProduct(product)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <AddProduct
            onAdd={() => {
              fetchProducts();
              setIsAddProductOpen(false);
            }}
            onCancel={() => setIsAddProductOpen(false)}
          />
        </div>
      )}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <EditProduct
            product={editingProduct}
            onEdit={() => {
              fetchProducts();
              setEditingProduct(null);
            }}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}
    </>
  );
}
