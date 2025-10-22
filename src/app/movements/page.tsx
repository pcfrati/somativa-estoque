"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MovementForm from "@/components/MovementForm";

interface Movement {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  type: "entrada" | "saida";
  quantity: number;
  operator: {
    _id: string;
    name: string;
  };
  notes?: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  currentQuantity: number;
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false); // ✅ Definindo showForm
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [movementsResponse, productsResponse] = await Promise.all([
        fetch("/api/movements", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (movementsResponse.ok && productsResponse.ok) {
        const movementsData = await movementsResponse.json();
        const productsData = await productsResponse.json();

        setMovements(movementsData.movements || movementsData);
        setProducts(productsData);
      } else {
        console.error("Erro ao buscar dados");
        if (movementsResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovement = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/movements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setError("");
        fetchData(); // Recarregar os dados
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao registrar movimentação");
      }
    } catch (error: any) {
      throw new Error(error.message || "Erro de conexão");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              Movimentações
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Nova Movimentação
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Modal de Nova Movimentação */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="card">
                  <div className="card-header">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                      Nova Movimentação
                    </h2>
                  </div>
                  <div className="card-body">
                    <MovementForm
                      onSubmit={handleCreateMovement}
                      onCancel={() => {
                        setShowForm(false);
                        setError("");
                      }}
                      products={products}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Movimentações */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                Histórico de Movimentações
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                }}
              >
                Total: {movements.length} movimentações
              </p>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {movements.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Nenhuma movimentação registrada.
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data/Hora</th>
                      <th>Produto</th>
                      <th>Tipo</th>
                      <th>Quantidade</th>
                      <th>Operador</th>
                      <th>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement._id}>
                        <td>{formatDate(movement.createdAt)}</td>
                        <td>
                          <div style={{ fontWeight: "500" }}>
                            {movement.product.name}
                          </div>
                          <div style={{ color: "#666", fontSize: "0.875rem" }}>
                            SKU: {movement.product.sku}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              color:
                                movement.type === "entrada"
                                  ? "#28a745"
                                  : "#dc3545",
                              fontWeight: "500",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "4px",
                              backgroundColor:
                                movement.type === "entrada"
                                  ? "#d4edda"
                                  : "#f8d7da",
                            }}
                          >
                            {movement.type === "entrada" ? "Entrada" : "Saída"}
                          </span>
                        </td>
                        <td style={{ fontWeight: "500", textAlign: "center" }}>
                          {movement.quantity}
                        </td>
                        <td>{movement.operator.name}</td>
                        <td>{movement.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
