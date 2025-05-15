import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Por favor, preencha e-mail e senha");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://localhost:7238/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro desconhecido no servidor");
      }

      const data = await response.json();
      login(data.token); // Usa o contexto para salvar o token e usuário
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      alert("Verifique se seu e-mail ou senha são válidos");
    } finally {
      setLoading(false);
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
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <label
          style={{ display: "block", textAlign: "left", fontWeight: "bold", marginTop: "10px" }}
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
          disabled={loading}
        />

        <label
          style={{ display: "block", textAlign: "left", fontWeight: "bold", marginTop: "10px" }}
        >
          Senha
        </label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "95%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
          disabled={loading}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            marginTop: "10px",
          }}
        >
          <a
            href="/recuperacao-senha"
            style={{ textDecoration: "none", color: "#003366" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Esqueceu a senha?
          </a>
          <a
            href="/cadastro"
            style={{ textDecoration: "none", color: "#003366" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Cadastrar-se
          </a>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#666" : "#003366",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "15px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.background = "#002244";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.background = "#003366";
          }}
        >
          {loading ? "Entrando..." : "Login"}
        </button>
      </div>
    </div>
  );
}

