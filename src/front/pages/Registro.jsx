import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialStateUser = {
  name: "",
  email: "",
  password: "",
};

export const Registro = () => {
  const [user, setUser] = useState(initialStateUser);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);

    if (user.avatar) {
      formData.append("avatar", user.avatar);
    }

    const url = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${url}/api/register`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        setUser(initialStateUser);
        setTimeout(() => {
          navigate("/iniciar-sesion");
        }, 2000);
      } else if (response.status === 400) {
        alert("El usuario ya existe");
      } else {
        alert(
          "Error al registrar usuario, intente nuevamente y si el problema persiste contactese con soporte"
        );
      }
    } catch (error) {
      alert("Error de red o del servidor");
      console.error(error);
    }
  };

  return (
    <div className="container-fluid d-flex">
      <div className="row py-3">
        <div
          className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <h1 className="text-center">
            Completa los datos para crear tu cuenta
          </h1>
        </div>

        <div className="col-12 col-md-6">
          <form className="border m-2 p-3" onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="btnName">Nombre Completo: </label>
              <input
                type="text"
                placeholder="Ingrese su nombre completo"
                className="form-control border-dark"
                id="btnName"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="btnEmail">Correo electrónico: </label>
              <input
                type="email"
                placeholder="Ingrese su correo electrónico"
                className="form-control border-dark"
                id="btnEmail"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="btnPass">Contraseña: </label>
              <input
                type="password"
                placeholder="Ingrese una contraseña"
                className="form-control border-dark"
                id="btnPass"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              Registrar
            </button>
          </form>
        </div>

        <h5 className="text-center my-4">
          ¿Ya tiene una cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link>
        </h5>
      </div>
    </div>
  );
};
