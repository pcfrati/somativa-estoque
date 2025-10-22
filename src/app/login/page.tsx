"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ Adicione esta linha

export default function LoginPage() {
  // ... resto do código permanece igual ...
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.error || "Erro ao fazer login");
      }
    } catch (error) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
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
            Sistema de Estoque
          </h2>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Almoxarifado Central Ltda.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#666", fontSize: "0.875rem" }}>
              Não tem uma conta?{" "}
              <Link
                href="/register"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                Crie uma aqui
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
