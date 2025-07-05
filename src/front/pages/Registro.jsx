import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialStateUser = {
  username: "",
  email: "",
  password: "",
};

export const Registro = () => {
  const [user, setUser] = useState(initialStateUser);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (registered) {
  //     const timer = setTimeout(() => {
  //       navigate("/iniciar-sesion");
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [registered, navigate]);

  const handleChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // const formData = new FormData();
      // formData.append("email", user.email);
      // formData.append("name", user.name);
      // formData.append("password", user.password);

      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(initialStateUser);
        setRegistered(true);
      } else {
        alert(data.msg || "El usuario ya existe o faltan datos.");
      }
    } catch (error) {
      alert("Error de red o del servidor");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 mt-5">
          {registered && (
            <div className="alert alert-success text-center">
              ¡Usuario creado exitosamente! Serás redirigido al login...
            </div>
          )}
          <form
            className="border p-4 shadow rounded bg-white"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-4">Registro</h2>
            <div className="form-group mb-3">
              <label htmlFor="btnName">Nombre de usuario:</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="btnEmail">Correo electrónico:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="btnPass">Contraseña:</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button className="btn btn-success w-100" type="submit">
              Registrar
            </button>
            <div className="text-center mt-3">
              <small>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/iniciar-sesion">Inicia sesión</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
