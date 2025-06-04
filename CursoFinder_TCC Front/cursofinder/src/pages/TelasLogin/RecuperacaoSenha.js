import { useState } from "react";
import Header from "../TelasHeadFoot/Header";

export default function RecuperacaoSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleRecuperacao = async (e) => {
    e.preventDefault(); // Evita o reload padrão do form
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
    <div>
      <Header />
      <main id="container">
        <form id="login_form" onSubmit={handleRecuperacao}>
          <h4></h4>
          <div id="form_header">
            <h1 className="login">Recuperar senha</h1>
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </div>
          <button type="submit" className="login-button">
            Enviar
          </button>
          <div className="mensagem">
            {mensagem}
          </div>
        </form>
      </main>
    </div>
  );
}