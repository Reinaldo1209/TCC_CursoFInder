import React, { useState } from "react";
import { Container, Navbar, Nav, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaMoon, FaSun, FaPhone, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SearchCoursesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();

  const mainTheme = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const variant = darkMode ? "dark" : "light";
  const bgClass = darkMode ? "bg-secondary" : "bg-primary";
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const courses = [
    { id: 1, title: "Ciência da Computação", description: "Curso completo sobre algoritmos, estruturas de dados, sistemas operacionais, redes e muito mais." },
    { id: 2, title: "Desenvolvimento Web", description: "Aprenda HTML, CSS, JavaScript, React e backend com Node.js para criar aplicações modernas." },
    { id: 3, title: "Análise de Dados", description: "Curso focado em Python, estatística, visualização de dados e uso de ferramentas como Pandas e Power BI." },
    { id: 4, title: "Curso de React", description: "Aprenda a construir aplicações com React." },
    { id: 5, title: "Curso de Node.js", description: "Desenvolva aplicações backend com Node.js." },
    { id: 6, title: "Curso de Python", description: "Aprenda Python para análise de dados." },
    { id: 7, title: "Curso de JavaScript", description: "Domine JavaScript para o desenvolvimento web." }
  ];

  const handleSearch = () => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
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
              <Button variant="light" size="sm" onClick={() => navigate("/login") }>
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

      <div style={{ paddingTop: '75px', paddingBottom: '150px' }}>
        <Container className="py-5">
          <h2 className="text-center mb-4">Busque o curso dos seus sonhos!</h2>

          <Form.Group controlId="search" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Digite o nome do curso"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: '60px', fontSize: '1.25rem' }}
            />
            <div className="text-center mt-3">
              <Button variant="primary" size="lg" onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </Form.Group>

          <Row className="g-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <Col key={course.id} md={4}>
                  <Card className="h-100 shadow">
                    <Card.Body>
                      <Card.Title>{course.title}</Card.Title>
                      <Card.Text>{course.description}</Card.Text>
                      <Button variant="secondary" disabled>
                        Saiba mais
                      </Button>
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

      <footer className="bg-dark text-white py-4 mb-0" style={{ marginTop: "150px" }}>
        <Container className="text-center">
          <hr className="my-3" />
          <p className="mb-0">&copy; 2025 CursoFinder - Todos os direitos reservados</p>
        </Container>
      </footer>
    </div>
  );
}