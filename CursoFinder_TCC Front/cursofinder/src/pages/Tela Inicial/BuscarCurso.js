import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Form
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../TelasHeadFoot/Header";
import Footer from "../TelasHeadFoot/Footer";
import { FaStar } from "react-icons/fa";
import './TelaInicial.css';

export default function SearchCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState({});
  const [novaNota, setNovaNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [novoComentario, setNovoComentario] = useState("");
  const [avaliandoCursoId, setAvaliandoCursoId] = useState(null);
  const navigate = useNavigate();

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
      .then(msg => alert(msg))
      .catch(err => {
        console.error(err);
        alert("Não foi possível salvar o curso.");
      });
  };

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

  const buscarAvaliacoes = (cursoId) => {
    fetch(`https://localhost:7238/api/avaliacoes/${cursoId}`)
      .then(res => res.json())
      .then(data => {
        setAvaliacoes(prev => ({
          ...prev,
          [cursoId]: data
        }));
      })
      .catch(err => console.error("Erro ao buscar avaliações:", err));
  };

  const enviarAvaliacao = (cursoId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Faça login para avaliar.");
      return;
    }

    fetch("https://localhost:7238/api/Avaliacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nota: novaNota,
        comentario: novoComentario,
        cursoId: cursoId
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao enviar avaliação");
        alert("Avaliação enviada!");
        buscarAvaliacoes(cursoId);
        setAvaliandoCursoId(null);
        setNovaNota(0);
        setNovoComentario("");
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao enviar avaliação.");
      });
  };

  const calcularMediaEstrelas = (cursoId) => {
    const lista = avaliacoes[cursoId];
    if (!lista || lista.length === 0) return 0;
    const soma = lista.reduce((acc, cur) => acc + cur.nota, 0);
    return soma / lista.length;
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <div className="mainTheme" style={{ paddingTop: "125px", paddingBottom: "150px" }}>
        <Container className="py-5">
          <h2 className="text-center mb-4">Busque o curso dos seus sonhos!</h2>
          <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className="d-flex mb-4 gap-2 align-items-center">
              <Form.Group controlId="search" className="flex-grow-1 m-0">
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do curso"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: '50px', fontSize: '1.25rem' }}
                />
              </Form.Group>
              <Button variant="primary" size="lg" onClick={handleSearch}>
                Buscar
              </Button>
              <Button variant="outline-success" size="lg" onClick={() => navigate('/meuscursos')}>
                Meus Cursos Salvos
              </Button>
            </div>
          </Form>

          <Row className="g-4">
            {cursosParaExibir.length > 0 ? (
              cursosParaExibir.map(course => {
                const listaAvaliacoes = avaliacoes[course.id] || [];
                const media = calcularMediaEstrelas(course.id);
                return (
                  <Col key={course.id} md={4}>
                    <Card className="h-100 shadow detalhe">
                      <Card.Body>
                        <Card.Title>{course.titulo}</Card.Title>
                        <Card.Text>{course.instituicao}</Card.Text>

                        {listaAvaliacoes.length > 0 && (
                          <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                color={i < Math.round(media) ? "#ffc107" : "#e4e5e9"}
                              />
                            ))}
                            <small className="ms-2">({listaAvaliacoes.length} avaliações)</small>
                          </div>
                        )}

                        {expandedCourseId === course.id && (
                          <>
                            <hr />
                            <p><strong>Descrição:</strong> {course.descricao || "N/A"}</p>
                            <p><strong>Carga Horária:</strong> {course.cargaHoraria || "N/A"}</p>
                            <p><strong>Valor:</strong> {course.valor || "N/A"}</p>
                          </>
                        )}

                        <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
                          <Button variant="success" onClick={() => salvarCurso(course.id)}>Favoritar</Button>
                          <Button variant="info" onClick={() => toggleDetalhes(course.id)}>
                            {expandedCourseId === course.id ? "Ocultar Detalhes" : "Ver Detalhes"}
                          </Button>
                          <Button variant="warning" onClick={() => {
                            setAvaliandoCursoId(course.id);
                            buscarAvaliacoes(course.id);
                          }}>
                            Avaliar
                          </Button>
                        </div>

                        {avaliandoCursoId === course.id && (
                          <>
                            <hr />
                            <Form.Group className="mb-2">
                              <Form.Label>Nota</Form.Label>
                              <div style={{ fontSize: 24 }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    style={{ cursor: 'pointer', marginRight: 4 }}
                                    color={(hoverNota || novaNota) >= star ? '#ffc107' : '#e4e5e9'}
                                    onClick={() => setNovaNota(star)}
                                    onMouseOver={() => setHoverNota(star)}
                                    onMouseOut={() => setHoverNota(0)}
                                  />
                                ))}
                                <span className="ms-2">
                                  {novaNota > 0 ? `${novaNota} estrela${novaNota > 1 ? 's' : ''}` : ''}
                                </span>
                              </div>
                            </Form.Group>
                            <Form.Group className="mb-2">
                              <Form.Label>Comentário</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={novoComentario}
                                onChange={(e) => setNovoComentario(e.target.value)}
                              />
                            </Form.Group>
                            <Button variant="primary" onClick={() => enviarAvaliacao(course.id)}>
                              Enviar Avaliação
                            </Button>
                            <hr />
                            <h6 className="mt-3">Avaliações</h6>
                            {listaAvaliacoes.length > 0 ? (
                              listaAvaliacoes.map((a, i) => (
                                <div key={i}>
                                  <strong>{a.usuario || "Usuário"}:</strong>
                                  <div style={{ fontSize: 18 }}>
                                    {[...Array(5)].map((_, idx) => (
                                      <FaStar
                                        key={idx}
                                        color={idx < a.nota ? "#ffc107" : "#e4e5e9"}
                                        style={{ marginRight: 2 }}
                                      />
                                    ))}
                                  </div>
                                  {a.comentario && <p><em>{a.comentario}</em></p>}
                                  <hr />
                                </div>
                              ))
                            ) : (
                              <p>Sem avaliações ainda.</p>
                            )}
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col className="text-center">
                <p>Nenhum curso encontrado. Tente outro nome.</p>
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}



