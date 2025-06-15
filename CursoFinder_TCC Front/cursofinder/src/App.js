import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/TelasLogin/Login";
import Cadastro from "./pages/TelasLogin/Cadastro";
import RecuperacaoSenha from "./pages/TelasLogin/RecuperacaoSenha";
import RedefinirSenha from "./pages/TelasLogin/RedefinirSenha";
import TelaInicial from "./pages/Tela Inicial/TelaInicial";
import BuscarCurso from "./pages/Tela Inicial/BuscarCurso";
import MeusCursosPage from "./pages/Tela Inicial/MeusCursosPage";
import PrivateRoute, { RoleRoute } from "./components/PrivateRoute";
import AdminFaculdade from "./pages/Tela Inicial/AdminFaculdade";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperacao-senha" element={<RecuperacaoSenha />} />
        <Route path="/reset-password" element={<RedefinirSenha />} />
        <Route path="/" element={<TelaInicial />} />
        <Route path="/buscarcurso" element={<BuscarCurso />} />
        <Route path="/meuscursos" element={
          <PrivateRoute>
            <MeusCursosPage />
          </PrivateRoute>
        } />
        <Route path="/adminfaculdade" element={
          <RoleRoute allowedRoles={["AdminFaculdade", "AdminGeral"]}>
            <AdminFaculdade />
          </RoleRoute>
        } />
        {/* Exemplo: rota só para AdminGeral */}
        {/*
        <Route path="/admingeral" element={
          <RoleRoute allowedRoles={["AdminGeral"]}>
            <AdminGeral />
          </RoleRoute>
        } />
        */}
      </Routes>
    </Router>
  );
}

export default App;



