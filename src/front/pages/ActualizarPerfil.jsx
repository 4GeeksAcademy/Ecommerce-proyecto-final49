import { useState } from "react";

export const ActualizarPerfil = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Aquí deberías hacer una petición al backend para actualizar
    alert("Datos actualizados correctamente");
  };

  return (
    <div className="container-fluid">
      <div className="row py-5">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <h1 className="text-center">Editar datos</h1>
        </div>
        <div className="col-12 col-md-6">
          <form onSubmit={handleSubmit} className="border m-2 p-3">
            <div className="form-group mb-3">
              <label htmlFor="editEmail">Correo electrónico:</label>
              <input
                type="email"
                placeholder="Ingrese su nuevo correo"
                className="form-control"
                id="editEmail"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="editPassword">Nueva contraseña:</label>
              <input
                type="password"
                placeholder="Ingrese su nueva contraseña"
                className="form-control"
                id="editPassword"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

