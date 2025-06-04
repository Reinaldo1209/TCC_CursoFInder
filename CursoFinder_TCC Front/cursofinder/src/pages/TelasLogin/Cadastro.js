import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../TelasHeadFoot/Header";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault(); // Evita o reload da página ao submeter o formulário
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
    <div>
      <Header />
      <main id="container" className="container-cad">
        <form id="login_form" onSubmit={handleCadastro}>
          <h4></h4>
          <div id="form_header">
            <h1 className="login">Cadastro</h1>
          </div>
          <div id="input">
            <div id="input-box">
              <label htmlFor="name" className="label-write">
                Nome
                <div className="input-field">
                  <i className="fa-solid fa-user icon-login"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div id="input-box">
              <label htmlFor="email" className="label-write">
                E-mail
                <div className="input-field">
                  <i className="fa-solid fa-envelope icon-login"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div id="input-box">
              <label htmlFor="password" className="label-write">
                Senha
                <div className="input-field">
                  <i className="fa-solid fa-key icon-login"></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div id="forgot_password">
              <a href="/login" className="forgot">
                Já possui cadastro?
              </a>
            </div>
          </div>
          <button type="submit" className="login-button">
            Cadastrar
          </button>
        </form>
      </main>
    </div>
  );
}
