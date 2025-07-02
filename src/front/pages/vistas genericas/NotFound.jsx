import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="container py-4">
      <div class="text-center">
        <h1 class="display-1 fw-bold">404</h1>
        <p class="fs-3">
          Oops! 
          Página no encontrada.
        </p>
        <p class="lead">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/" class="btn btn-success">
          Ir a la Página Principal
        </Link>
      </div>
    </div>
  );
};
