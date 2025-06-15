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
                      <Card.Title className="d-flex align-items-center justify-content-between">
                        <span>{course.titulo}</span>
                        <span className="d-flex align-items-center gap-2">
                          {/* Link do curso */}
                          {course.link && (
                            <a
                              href={course.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Acessar Site do Curso"
                              style={{ color: '#0d6efd', fontSize: 22, marginRight: 8 }}
                            >
                              <i className="fa-solid fa-link"></i>
                            </a>
                          )}
                        </span>
                      </Card.Title>
                      <Card.Text>{course.instituicao}</Card.Text>

                      {/* Exibir nota média se disponível */}
                      {course.avaliacoes && course.avaliacoes.length > 0 && (
                        <div className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                          {[...Array(5)].map((_, i) => {
                            const media = course.avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0) / course.avaliacoes.length;
                            const fill = Math.min(Math.max(media - i, 0), 1);
                            return (
                              <span key={i} style={{ position: 'relative', display: 'inline-block', width: 22, height: 22 }}>
                                <i className="fa fa-star" style={{ color: '#e4e5e9', position: 'absolute', left: 0, top: 0 }}></i>
                                <i className="fa fa-star" style={{ color: '#ffc107', position: 'absolute', left: 0, top: 0, width: `${fill * 100}%`, overflow: 'hidden', clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}></i>
                              </span>
                            );
                          })}
                          <small className="ms-2">{(course.avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0) / course.avaliacoes.length).toFixed(1)} ({course.avaliacoes.length} avaliações)</small>
                        </div>
                      )}

                      {expandedCourseId === course.id && (
                        <>
                          <hr />
                          <p><strong>Descrição:</strong> {course.descricao || "N/A"}</p>
                          <p><strong>Tipo:</strong> {course.tipo || "N/A"}</p>
                          <p><strong>Localização:</strong> {course.localização || course.localizacao || "N/A"}</p>
                          <p><strong>Carga Horária:</strong> {course.cargaHoraria || "N/A"}</p>
                          <p><strong>Valor:</strong> {course.valor || "N/A"}</p>
                        </>
                      )}

                      <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
                        {/* Botão ver mais: seta para baixo, sem botão em volta */}
                        <span
                          title={expandedCourseId === course.id ? "Ocultar Detalhes" : "Ver Detalhes"}
                          onClick={() => toggleDetalhes(course.id)}
                          style={{ cursor: 'pointer', color: '#0d6efd', fontSize: 22 }}
                        >
                          <i
                            className="fa-solid fa-chevron-down"
                            style={{
                              transform: expandedCourseId === course.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                            }}
                          ></i>
                        </span>
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




