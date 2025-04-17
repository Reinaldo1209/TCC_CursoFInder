import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async () => {
    try {
      const response = await fetch("https://localhost:7238/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: nome,
          email: email,
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao cadastrar:", data);
        throw new Error("Erro ao cadastrar usuário");
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
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
        <h2 style={{ marginBottom: "20px" }}>Cadastrar</h2>

        <label style={{ display: "block", textAlign: "left", fontWeight: "bold", marginTop: "10px" }}>
          Nome
        </label>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "95%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <label style={{ display: "block", textAlign: "left", fontWeight: "bold", marginTop: "10px" }}>
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

        <label style={{ display: "block", textAlign: "left", fontWeight: "bold", marginTop: "10px" }}>
          Senha
        </label>
        <input
          type="password"
          placeholder="Crie uma senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "95%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <button
          onClick={handleCadastro}
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
          Cadastrar
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Já tem uma conta?{" "}
          <Link
            to="/Login"
            style={{
              textDecoration: "none",
              color: "#003366",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
