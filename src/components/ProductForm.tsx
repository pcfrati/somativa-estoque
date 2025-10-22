"use client";

import { useState } from "react";

interface ProductFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    sku: string;
    description: string;
    minQuantity: number;
    currentQuantity: number;
  };
}

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    description: initialData?.description || "",
    minQuantity: initialData?.minQuantity || 0,
    currentQuantity: initialData?.currentQuantity || 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Quantity") ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div className="form-group">
        <label className="form-label">Nome do Produto *</label>
        <input
          type="text"
          name="name"
          required
          className="form-input"
          placeholder="Ex: Caneta Esferográfica Azul"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">SKU *</label>
        <input
          type="text"
          name="sku"
          required
          className="form-input"
          placeholder="Ex: CANETA-AZ-001"
          value={formData.sku}
          onChange={handleChange}
        />
        <small style={{ color: "#666", fontSize: "0.875rem" }}>
          Código único de identificação do produto
        </small>
      </div>

      <div className="form-group">
        <label className="form-label">Descrição</label>
        <textarea
          name="description"
          className="form-input"
          rows={3}
          placeholder="Descrição detalhada do produto..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div className="form-group">
          <label className="form-label">Quantidade Mínima *</label>
          <input
            type="number"
            name="minQuantity"
            required
            min="0"
            className="form-input"
            value={formData.minQuantity}
            onChange={handleChange}
          />
          <small style={{ color: "#666", fontSize: "0.875rem" }}>
            Alerta quando estoque chegar neste nível
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Quantidade Inicial *</label>
          <input
            type="number"
            name="currentQuantity"
            required
            min="0"
            className="form-input"
            value={formData.currentQuantity}
            onChange={handleChange}
          />
        </div>
      </div>

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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? "Salvando..."
            : initialData
            ? "Atualizar"
            : "Criar Produto"}
        </button>
      </div>
    </form>
  );
}
