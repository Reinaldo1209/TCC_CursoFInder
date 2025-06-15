import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Form, Modal
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../TelasHeadFoot/Header";
import Footer from "../TelasHeadFoot/Footer";
import { FaStar, FaFilter, FaLink, FaRegStar, FaChevronDown } from "react-icons/fa";
import './TelaInicial.css';
import { useAuth } from "../../context/AuthProvider";

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
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [localizacaoFiltro, setLocalizacaoFiltro] = useState("");
  const [avaliacaoFiltro, setAvaliacaoFiltro] = useState(0);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [cursoParaAvaliar, setCursoParaAvaliar] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAvaliacoesId, setShowAvaliacoesId] = useState(null);
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetch("https://localhost:7238/api/Curso")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Erro ao buscar cursos:", err));
  }, []);

  // Buscar avaliações de todos os cursos ao carregar cursos
  useEffect(() => {
    if (courses.length > 0) {
      courses.forEach(course => {
        fetch(`https://localhost:7238/api/avaliacoes/${course.id}`)
          .then(res => res.json())
          .then(data => {
            setAvaliacoes(prev => ({
              ...prev,
              [course.id]: data
            }));
          })
          .catch(err => console.error("Erro ao buscar avaliações:", err));
      });
    }
  }, [courses]);

  // Salvar curso: enviar apenas o cursoId (número) no body
  const salvarCurso = (cursoId) => {
    setBackendError("");
    const token = localStorage.getItem("token");
    if (!token) {
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
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          setBackendError(text || "Erro ao salvar curso");
          throw new Error(text || "Erro ao salvar curso");
        }
        return res.text();
      })
      .then(msg => alert(msg))
      .catch(err => {
        if (!err.message.includes('Erro ao salvar curso')) {
          setBackendError("Não foi possível salvar o curso.");
        }
      });
  };

  // Atualiza cursos filtrados em tempo real ao mudar filtros ou busca
  useEffect(() => {
    const filtered = courses.filter(course => {
      const nomeMatch = course.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
      const tipoMatch = tipoFiltro ? (course.tipo?.toLowerCase() === tipoFiltro.toLowerCase()) : true;
      const localizacaoMatch = localizacaoFiltro ? ((course.localização || course.localizacao)?.toLowerCase() === localizacaoFiltro.toLowerCase()) : true;
      const avaliacaoMatch = avaliacaoFiltro > 0 ? calcularMediaEstrelas(course.id) >= avaliacaoFiltro : true;
      return nomeMatch && tipoMatch && localizacaoMatch && avaliacaoMatch;
    });
    setFilteredCourses(filtered);
  }, [searchTerm, tipoFiltro, localizacaoFiltro, avaliacaoFiltro, courses]);

  // Ordena cursos do mais recente para o mais antigo
  useEffect(() => {
    const sortedCourses = [...courses].sort((a, b) => {
      // Tenta usar dataCriacao, senão usa id (se incremental)
      if (b.dataCriacao && a.dataCriacao) {
        return new Date(b.dataCriacao) - new Date(a.dataCriacao);
      }
      return (b.id || 0) - (a.id || 0);
    });
    const filtered = sortedCourses.filter(course => {
      const nomeMatch = course.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
      const tipoMatch = tipoFiltro ? (course.tipo?.toLowerCase() === tipoFiltro.toLowerCase()) : true;
      const localizacaoMatch = localizacaoFiltro ? ((course.localização || course.localizacao)?.toLowerCase() === localizacaoFiltro.toLowerCase()) : true;
      const avaliacaoMatch = avaliacaoFiltro > 0 ? calcularMediaEstrelas(course.id) >= avaliacaoFiltro : true;
      return nomeMatch && tipoMatch && localizacaoMatch && avaliacaoMatch;
    });
    setFilteredCourses(filtered);
  }, [searchTerm, tipoFiltro, localizacaoFiltro, avaliacaoFiltro, courses]);

  const cursosParaExibir = searchTerm || tipoFiltro || localizacaoFiltro || avaliacaoFiltro > 0
    ? filteredCourses
    : [...courses].sort((a, b) => {
        if (b.dataCriacao && a.dataCriacao) {
          return new Date(b.dataCriacao) - new Date(a.dataCriacao);
        }
        return (b.id || 0) - (a.id || 0);
      });

  const toggleDetalhes = (cursoId) => {
    setExpandedCourseId(expandedCourseId === cursoId ? null : cursoId);
  };

  // Avaliar curso: enviar objeto completo conforme backend espera
  const enviarAvaliacao = (cursoId) => {
    setBackendError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    let userId = null;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userId = decoded["nameid"] || decoded["sub"] || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { }
    if (!userId) {
      setBackendError("Usuário inválido.");
      return;
    }
    const avaliacao = {
      cursoId,
      userId,
      nota: novaNota,
      comentario: novoComentario,
      dataAvaliacao: new Date().toISOString()
    };
    fetch("https://localhost:7238/api/Avaliacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(avaliacao)
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          setBackendError(text || "Erro ao enviar avaliação");
          throw new Error(text || "Erro ao enviar avaliação");
        }
        alert("Avaliação enviada!");
        // Atualiza avaliações após envio
        fetch(`https://localhost:7238/api/avaliacoes/${cursoId}`)
          .then(res => res.json())
          .then(data => {
            setAvaliacoes(prev => ({
              ...prev,
              [cursoId]: data
            }));
          });
        setNovaNota(0);
        setNovoComentario("");
      })
      .catch(err => {
        if (!err.message.includes('Erro ao enviar avaliação')) {
          setBackendError("Erro ao enviar avaliação.");
        }
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
          {backendError && (
            <div style={{ color: 'red', marginBottom: 10, textAlign: 'center', fontWeight: 'bold' }}>
              {backendError}
            </div>
          )}
          {/* Botão Meus Cursos Salvos mais à direita, menos destacado e com ícone */}
          <div className="d-flex justify-content-end mb-3">
            <Button variant="outline-primary" size="md" style={{ minWidth: 180, fontWeight: 500, fontSize: '1rem' }} onClick={() => navigate('/meuscursos')}>
              <FaStar style={{ marginRight: 8, marginBottom: 2 }} />
              Meus Cursos Salvos
            </Button>
          </div>
          <h2 className="text-center mb-4">Busque o curso dos seus sonhos!</h2>
          <Form onSubmit={e => e.preventDefault()}>
            <div className="d-flex mb-4 gap-2 align-items-center flex-wrap">
              <Form.Group controlId="search" className="flex-grow-1 m-0">
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do curso"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: '50px', fontSize: '1.25rem' }}
                />
              </Form.Group>
              <Button
                variant="primary"
                size="lg"
                style={{ height: '50px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 60 }}
                onClick={() => setShowFilters(f => !f)}
                title="Filtros"
              >
                <FaFilter />
              </Button>
            </div>
            {showFilters && (
              <div className="d-flex mb-4 gap-2 align-items-center flex-wrap animate__animated animate__fadeInDown">
                <Form.Group controlId="tipoFiltro" className="m-0">
                  <Form.Select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
                    <option value="">Tipo</option>
                    {[...new Set(courses.map(c => c.tipo).filter(Boolean))].map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="localizacaoFiltro" className="m-0">
                  <Form.Select value={localizacaoFiltro} onChange={e => setLocalizacaoFiltro(e.target.value)}>
                    <option value="">Localização</option>
                    {[...new Set(courses.map(c => c.localização || c.localizacao).filter(Boolean))].map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="avaliacaoFiltro" className="m-0">
                  <Form.Select value={avaliacaoFiltro} onChange={e => setAvaliacaoFiltro(Number(e.target.value))}>
                    <option value={0}>Avaliação</option>
                    {[1, 2, 3, 4, 5].map(nota => (
                      <option key={nota} value={nota}>{nota} estrelas ou mais</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            )}
          </Form>

          <Row className="g-4">
            {cursosParaExibir.length > 0 ? (
              cursosParaExibir.map(course => {
                return (
                  <Col key={course.id} md={4}>
                    <Card className="h-100 shadow detalhe">
                      <Card.Body>
                        {/* Favoritar: ícone de estrela ao lado do título */}
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
                                <FaLink />
                              </a>
                            )}
                            {/* Favoritar: sempre aparece, mas se não autenticado, redireciona para login */}
                            <span
                              style={{ cursor: 'pointer', fontSize: 22 }}
                              title="Favoritar"
                              onClick={() => {
                                if (!isAuthenticated) {
                                  navigate('/login');
                                } else {
                                  salvarCurso(course.id);
                                }
                              }}
                              onMouseEnter={e => e.currentTarget.firstChild.style.color = '#ffc107'}
                              onMouseLeave={e => e.currentTarget.firstChild.style.color = ''}
                            >
                              <FaRegStar />
                            </span>
                          </span>
                        </Card.Title>
                        <Card.Text>{course.instituicao}</Card.Text>

                        {/* Exibir nota média sempre */}
                        {(() => {
                          const listaAvaliacoes = avaliacoes[course.id] || [];
                          const media = calcularMediaEstrelas(course.id);
                          return (
                            <div className="mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  color={i < Math.round(media) ? "#ffc107" : "#e4e5e9"}
                                />
                              ))}
                              <small className="ms-2">{media > 0 ? media.toFixed(1) : "0.0"} ({listaAvaliacoes.length} avaliações)</small>
                            </div>
                          );
                        })()}

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
                          >
                            <i
                              className="fa-solid fa-chevron-down "
                              style={{
                                transform: expandedCourseId === course.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                              }}
                            ></i>
                          </span>
                          {/* Avaliações: sempre aparece, mas se não autenticado, redireciona para login */}
                          <Button variant="warning" onClick={() => {
                            if (!isAuthenticated) {
                              navigate('/login');
                            } else {
                              if (showAvaliacoesId === course.id) {
                                setShowAvaliacoesId(null);
                              } else {
                                setShowAvaliacoesId(course.id);
                                if (!avaliacoes[course.id]) {
                                  fetch(`https://localhost:7238/api/avaliacoes/${course.id}`)
                                    .then(res => res.json())
                                    .then(data => {
                                      setAvaliacoes(prev => ({ ...prev, [course.id]: data }));
                                    });
                                }
                              }
                            }
                          }}>
                            Avaliações
                          </Button>
                        </div>

                        {showAvaliacoesId === course.id && (
                          <div className="mt-3">
                            <h6 className="mt-3">Avaliações</h6>
                            {(avaliacoes[course.id] && avaliacoes[course.id].length > 0) ? (
                              avaliacoes[course.id].map((a, i) => (
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
                            {/* Botão avaliar: sempre aparece, mas se não autenticado, redireciona para login */}
                            <Button variant="primary" className="mt-2" onClick={() => {
                              if (!isAuthenticated) {
                                navigate('/login');
                              } else {
                                setCursoParaAvaliar(course.id);
                                setShowAvaliacaoModal(true);
                              }
                            }}>
                              Avaliar este curso
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col>
                <p className="text-center">Nenhum curso encontrado com os critérios atuais.</p>
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <Footer />

      {/* Modal para avaliação */}
      <Modal show={showAvaliacaoModal} onHide={() => setShowAvaliacaoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Avaliar Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="novaNota">
              <Form.Label>Nota</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    color={star <= (hoverNota || novaNota) ? "#ffc107" : "#e4e5e9"}
                    size={30}
                    onMouseEnter={() => setHoverNota(star)}
                    onMouseLeave={() => setHoverNota(0)}
                    onClick={() => setNovaNota(star)}
                    style={{ cursor: "pointer", marginRight: 5 }}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group controlId="novoComentario">
              <Form.Label>Comentário</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAvaliacaoModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={() => {
            enviarAvaliacao(cursoParaAvaliar);
            setShowAvaliacaoModal(false);
          }}>
            Enviar Avaliação
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}



