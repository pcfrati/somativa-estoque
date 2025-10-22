"use client";

import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  sku: string;
  currentQuantity: number;
}

interface MovementFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  products: Product[];
}

export default function MovementForm({
  onSubmit,
  onCancel,
  products,
}: MovementFormProps) {
  const [formData, setFormData] = useState({
    productId: "",
    type: "entrada",
    quantity: 1,
    notes: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (formData.productId) {
      const product = products.find((p) => p._id === formData.productId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.productId) {
      setError("Selecione um produto");
      return;
    }

    if (formData.quantity <= 0) {
      setError("A quantidade deve ser maior que zero");
      return;
    }

    if (formData.type === "saida" && selectedProduct) {
      if (selectedProduct.currentQuantity < formData.quantity) {
        setError(
          `Quantidade insuficiente em estoque. Disponível: ${selectedProduct.currentQuantity}`
        );
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.message || "Erro ao registrar movimentação");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
    setError(""); // Limpar erro quando o usuário modificar algo
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Produto *</label>
        <select
          name="productId"
          required
          className="form-input"
          value={formData.productId}
          onChange={handleChange}
        >
          <option value="">Selecione um produto</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} ({product.sku}) - Estoque:{" "}
              {product.currentQuantity}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Tipo de Movimentação *</label>
        <select
          name="type"
          required
          className="form-input"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="entrada">Entrada no Estoque</option>
          <option value="saida">Saída do Estoque</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Quantidade *</label>
        <input
          type="number"
          name="quantity"
          required
          min="1"
          className="form-input"
          value={formData.quantity}
          onChange={handleChange}
        />
        {selectedProduct && formData.type === "saida" && (
          <small style={{ color: "#666", fontSize: "0.875rem" }}>
            Estoque atual: {selectedProduct.currentQuantity} unidades
          </small>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Observações</label>
        <textarea
          name="notes"
          className="form-input"
          rows={3}
          placeholder="Motivo da movimentação, número de requisição, etc."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* Informações de Validação */}
      {selectedProduct && formData.type === "saida" && (
        <div
          className={
            formData.quantity > selectedProduct.currentQuantity
              ? "alert alert-error"
              : "alert alert-success"
          }
        >
          {formData.quantity > selectedProduct.currentQuantity ? (
            <strong>Atenção:</strong>
          ) : (
            <strong>Confirmação:</strong>
          )}{" "}
          {formData.quantity > selectedProduct.currentQuantity
            ? `A quantidade de saída (${formData.quantity}) é maior que o estoque disponível (${selectedProduct.currentQuantity})`
            : `Estoque após saída: ${
                selectedProduct.currentQuantity - formData.quantity
              } unidades`}
        </div>
      )}

      {selectedProduct && formData.type === "entrada" && (
        <div className="alert alert-success">
          <strong>Confirmação:</strong> Estoque após entrada:{" "}
          {selectedProduct.currentQuantity + formData.quantity} unidades
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            loading ||
            (formData.type === "saida" &&
              selectedProduct &&
              formData.quantity > selectedProduct.currentQuantity)
          }
        >
          {loading ? "Registrando..." : "Registrar Movimentação"}
        </button>
      </div>
    </form>
  );
}