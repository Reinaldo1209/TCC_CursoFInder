import { useState } from "react";

export default function RecuperacaoSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleRecuperacao = async () => {
    try {
      const response = await fetch("https://localhost:7238/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();
      setMensagem(data);
    } catch (error) {
      setMensagem("Insira um e-mail válido ou verifique se você já possui login");
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
        <h2 style={{ marginBottom: "20px" }}>Recuperar Senha</h2>

        <label
          style={{
            display: "block",
            textAlign: "left",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          E-mail
        </label>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "95%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <button
          onClick={handleRecuperacao}
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
          Enviar
        </button>

        {mensagem && (
          <p style={{ marginTop: "15px", color: "#333", fontSize: "14px" }}>{mensagem}</p>
        )}
      </div>
    </div>
  );
}
