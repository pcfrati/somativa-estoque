"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
        >
          Sistema de Controle de Estoque
        </h1>
        <p style={{ color: "#666" }}>Carregando...</p>
      </div>
    </div>
  );
}