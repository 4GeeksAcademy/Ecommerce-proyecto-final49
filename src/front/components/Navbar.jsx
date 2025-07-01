import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const totalItems = store.localCart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <Link className="navbar-brand mx-auto order-lg-first" to="/">
          <img
            src="src/front/assets/img/mil_paginas.png"
            alt="Mil páginas logo"
            height="50"
          />
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 order-lg-1">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownCategories"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categorías
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownCategories"
              >
                <li>
                  <Link className="dropdown-item" to="/category/fiction">
                    Ficción
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/non-fiction">
                    No Ficción
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/scifi">
                    Ciencia Ficción
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/all">
                    Ver Todas
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/new-arrivals">
                Novedades
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/deals">
                Ofertas
              </Link>
            </li>
          </ul>

          <form
            className="d-flex mx-0 mx-lg-5 mb-3 my-lg-0 order-lg-2 flex-grow-1"
            role="search"
          >
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar libros, autores, géneros..."
                aria-label="Search"
              />
              <button className="btn btn-primary" type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="btn-group ms-auto">
          <button
            type="button"
            className="btn border-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-user"></i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            {!store.token ? (
              <>
                <li>
                  <Link className="dropdown-item" to="/iniciar-sesion">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/registro">
                    Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="dropdown-item" to="/perfil">
                    Mi perfil
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/favoritos">
                    Favoritos
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/historial-de-compras">
                    Mi historial de compras
                  </Link>
                </li>
              </>
            )}
            {store.token && (
              <>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="btn-group me-3">
          <button
            type="button"
            className="btn border-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
              {totalItems}{" "}
              <span className="visually-hidden">items in cart</span>
            </span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <h6 className="dropdown-header">Carrito de Compras</h6>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            {totalItems === 0 ? (
              <li>
                <span className="dropdown-item text-muted">
                  Aún no hay artículos en el carrito.
                </span>
              </li>
            ) : (
              <li>
                <span className="dropdown-item text-muted">
                  Tienes {totalItems} artículo(s) en el carrito.
                </span>
              </li>
            )}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item text-center" to="/cart">
                Ver Carrito Completo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
