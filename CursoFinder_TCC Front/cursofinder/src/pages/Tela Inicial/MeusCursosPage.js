import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../TelasHeadFoot/Header";
import Footer from "../TelasHeadFoot/Footer";
import './TelaInicial.css';

export default function SavedCoursesPage() {
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
      jwtDecode(token); // Apenas validação

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
  }, [navigate]);

  const toggleDetalhes = (cursoId) => {
    setExpandedCourseId(expandedCourseId === cursoId ? null : cursoId);
  };

  return (
    <div className="bg-light text-dark" style={{ minHeight: "100vh" }}>
      <Header />
      <div className="mainTheme" style={{ paddingTop: "125px", paddingBottom: "150px" }}>
        <Container className="py-5">
          <h2 className="text-center mb-4">Meus Cursos Salvos</h2>

          {savedCourses.length === 0 ? (
            <p className="text-center">Você ainda não salvou nenhum curso.</p>
          ) : (
            <Row className="g-4">
              {savedCourses.map(course => (
                <Col key={course.id} md={4}>
                  <Card className="h-100 shadow detalhe">
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
      <Footer />
    </div>
  );
}




