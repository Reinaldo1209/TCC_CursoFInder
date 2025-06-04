import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../TelasHeadFoot/Header";

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
    <div>
      <Header />
      <main id="container">
        <form id="login_form" onSubmit={handleRedefinirSenha}>
          <h4></h4>
          <div id="form_header">
            <h1 className="login">Redefinir Senha</h1>
          </div>
          <div id="input">
            <div id="input-box">
              <label htmlFor="password" className="label-write">
                Nova Senha
                <div className="input-field">
                  <i className="fa-solid fa-key icon-login"></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Digite a nova senha"
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </div>
          <button type="submit" className="login-button">
            Redefinir
          </button>
          <div className="mensagem">
            {mensagem}
          </div>
        </form>
      </main>
    </div>
  );
}