import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Header from "../TelasHeadFoot/Header";
import Footer from "../TelasHeadFoot/Footer";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../Tela Inicial/TelaInicial.css";

const AdminFaculdade = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCurso, setEditCurso] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "",
    localização: "",
    descricao: "",
    instituicao: "",
    cargaHoraria: "",
    valor: "",
    link: ""
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== "AdminFaculdade" && user.role !== "AdminGeral")) {
      navigate("/login");
      return;
    }
    fetchCursos();
    // eslint-disable-next-line
  }, [user, navigate]);

  const token = localStorage.getItem('token');

  const fetchCursos = async () => {
    try {
      const response = await axios.get('https://localhost:7238/api/Curso/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCursos(response.data);
    } catch (error) {
      setMensagem('Erro ao buscar cursos.');
    } finally {
      setLoading(false);
    }
  };

  const excluirCurso = async (id) => {
    try {
      await axios.delete(`https://localhost:7227/api/Curso/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('Curso excluído com sucesso.');
      fetchCursos();
    } catch (error) {
      setMensagem('Erro ao excluir curso.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Corrige para sempre atualizar 'localização' no estado, independente do nome do input
    if (name === "localizacao" || name === "localização") {
      setFormData((prev) => ({ ...prev, ["localização"]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const abrirFormNovo = () => {
    setEditCurso(null);
    setFormData({
      titulo: "",
      tipo: "",
      localização: "",
      descricao: "",
      instituicao: "",
      cargaHoraria: "",
      valor: "",
      link: ""
    });
    setShowForm(true);
  };

  const abrirFormEditar = (curso) => {
    setEditCurso(curso);
    setFormData({
      titulo: curso.titulo || "",
      tipo: curso.tipo || "",
      localização: curso.localização || curso.localizacao || "",
      descricao: curso.descricao || "",
      instituicao: curso.instituicao || "",
      cargaHoraria: curso.cargaHoraria || "",
      valor: curso.valor || "",
      link: curso.link || ""
    });
    setShowForm(true);
  };

  const fecharForm = () => {
    setShowForm(false);
    setEditCurso(null);
  };

  const salvarCurso = async (e) => {
    e.preventDefault();
    try {
      if (editCurso) {
        // Editar
        await axios.put(`https://localhost:7238/api/Curso/${editCurso.id}`, {
          id: editCurso.id,
          ...formData
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem('Curso editado com sucesso.');
      } else {
        // Cadastrar
        await axios.post('https://localhost:7238/api/Curso', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem('Curso cadastrado com sucesso.');
      }
      fetchCursos();
      fecharForm();
    } catch (error) {
      setMensagem('Erro ao salvar curso.');
    }
  };

  return (
    <div className="bg-light text-dark" style={{ minHeight: "100vh" }}>
      <Header />
      <div className="mainTheme" style={{ paddingTop: "125px", paddingBottom: "150px" }}>
        <div className="container py-5">
          <h2 className="text-center mb-4">Gerenciar Cursos da Minha Faculdade</h2>
          <div className="mb-4 text-center">
            <Button variant="primary" onClick={abrirFormNovo}>Cadastrar Novo Curso</Button>
          </div>
          {mensagem && <p className="mb-4 text-success text-center">{mensagem}</p>}
          {showForm && (
            <div className="mb-4">
              <form onSubmit={salvarCurso} className="p-3 border rounded bg-white">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">Título</label>
                    <input type="text" className="form-control" name="titulo" value={formData.titulo} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tipo</label>
                    <input type="text" className="form-control" name="tipo" value={formData.tipo} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Localização</label>
                    <input type="text" className="form-control" name="localização" value={formData["localização"]} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Instituição</label>
                    <input type="text" className="form-control" name="instituicao" value={formData.instituicao} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Carga Horária</label>
                    <input type="text" className="form-control" name="cargaHoraria" value={formData.cargaHoraria} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Valor</label>
                    <input type="text" className="form-control" name="valor" value={formData.valor} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Link do Curso</label>
                    <input type="text" className="form-control" name="link" value={formData.link} onChange={handleInputChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-control" name="descricao" value={formData.descricao} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2 justify-content-end">
                  <Button variant="secondary" onClick={fecharForm} type="button">Cancelar</Button>
                  <Button variant="success" type="submit">Salvar</Button>
                </div>
              </form>
            </div>
          )}
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : cursos.length === 0 ? (
            <p className="text-center">Nenhum curso cadastrado ainda.</p>
          ) : (
            <div className="row g-4">
              {cursos.map((curso) => (
                <div key={curso.id} className="col-md-4">
                  <div className="card h-100 shadow detalhe">
                    <div className="card-body">
                      <h5 className="card-title">{curso.titulo}</h5>
                      <p><strong>Tipo:</strong> {curso.tipo || "N/A"}</p>
                      <p><strong>Localização:</strong> {curso.localização || curso.localizacao || "N/A"}</p>
                      <p><strong>Instituição:</strong> {curso.instituicao || "N/A"}</p>
                      <p><strong>Carga Horária:</strong> {curso.cargaHoraria || "N/A"}</p>
                      <p><strong>Valor:</strong> {curso.valor || "N/A"}</p>
                      <p><strong>Descrição:</strong> {curso.descricao || "N/A"}</p>
                      <p><strong>Link:</strong> {curso.link ? <a href={curso.link} target="_blank" rel="noopener noreferrer">Acessar</a> : "N/A"}</p>
                      <div className="mt-3 d-flex gap-2 justify-content-end">
                        <Button onClick={() => abrirFormEditar(curso)} variant="warning">Editar</Button>
                        <Button onClick={() => excluirCurso(curso.id)} variant="danger">Excluir</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminFaculdade;
