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
    <div className={mainTheme} style={{ minHeight: "100vh" }}>
      <Navbar expand="lg" variant={navTheme} className={`${navBg} py-3`} fixed="top">
        <Container>
          <Navbar.Brand href="#" className="fw-bold text-white">
            Curso<span className="text-warning">Finder</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              {isAuthenticated ? (
                <>
                  
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => {
                      logout();
                    }}
                    className="d-flex align-items-center gap-1"
                    title="Logout"
                  >
                    <FaSignOutAlt />
                    Sair
                  </Button>
                </>
              ) : (
                <Button variant="light" size="sm" onClick={() => navigate("/login")}>
                  <FaUser className="me-2" />
                  Login
                </Button>
              )}

              <Button
                variant={darkMode ? "light" : "dark"}
                size="sm"
                onClick={toggleDarkMode}
                title={darkMode ? "Modo claro" : "Modo escuro"}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ paddingTop: "90px" }}>
        <Container className="text-center py-5">
          <h2 className="fw-bold">
            Menos <span className="text-primary">busca</span>, mais{" "}
            <span className="text-success">aprendizado</span>
          </h2>
          <p className="lead">Encontre os melhores cursos em poucos cliques.</p>
          <Button variant="success" onClick={() => navigate("/buscarcurso")}>
            Ver Cursos &rarr;
          </Button>
        </Container>

        <Container className="py-5">
        <h3 className="text-center mb-4">Cursos em Destaque</h3>
        <Row className="g-4">
          {ultimosCursos.map((curso) => (
            <Col key={curso.id} md={4}>
              <Card className="h-100 shadow">
                <Card.Body>
                  <Card.Title>{curso.titulo}</Card.Title>
                  <Card.Text>
                    Clique em "Saiba mais" para ver a descrição completa.
                  </Card.Text>
                  <Button variant="primary" onClick={() => abrirModal(curso)}>
                    Saiba mais
                  </Button>
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

      <footer className="bg-dark text-white py-4 mb-0" style={{ marginTop: "150px" }}>
        <Container className="text-center">
          <hr className="my-3" />
          <p className="mb-0">
            &copy; 2025 CursoFinder - Todos os direitos reservados
          </p>
        </Container>
      </footer>
    </div>
  );
}


