import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/TelasLogin/Login";
import Cadastro from "./pages/TelasLogin/Cadastro";
import RecuperacaoSenha from "./pages/TelasLogin/RecuperacaoSenha";
import RedefinirSenha from "./pages/TelasLogin/RedefinirSenha";
import TelaInicial from "./pages/Tela Inicial/TelaInicial"
import BuscarCurso from "./pages/Tela Inicial/BuscarCurso"


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperacao-senha" element={<RecuperacaoSenha />} />
      <Route path="/reset-password" element={<RedefinirSenha />} />
      <Route path="/" element={<TelaInicial />} />
      <Route path="/BuscarCurso" element={<BuscarCurso />} />
    </Routes>
  </Router>
  );
}

export default App;
