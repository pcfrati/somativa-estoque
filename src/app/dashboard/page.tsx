"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Product {
  _id: string;
  name: string;
  sku: string;
  minQuantity: number;
  currentQuantity: number;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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

  const lowStockProducts = products.filter(
    (product) => product.currentQuantity < product.minQuantity
  );

  const totalStock = products.reduce(
    (sum, product) => sum + product.currentQuantity,
    0
  );

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
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Estatísticas */}
            <div className="grid grid-cols-3">
              <div className="card">
                <div className="card-body text-center">
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Total de Produtos
                  </div>
                  <div
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "bold",
                      color: "#1a202c",
                    }}
                  >
                    {products.length}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body text-center">
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Produtos com Estoque Baixo
                  </div>
                  <div
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "bold",
                      color: "#dc3545",
                    }}
                  >
                    {lowStockProducts.length}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body text-center">
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Estoque Total
                  </div>
                  <div
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "bold",
                      color: "#1a202c",
                    }}
                  >
                    {totalStock}
                  </div>
                </div>
              </div>
            </div>

            {/* Produtos com Estoque Baixo */}
            {lowStockProducts.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#1a202c",
                    }}
                  >
                    Produtos com Estoque Baixo
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Atenção: estes produtos estão abaixo da quantidade mínima
                  </p>
                </div>
                <div style={{ borderTop: "1px solid #dee2e6" }}>
                  <div style={{ padding: "0" }}>
                    {lowStockProducts.map((product) => (
                      <div
                        key={product._id}
                        className="critical-stock"
                        style={{
                          padding: "1rem 1.5rem",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div
                              style={{ fontWeight: "500", color: "#1a202c" }}
                            >
                              {product.name}
                            </div>
                            <div
                              style={{ color: "#666", fontSize: "0.875rem" }}
                            >
                              SKU: {product.sku}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{ color: "#dc3545", fontWeight: "500" }}
                            >
                              Estoque: {product.currentQuantity}
                            </div>
                            <div
                              style={{ color: "#666", fontSize: "0.875rem" }}
                            >
                              Mínimo: {product.minQuantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
