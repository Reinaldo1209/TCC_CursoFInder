import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Header from "../TelasHeadFoot/Header";
import './login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // Para evitar reload no submit do form
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
    <div>
      <Header />
      <main id="container">
        <form id="login_form" onSubmit={handleLogin}>
          <div id="form_header">
            <h1 className="login">Login</h1>
          </div>
          <div id="input">
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </label>
              <div id="forgot_password">
                <a href="/recuperacao-senha" className="forgot">
                  Esqueceu a senha?
                </a>
                <a href="/cadastro" className="forgot">
                  Cadastre-se
                </a>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
}
