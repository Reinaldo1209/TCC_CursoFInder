import { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { FaMoon, FaSun, FaPhone, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthProvider";
import Header from "../TelasHeadFoot/Header";
import Footer from "../TelasHeadFoot/Footer";
import cursosImg from '../imagens/cursos.png';
import './TelaInicial.css';


export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const mainTheme = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const navTheme = darkMode ? "dark" : "light";
  const navBg = darkMode ? "bg-secondary" : "bg-primary";

  useEffect(() => {
    fetch("https://localhost:7238/api/Curso")
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error("Erro ao buscar cursos públicos:", error));
  }, []);

  const abrirModal = (curso) => {
    setCursoSelecionado(curso);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setCursoSelecionado(null);
  };
  const ultimosCursos = [...cursos].slice(-3).reverse();


  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <div className="mainTheme" style={{ paddingTop: "90px" }}>
        <main className="vitrine">
          <div className="gray-background">
            <div className="header-inner-content-head">
              <div className="header-bottom-side">
                <div className="header-bottom-side-left">
                  <h2>
                    Menos <span className="texto">busca</span>
                    <br /> mais <span className="texto">aprendizado</span>
                  </h2>
                  <button
                    className="article-button"
                    onClick={() => navigate("/buscarcurso")}
                  >
                    Ver Cursos &#8594;
                  </button>
                </div>
                <br />
                <div className="header-bottom-side-right">
                  <img src={cursosImg} alt="Cursos" />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Container className="py-5">
          <h3 className="text-center mb-4">Cursos em Destaque</h3>
          <Row className="g-4">
            {ultimosCursos.map((curso) => (
              <Col key={curso.id} md={4}>
                <Card className="h-100 shadow detalhe">
                  <Card.Body>
                    <Card.Title>{curso.titulo}</Card.Title>
                    <Card.Text>
                      Clique em "Saiba mais" para ver a descrição completa.
                    </Card.Text>
                    <button className="button-inicial" onClick={() => abrirModal(curso)}>
                      Saiba mais
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Modal show={showModal} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>{cursoSelecionado?.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cursoSelecionado && (
            <>
              <h5>{cursoSelecionado.titulo}</h5>
              <p><strong>Descrição:</strong> {cursoSelecionado.descricao}</p>
              <p><strong>Instituição:</strong> {cursoSelecionado.instituicao || "N/A"}</p>
              <p><strong>Carga Horária:</strong> {cursoSelecionado.cargaHoraria || "N/A"}</p>
              <p><strong>Valor:</strong> {cursoSelecionado.valor || "N/A"}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}
