import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

export const RecuperarContraseña = () => {
  const [newPass, setNewPass] = useState("");
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = import.meta.env.VITE_BACKEND_URL;

    const response = await fetch(`${url}/api/reset-password`, {
    method: "PUT",
    headers: {
        "Authorization": `Bearer ${searchParams.get("token")}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ "password": newPass }),
});

    if (response.ok) {
      navigate("/iniciar-sesion");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row py-5 justify-content-center">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <h1 className="text-center">Recuperar contraseña</h1>
        </div>
        <div className="col-12 col-md-6">
          <form className="border m-2 p-3" onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="btnPassword">Nueva contraseña: </label>
              <input
                type="password"
                placeholder="contraseña"
                className="form-control"
                id="btnPassword"
                name="password"
                onChange={(event) => setNewPass(event.target.value)}
                value={newPass}
              />
            </div>
            <button className="btn btn-success w-100">
              Actualizar contraseña
            </button>
          </form>
        </div>
        <div className="w-100"></div>
      </div>
    </div>
  );
};
