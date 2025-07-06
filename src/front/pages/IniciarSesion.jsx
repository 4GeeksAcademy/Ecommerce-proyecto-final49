import { useState } from "react";
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
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // const handleChange = ({ target }) => {
  //   setUser({
  //     ...user,
  //     [target.name]: target.value,
  //   });
  // };

  const handleChange = (event) => {
    setCredential({
      ...credential,
      [event.target.name]: event.target.value,
    });
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setMessage(null);
  //   setLoading(true);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login`,

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credential),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        dispatch({
          type: "UPDATE_TOKEN",
          payload: data.token,
        });
        navigate("/");
        console.log("ok");
        console.log(data);
      } else {
        console.log("no ok");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   try {
  //     const success = await actions.login(user.email, user.password);
  //     if (success) {
  //       console.log(success);
  //       // dispatch({
  //       //   type: UPDATE_TOKEN,
  //       // });
  //       setMessage("¡Inicio de sesión exitoso! Redirigiendo...");
  //       navigate("/");
  //     } else {
  //       setMessage("Correo o contraseña incorrectos.");
  //     }
  //   } catch (error) {
  //     console.error("Error durante el inicio de sesión:", error);
  //     setMessage("Hubo un error. Intenta nuevamente.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (store.token) {
  //   console.log(store.token);
  //   return <Navigate to="/" />;
  // }

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <form
            onSubmit={handleSubmit}
            className="border p-4 shadow rounded bg-white"
          >
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            <div className="form-group mb-3">
              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                placeholder="Tu correo"
                className="form-control"
                id="email"
                name="email"
                onChange={handleChange}
                // value={user.email}
                value={credential.email}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                placeholder="Tu contraseña"
                className="form-control"
                id="password"
                name="password"
                onChange={handleChange}
                // value={user.password}
                value={credential.password}
                required
                disabled={loading}
              />
              <div className="mt-2">
                <Link to="/olvido-su-contraseña">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
            <div className="text-center mt-3">
              <small>
                ¿No tienes cuenta? <Link to="/registro">Crea una</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
