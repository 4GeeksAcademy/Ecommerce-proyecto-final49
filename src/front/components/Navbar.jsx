import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import milPaginasLogo from "../assets/img/mil_paginas.png"
import "../styles/navbar.css"

export const Navbar = ({ onSearch, searchValue }) => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  // const [searchValue, setSearchValue] = useState("");

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const totalItems = store.localCart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  function onSubmitSearch(event) {
    event.preventDefault();
    const searchBar = event.target.elements.search.value.trim();
    console.log("Busqueda del navbar:", searchBar);
    if (searchBar) {
      navigate(`/?search=${encodeURIComponent(searchBar)}`);
    }
  }

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
          <img src={milPaginasLogo} alt="Mil páginas logo" height="50" />
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 order-lg-1">
            <li>
                <Link className="ms-4 navbar-link" to="/categorias">Categorías</Link>              
            </li>

          </ul>
          <form className="d-flex me-auto" onSubmit={onSubmitSearch}>
            <input
              name="search"
              type="search"
              className="form-control"
              placeholder="Buscar libros autores y categorias"
              value={searchValue}
              onChange={(event) => {
                onSearch(event.target.value);
                if (event.target.value.trim() === "") {
                  navigate(`/`);
                }
              }}
            />

            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </form>
</div>

          {/* {onSearch && (
        <form
          className="banner__search d-flex" 
          onSubmit={(event) => {
            event.preventDefault();
            const searcher = event.target.elements.search.value.trim();
            console.log("navbar, resultado:", searcher)
            if (searcher.length > 0) {
              onSearch(searcher);
            }
          }}
        >
          <input
            name="search"
            type="search"
            placeholder="que estas buscando"
            className="form-control"
            value={searchValue}
            onChange={(event) => onSearch(event.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </form>
           )} */}
          {/* {onSearch && (
        <form
          className="banner__search d-flex"
          onSubmit={(event) => {
            event.preventDefault();
            const searcher = event.target.elements.search.value.trim();
            if (searcher.length > 0) {
              onSearch(searcher);
            }
          }}
        >
          <input
            name="search"
            type="text"
            placeholder="que estas buscando"
            className="form-control"
            value={searchValue}
            onChange={(event) => onSearch(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </form> */}
          )
          {/* <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar libros, autores, géneros..."
                aria-label="Search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                
              />
              </div> */}
          {/* <form
            className="d-flex mx-0 mx-lg-5 mb-3 my-lg-0 order-lg-2 flex-grow-1"
            role="search"
          >
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar libros, autores o categorías..."
                aria-label="Search"
              />
              <button className="btn btn-primary" type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form> */}
        

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
