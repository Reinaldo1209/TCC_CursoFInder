import React, { useEffect, useState } from "react";
import {
  Container, Navbar, Nav, Row, Col, Card, Button
} from "react-bootstrap";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function SavedCoursesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded?.userName || decoded?.unique_name || "Usuário");

      fetch("https://localhost:7238/api/CursosSalvos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Erro ao buscar cursos salvos");
          return res.json();
        })
        .then(data => {
          setSavedCourses(data);
        })
        .catch(err => {
          console.error(err);
          alert("Erro ao carregar cursos salvos.");
        });

    } catch (error) {
      console.error("Token inválido");
      navigate("/login");
    }
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const mainTheme = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const variant = darkMode ? "dark" : "light";
  const bgClass = darkMode ? "bg-secondary" : "bg-primary";

  const toggleDetalhes = (cursoId) => {
    setExpandedCourseId(expandedCourseId === cursoId ? null : cursoId);
  };

  return (
    <div className={mainTheme} style={{ minHeight: "100vh" }}>
      <Navbar expand="lg" variant={variant} className={`${bgClass} py-3`} fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
            Curso<span className="text-warning">Finder</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              <Nav.Link as={Link} to="/" className="text-white">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/meuscursos" className="text-white">
                Meus Cursos Salvos
              </Nav.Link>

              {userName && (
                <span className="text-white fw-semibold">{userName}</span>
              )}

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

      <div style={{ paddingTop: "80px", paddingBottom: "150px" }}>
        <Container className="py-5">
          <h2 className="text-center mb-4">Meus Cursos Salvos</h2>

          {savedCourses.length === 0 ? (
            <p className="text-center">Você ainda não salvou nenhum curso.</p>
          ) : (
            <Row className="g-4">
              {savedCourses.map(course => (
                <Col key={course.id} md={4}>
                  <Card className="h-100 shadow">
                    <Card.Body>
                      <Card.Title>{course.titulo}</Card.Title>
                      <Card.Text>{course.descricao}</Card.Text>

                      {expandedCourseId === course.id && (
                        <>
                          <hr />
                          <p><strong>Instituição:</strong> {course.instituicao || "N/A"}</p>
                          <p><strong>Carga Horária:</strong> {course.cargaHoraria || "N/A"}</p>
                          <p><strong>Valor:</strong> {course.valor || "N/A"}</p>
                        </>
                      )}

                      <div className="d-flex justify-content-end">
                        <Button
                          variant="info"
                          onClick={() => toggleDetalhes(course.id)}
                        >
                          {expandedCourseId === course.id ? "Ocultar Detalhes" : "Ver Detalhes"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      <footer className="bg-dark text-white py-4 mb-0">
        <Container className="text-center">
          <hr className="my-3" />
          <p className="mb-0">&copy; 2025 CursoFinder - Todos os direitos reservados</p>
        </Container>
      </footer>
    </div>
  );
}


