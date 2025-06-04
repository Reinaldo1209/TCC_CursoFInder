import './footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="page-inner-content footer-content">
        <div className="logo-footer">
          <h2 className="titulo-footer">Curso<span>Finder</span></h2>
          <p>Seu site de busca!</p>
        </div>
        <div className="links-footer">
          <ul>
            <li className="youtube"><i className="fa-brands fa-youtube"></i> Youtube</li>
            <li className="facebook"><i className="fa-brands fa-facebook"></i> Facebook</li>
            <li className="Instagram"><i className="fa-brands fa-instagram"></i> Instagram</li>
          </ul>
        </div>
      </div>
      <hr className="page-inner-content" />
      <div className="page-inner-content copyright">
        <p>Copyright 2025 - CursoFinder - Todos Direitos Reservados</p>
      </div>
    </footer>
  );
}