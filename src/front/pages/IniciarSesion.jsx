import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate, Navigate } from "react-router-dom";

const initialStateUser = {
  email: "",
  password: "",
};

export const IniciarSesion = () => {
  const [user, setUser] = useState(initialStateUser);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { store, actions } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Estado actual del store:", store);
  }, [store]);

  const handleChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const success = await actions.login(user.email, user.password);
      if (success) {
        setMessage("¡Inicio de sesión exitoso! Redirigiendo...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage("Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      setMessage("Hubo un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (store.token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-fluid">
      <div className="row py-3">
        <div className="col-12 col-md-6 d-flex align-items-center">
          <h1 className="text-center">
            Ingresa tu correo electrónico y contraseña para iniciar sesión
          </h1>
        </div>
        <div className="col-12 col-md-6">
          <form onSubmit={handleSubmit} className="border m-2 p-3">
            <div className="form-group mb-3">
              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="form-control border border-dark my-2"
                id="email"
                name="email"
                onChange={handleChange}
                value={user.email}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                className="form-control border-dark"
                id="password"
                name="password"
                onChange={handleChange}
                value={user.password}
                required
                disabled={loading}
              />
              <Link to="/olvido-su-contraseña">¿Olvidaste tu contraseña?</Link>
            </div>
            {message && (
              <div
                className={`alert ${
                  message.includes("exitoso") ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
        <h5 className="text-center my-4">
          ¿No tienes cuenta? <Link to="/registro">Crea una</Link>
        </h5>
      </div>
    </div>
  );
};
