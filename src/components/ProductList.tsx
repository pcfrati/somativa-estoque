"use client";

import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  minQuantity: number;
  currentQuantity: number;
}

interface ProductListProps {
  products: Product[];
  userRole: string;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductList({
  products,
  userRole,
  onEdit,
  onDelete,
}: ProductListProps) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const getStockStatus = (product: Product) => {
    if (product.currentQuantity === 0) {
      return { text: "Sem Estoque", class: "critical-stock" };
    } else if (product.currentQuantity < product.minQuantity) {
      return { text: "Estoque Baixo", class: "critical-stock" };
    } else if (product.currentQuantity <= product.minQuantity * 1.5) {
      return { text: "Atenção", class: "low-stock" };
    } else {
      return { text: "Normal", class: "" };
    }
  };

  const getStockPercentage = (product: Product) => {
    if (product.minQuantity === 0) return 100;
    return Math.min(100, (product.currentQuantity / product.minQuantity) * 100);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {products.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <p style={{ color: "#666" }}>Nenhum produto cadastrado.</p>
          </div>
        </div>
      ) : (
        products.map((product) => {
          const status = getStockStatus(product);
          const stockPercentage = getStockPercentage(product);

          return (
            <div key={product._id} className={`card ${status.class}`}>
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h3
                        style={{
                          fontWeight: "600",
                          fontSize: "1.125rem",
                          margin: 0,
                        }}
                      >
                        {product.name}
                      </h3>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          backgroundColor: status.class.includes("critical")
                            ? "#dc3545"
                            : status.class.includes("low")
                            ? "#ffc107"
                            : "#28a745",
                          color: status.class.includes("low") ? "#000" : "#fff",
                        }}
                      >
                        {status.text}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: "2rem",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ color: "#666", fontSize: "0.875rem" }}>
                          SKU
                        </div>
                        <div style={{ fontWeight: "500" }}>{product.sku}</div>
                      </div>

                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span style={{ color: "#666", fontSize: "0.875rem" }}>
                            Nível de Estoque:
                          </span>
                          <div
                            style={{
                              width: "100px",
                              height: "8px",
                              backgroundColor: "#e9ecef",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${stockPercentage}%`,
                                height: "100%",
                                backgroundColor:
                                  stockPercentage < 50
                                    ? "#dc3545"
                                    : stockPercentage < 100
                                    ? "#ffc107"
                                    : "#28a745",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "2rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          <span>
                            <strong>Atual:</strong> {product.currentQuantity}
                          </span>
                          <span>
                            <strong>Mínimo:</strong> {product.minQuantity}
                          </span>
                          <span
                            style={{
                              color:
                                product.currentQuantity < product.minQuantity
                                  ? "#dc3545"
                                  : "#666",
                            }}
                          >
                            <strong>Diferença:</strong>{" "}
                            {product.currentQuantity - product.minQuantity}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => toggleExpand(product._id)}
                          className="btn btn-secondary"
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
                        >
                          {expandedProduct === product._id
                            ? "Ocultar"
                            : "Detalhes"}
                        </button>

                        {userRole === "gestor" && onEdit && (
                          <button
                            onClick={() => onEdit(product)}
                            className="btn btn-primary"
                            style={{
                              fontSize: "0.875rem",
                              padding: "0.5rem 1rem",
                            }}
                          >
                            Editar
                          </button>
                        )}

                        {userRole === "gestor" && onDelete && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Tem certeza que deseja excluir o produto "${product.name}"?`
                                )
                              ) {
                                onDelete(product._id);
                              }
                            }}
                            className="btn btn-danger"
                            style={{
                              fontSize: "0.875rem",
                              padding: "0.5rem 1rem",
                            }}
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalhes Expandidos */}
                {expandedProduct === product._id && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "4px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <div style={{ marginBottom: "0.5rem" }}>
                      <strong>Descrição:</strong>{" "}
                      {product.description || "Nenhuma descrição fornecida."}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#666" }}>
                      <strong>ID:</strong> {product._id}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}