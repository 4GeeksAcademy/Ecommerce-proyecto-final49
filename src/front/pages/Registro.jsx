import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialStateUser = {
    name: "",
    email: "",
    password: "",
};

export const Registro = () => {
    const [user, setUser] = useState(initialStateUser);
    const [registered, setRegistered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (registered) {
            const timer = setTimeout(() => {
                navigate("/iniciar-sesion");
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [registered, navigate]);

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

    const url = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(`${url}/register`, {
                method: "POST",
                body: formData,
                })

            if (response.status === 201) {
                setUser(initialStateUser);
                setRegistered(true); 
            } else {
                alert("El usuario ya existe o faltan datos.");
            }
        } catch (error) {
            alert("Error de red o del servidor");
            console.error(error);
        }
    };

    // Cambio para mejora 04JUL25
    //     const payload = {
    //         name: user.name,
    //         email: user.email,
    //         password: user.password,
    //     };

    //     const url = import.meta.env.VITE_BACKEND_URL;
    //         try { 
    //         const response = await fetch(`${url}/register`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (response.status === 201) {
    //             setUser(initialStateUser);
    //             setRegistered(true); 
    //         } else {
    //             const errorData = await response.json();
    //             alert(`Error al registrar usuario: ${errorData.message || 'El usuario ya existe o faltan datos.'}`);
    //         }
    //     } catch (error) {
    //         alert("Error de red o del servidor. Por favor, inténtalo de nuevo.");
    //         console.error("Error al enviar la solicitud de registro:", error);
    //     }
    // };
    // Fin cambio para mejora 04JUL25

    return (
        <div className="container-fluid d-flex justify-content-center">
            <div className="row py-3 w-100">

                {registered && (
                    <div className="col-12">
                        <div className="alert alert-success text-center">
                            ¡Usuario creado exitosamente! Serás redirigido al login...
                        </div>
                    </div>
                )}

                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <h1 className="text-center">Completa los datos para crear tu cuenta</h1>
                </div>
                <div className="col-12 col-md-6">
                    <form className="border m-2 p-3" onSubmit={handleSubmit}>
                        {/* Tus inputs del formulario aquí... */}
                        <div className="form-group mb-3">
                            <label htmlFor="btnName">Nombre Completo:</label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
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
                        <div className="form-group mb-3">
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
                    </form>
                </div>
                <div className="col-12">
                    <h5 className="text-center my-4">
                        ¿Ya tienes una cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link>
                    </h5>
                </div>
            </div>
        </div>
    );
};