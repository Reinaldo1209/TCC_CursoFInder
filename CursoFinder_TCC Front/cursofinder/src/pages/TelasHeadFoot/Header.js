import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './header.css';
import { useAuth } from "../../context/AuthProvider";

export default function Header() {
  const [cursos, setCursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSearchBox = () => {
    setSearchActive(prev => {
      const nextState = !prev;
      if (prev) {
        setSearchTerm(""); // Limpa o input ao fechar a busca
      } else {
        setTimeout(() => {
          document.getElementById('inputBusca')?.focus();
        }, 100); // Foco no input ao abrir
      }
      return nextState;
    });
  };

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch("https://localhost:7238/api/Curso");
        if (response.ok) {
          const data = await response.json();
          setCursos(data);
        } else {
          console.error("Erro ao buscar cursos:", response.status);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchCursos();
  }, []);

  useEffect(() => {
    setFilteredCursos(
      cursos.filter(curso =>
        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, cursos]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "enabled";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchBoxEl = document.querySelector('.searchBox');
      const isClickInside = searchBoxEl?.contains(event.target);
      const isIcon = event.target.closest('.searchBtn, .closeBtn');

      if (!isClickInside && !isIcon) {
        setSearchActive(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="dark">
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          checked={darkMode}
          onChange={handleDarkModeToggle}
        />
        <label htmlFor="checkbox" className="checkbox-label">
          <i className="fas fa-moon"></i>
          <i className="fas fa-sun"></i>
          <span className="ball"></span>
        </label>
        <div className="fale-conosco">
          <i className="fa-solid fa-phone"></i>
          <p className="fale">Fale Conosco</p>
        </div>
      </div>
      <header>
        <button onClick={() => navigate("/")} className="button-header">
          <div className="logo">
            Curso<span className="titulo">Finder</span>
          </div>
        </button>
        <div className="group">
          <ul className="navigation">
            <li className="user-icon">
              {isAuthenticated ? (
                <button
                  className="button-header"
                  style={{ cursor: "pointer" }}
                  onClick={() => logout()}
                  title="Sair"
                >
                  <span>
                    <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginRight: "5px" }}></i>
                    Sair
                  </span>
                </button>
              ) : (
                <button className="button-header"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  <span>
                    <i className="fa fa-user" style={{ marginRight: "5px" }}></i>
                    Login
                  </span>
                </button>
              )}
            </li>
            <li>
              <div className="search">
                <span className="icon">
                  <ion-icon
                    name="search-outline"
                    className={`searchBtn ${searchActive ? 'active' : ''}`}
                    onClick={toggleSearchBox}
                  />
                  <ion-icon
                    name="close-outline"
                    className={`closeBtn ${searchActive ? 'active' : ''}`}
                    onClick={toggleSearchBox}
                  />
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div className={`searchBox ${searchActive ? 'active' : ''}`}>
          <input
            id="inputBusca"
            value={searchTerm}
            onChange={handleSearchChange}
            type="text"
            placeholder="O que você procura?"
          />
          <ul id="listaProdutos">
            {filteredCursos.length > 0 ? (
              filteredCursos.map((curso) => (
                <li key={curso.id}>
                  <a href="#">
                    <div style={{ padding: "10px" }}>
                      <strong>{curso.titulo}</strong><br />
                      <small>{curso.descricao}</small>
                    </div>
                  </a>
                </li>
              ))
            ) : (
              <li><a>Nenhum curso encontrado.</a></li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
}