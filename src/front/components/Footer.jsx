import { Link } from "react-router-dom";

export const Footer = () => (
  <div className="container-fluid">
    <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-4 border-top bg-dark text-white px-5">
      <div className="col mb-4">
        <Link
          to="/"
          className="d-flex align-items-center mb-4 link-light text-decoration-none"
          aria-label="Inicio"
        >
          {/* Aquí puedes insertar tu logo SVG o un ícono */}
          <svg className="bi me-2" width="40" height="32" aria-hidden="true">
            <use xlinkHref="#bootstrap"></use>
          </svg>
        </Link>
        <p className="text-light">© 2025 Nombre de la tienda</p>
      </div>

      <div className="col mb-4"></div>

      <div className="col mb-4">
        <h5>Categorías</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/categorias" className="nav-link p-0 text-light">
              Explorar categorías
            </Link>
          </li>
        </ul>
      </div>

      <div className="col mb-4">
        <h5>Acerca de nosotros</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/quienes-somos" className="nav-link p-0 text-light">
              Quiénes somos
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/contactanos" className="nav-link p-0 text-light">
              Contáctanos
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/preguntas-frecuentes"
              className="nav-link p-0 text-light"
            >
              Preguntas frecuentes
            </Link>
          </li>
        </ul>
      </div>

      <div className="col mb-4">
        <h5>Nuestras políticas</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link
              to="/politica-de-privacidad"
              className="nav-link p-0 text-light"
            >
              Política de privacidad
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/politica-de-cancelacion"
              className="nav-link p-0 text-light"
            >
              Política de cancelación
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              to="/terminos-y-condiciones"
              className="nav-link p-0 text-light"
            >
              Términos y condiciones
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  </div>
);
