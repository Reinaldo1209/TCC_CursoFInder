import { useState } from "react";
import {Container,Navbar,Nav,Row,Col,Card,Button,Modal,} from "react-bootstrap";
import { FaMoon, FaSun, FaPhone, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const mainTheme = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const navTheme = darkMode ? "dark" : "light";
  const navBg = darkMode ? "bg-secondary" : "bg-primary";

  const cursos = [
    {
      id: 1,
      titulo: "Ciência da Computação",
      descricao:
        "Curso completo sobre algoritmos, estruturas de dados, sistemas operacionais, redes e muito mais.",
    },
    {
      id: 2,
      titulo: "Desenvolvimento Web",
      descricao:
        "Aprenda HTML, CSS, JavaScript, React e backend com Node.js para criar aplicações modernas.",
    },
    {
      id: 3,
      titulo: "Análise de Dados",
      descricao:
        "Curso focado em Python, estatística, visualização de dados e uso de ferramentas como Pandas e Power BI.",
    },
  ];

  const abrirModal = (curso) => {
    setCursoSelecionado(curso);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setCursoSelecionado(null);
  };

  return (
    <div className={mainTheme} style={{ minHeight: "100vh" }}>
      <Navbar
        expand="lg"
        variant={navTheme}
        className={`${navBg} py-3`}
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="#" className="fw-bold text-white">
            Curso<span className="text-warning">Finder</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              <Nav.Link href="#" className="text-white">
                Home
              </Nav.Link>
              <FaPhone className="text-white" title="Fale Conosco" />
              <Button variant="light" size="sm" onClick={() => navigate("/login")}>
                <FaUser className="me-2" />
                Login
              </Button>
              <Button
                variant={darkMode ? "light" : "dark"}
                size="sm"
                onClick={toggleDarkMode}
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
            {cursos.map((curso) => (
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
        <Modal.Body>{cursoSelecionado?.descricao}</Modal.Body>
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

