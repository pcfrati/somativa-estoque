"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operador",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro bem-sucedido, redireciona para login
        alert("Registro realizado com sucesso! Faça login para continuar.");
        router.push("/login");
      } else {
        setError(data.error || "Erro ao realizar registro");
      }
    } catch (error) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        padding: "1rem",
      }}
    >
      <div className="form-container">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#1a202c",
              marginBottom: "0.5rem",
            }}
          >
            Criar Conta
          </h2>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Almoxarifado Central Ltda.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nome Completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-input"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Cargo *
            </label>
            <select
              id="role"
              name="role"
              required
              className="form-input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="operador">Operador de Estoque</option>
              <option value="gestor">Gestor de Estoque</option>
            </select>
            <small style={{ color: "#666", fontSize: "0.875rem" }}>
              Gestores podem adicionar/editar produtos
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Senha *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="form-input"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>

          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#666", fontSize: "0.875rem" }}>
              Já tem uma conta?{" "}
              <Link
                href="/login"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                Faça login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
