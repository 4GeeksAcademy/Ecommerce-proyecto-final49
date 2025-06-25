import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

import { Link, useNavigate, Navigate } from "react-router-dom";

const initialStateUser = {
  email: "",
  password: "",
};

export const IniciarSesion = () => {
  const [user, setUser] = useState(initialStateUser);

  const { dispatch, store } = useGlobalReducer();
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = import.meta.env.VITE_BACKEND_URL;

    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      dispatch({ type: "LOGIN", payload: data.token });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else if (response.status === 400) {
      alert("El correo electrónico o la contraseña son incorrectos.");
    } else {
      alert("Error al iniciar sesión. Por favor, comunícate con soporte.");
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
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="">
                Contraseña:
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                className="form-control border-dark"
                id="password"
                name="password"
                onChange={handleChange}
                value={user.password}
                required
              />
              <Link to="/recuperar-contraseña"></Link>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Iniciar sesión
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
