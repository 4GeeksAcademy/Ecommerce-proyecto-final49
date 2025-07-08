import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="container py-4">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          Oops! 
          Página no encontrada.
        </p>
        <p className="lead">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/" class="btn btn-success">
          Ir a la Página Principal
        </Link>
      </div>
    </div>
  );
};
