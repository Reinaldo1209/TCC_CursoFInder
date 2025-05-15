import React, { useState, useEffect } from "react";
import {
  Container, Navbar, Nav, Row, Col, Card, Button, Form
} from "react-bootstrap";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

export default function SearchCoursesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [userName, setUserName] = useState(null);
  const [courses, setCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded?.userName || decoded?.unique_name || "Usuário");
      } catch (error) {
        console.error("Token inválido");
        setUserName(null);
      }
    }
  }, []);

  useEffect(() => {
    fetch("https://localhost:7238/api/Curso")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Erro ao buscar cursos:", err));
  }, []);

  const salvarCurso = (cursoId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para salvar um curso.");
      navigate("/login");
      return;
    }

    fetch("https://localhost:7238/api/CursosSalvos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cursoId)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar curso");
        return res.text();
      })
      .then(msg => {
        alert(msg);
      })
      .catch(err => {
        console.error(err);
        alert("Não foi possível salvar o curso.");
      });
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const mainTheme = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const variant = darkMode ? "dark" : "light";
  const bgClass = darkMode ? "bg-secondary" : "bg-primary";

  const handleSearch = () => {
    const filtered = courses.filter(course =>
      course.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const cursosParaExibir = searchTerm ? filteredCourses : courses;

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

              {userName ? (
                <span className="text-white fw-semibold">{userName}</span>
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
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ paddingTop: "75px", paddingBottom: "150px" }}>
        <Container className="py-5">
          <h2 className="text-center mb-4">Busque o curso dos seus sonhos!</h2>

          <Form.Group controlId="search" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Digite o nome do curso"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: '60px', fontSize: '1.25rem' }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            />
            <div className="text-center mt-3">
              <Button variant="primary" size="lg" onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </Form.Group>

          <Row className="g-4">
            {cursosParaExibir.length > 0 ? (
              cursosParaExibir.map(course => (
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

                      <div className="d-flex justify-content-between mt-3">
                        <Button
                          variant="success"
                          onClick={() => salvarCurso(course.id)}
                        >
                          Salvar Curso
                        </Button>
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
              ))
            ) : (
              <Col className="text-center">
                <p>Nenhum curso encontrado. Tente outro nome.</p>
              </Col>
            )}
          </Row>
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



