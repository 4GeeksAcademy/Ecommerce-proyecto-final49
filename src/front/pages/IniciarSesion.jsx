import { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

import { Link, useNavigate, Navigate } from "react-router-dom"

const initialStateUser = {
  email: "",
  password: ""
}

export const IniciarSesion = () => {

  const [user, setUser] = useState(initialStateUser)

  const { dispatch, store } = useGlobalReducer()
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const url = import.meta.env.VITE_BACKEND_URL

    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(user)
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem("token", data.token);
      dispatch({ type: "LOGIN", payload: data.token });
      setTimeout(() => {
        navigate("/");
      }, 2000)
    } else if (response.status === 400) {
      alert("El correo electrónico o la contraseña son incorrectos.")
    } else {
      alert("Error al iniciar sesión. Por favor, comunícate con soporte.")
    }
  }

  if (store.token) {
    return <Navigate to="/" />
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-6 text-center my-5 justify-content-center p-5 h-100">
          <h1>Ingresa tu correo electrónico y contraseña para iniciar sesión</h1>
        </div>
        <form onSubmit={handleSubmit} className="col-12 col-md-6 text-center">
          <div className="text-center m-5">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
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
            <div className="form-group">
              <label htmlFor="password" className="my-2">Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                className="form-control border-dark my-2"
                id="password"
                name="password"
                onChange={handleChange}
                value={user.password}
                required
              />
            </div>
            <button type="submit" className="my-4 btn btn-success">
              Iniciar sesión
            </button>
          </div>
        </form>
        <h5 className="text-center mb-5">
          ¿No tienes cuenta? <Link to="/registro">Crea una</Link>
        </h5>
      </div>
    </div>


  )
}
