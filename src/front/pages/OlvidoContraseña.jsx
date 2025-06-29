import { useState } from "react";
import { Link } from "react-router-dom";

export const OlvidoContraseña = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!email) {
            alert("Por favor ingrese un correo válido");
            return;
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/forgot-password`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(email ),
            });

            if (response.ok) {
                setSent(true);
            } else {
                const data = await response.json();
                setError(data.msg || "Ocurrió un error.");
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="container-fluid">
            <div className="row py-5 justify-content-center">
                {!sent ? (
                    <>
                        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                            <h1 className="text-center">Solicitar un correo para recuperar contraseña</h1>
                        </div>
                        <div className="col-12 col-md-6">
                            <form onSubmit={handleSubmit} className="border m-2 p-3">
                                <div className="form-group mb-3">
                                    <label htmlFor="btnEmail">Correo electrónico:</label>
                                    <input
                                        type="email" 
                                        placeholder="ingrese su correo electronico"
                                        className="form-control"
                                        id="btnEmail"
                                        name="email"
                                        onChange={(event) => setEmail(event.target.value)}
                                        value={email}
                                    />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <button type="submit" className="btn btn-success w-100">
                                    Enviar link de recuperación
                                </button>
                            </form>
                            <h5 className="text-center my-4">
                                ¿No tienes cuenta? <Link to="/registro">Crea una</Link>
                            </h5>
                        </div>
                    </>
                ) : (
                    <div className="col-12 col-md-6 text-center">
                        <h1>¡Correo Enviado!</h1>
                        <p>Si tu correo está en nuestro sistema, recibirás un enlace para recuperar tu contraseña.</p>
                        <Link to="/iniciar-sesion" className="btn btn-success">
                            Volver al Inicio de sesion
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};