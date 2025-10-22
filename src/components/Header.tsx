"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  user: any;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold"
              style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}
            >
              Controle de Estoque
            </h1>
            <span
              style={{
                marginLeft: "1rem",
                color: "#666",
                fontSize: "0.875rem",
              }}
            >
              {user?.role === "gestor" ? "Gestor" : "Operador"}
            </span>
          </div>

          <nav className="header-nav">
            <span style={{ color: "#666", fontSize: "0.875rem" }}>
              Olá, {user?.name}
            </span>

            <button
              onClick={() => navigateTo("/dashboard")}
              className="nav-button"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigateTo("/products")}
              className="nav-button"
            >
              Produtos
            </button>

            <button
              onClick={() => navigateTo("/movements")}
              className="nav-button"
            >
              Movimentações
            </button>

            <button onClick={handleLogout} className="nav-button">
              Sair
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
