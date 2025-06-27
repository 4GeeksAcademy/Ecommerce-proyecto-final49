import { useState } from "react";
import { Link } from "react-router-dom";

export const RecuperarContraseña = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      alert("Por favor ingrese un correo valido");
      return;
    }
    const url = import.meta.env.VITE_BACKEND_URL;

    const response = await fetch(`${url}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    if (response.ok) {
      alert("Se envio un email de restauración de la contraseña");
    }
  };

  return (
    <div className="container-fluid ">
      <div className="row py-5">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <h1 className="text-center">Recuperar contraseña</h1>
        </div>
        <div className="col-12 col-md-6">
          <form onSubmit={handleSubmit} className="border m-2 p-3">
            <div className="form-group mb-3">
              <label htmlFor="btnEmail">Correo electronico: </label>
              <input
                type="text"
                placeholder="ingrese su correo electronico"
                className="form-control"
                id="btnEmail"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Enviar link de recuperación
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
