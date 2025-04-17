import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleRedefinirSenha = async () => {
    try {
      const response = await fetch("https://localhost:7238/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword: novaSenha }),
      });

      const data = await response.text();
      setMensagem(data);
    } catch (error) {
      setMensagem("Erro ao redefinir senha.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f2f2f2",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Redefinir Senha</h2>

        <label
          style={{
            display: "block",
            textAlign: "left",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          Nova Senha
        </label>
        <input
          type="password"
          placeholder="Digite a nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          style={{
            width: "95%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <button
          onClick={handleRedefinirSenha}
          style={{
            width: "100%",
            background: "#003366",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "15px",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.background = "#002244")}
          onMouseOut={(e) => (e.target.style.background = "#003366")}
        >
          Redefinir
        </button>

        {mensagem && (
          <p style={{ marginTop: "15px", color: "#333", fontSize: "14px" }}>{mensagem}</p>
        )}
      </div>
    </div>
  );
}