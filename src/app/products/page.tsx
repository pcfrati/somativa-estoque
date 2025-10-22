"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";

interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  minQuantity: number;
  currentQuantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro ao buscar produtos");
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (formData: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setShowForm(false);
      fetchProducts();
    } else {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar produto");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    // Implementar exclusão se necessário
    console.log("Excluir produto:", productId);
    alert("Funcionalidade de exclusão será implementada em breve");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "1.125rem" }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Header user={user} />

      <main className="container" style={{ padding: "2rem 0" }}>
        <div className="p-4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#1a202c",
              }}
            >
              Produtos
            </h1>
            {user?.role === "gestor" && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="btn btn-primary"
              >
                Novo Produto
              </button>
            )}
          </div>

          {/* Modal do Formulário */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="card">
                  <div className="card-header">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                      {editingProduct ? "Editar Produto" : "Novo Produto"}
                    </h2>
                  </div>
                  <div className="card-body">
                    <ProductForm
                      onSubmit={handleCreateProduct}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                      }}
                      initialData={editingProduct || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Produtos */}
          <ProductList
            products={products}
            userRole={user?.role}
            onEdit={user?.role === "gestor" ? handleEditProduct : undefined}
            onDelete={user?.role === "gestor" ? handleDeleteProduct : undefined}
          />
        </div>
      </main>
    </div>
  );
}
