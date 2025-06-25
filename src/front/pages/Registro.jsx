import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const initialStateUser = {
    lastname: "",
    email: "",
    password: "",
}

export const Registro = () => {
    const [user, setUser] = useState(initialStateUser)

    const navigate = useNavigate()
    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        })
    }
    const handleSubmit = async (event) => {
        event, preventDefault()

        const formData = new formData()
        formData.append("lastname", user.lastmane)
        formData.append("email", user.email)
        formData.append("password", user.password)

        const url = import.meta.env.VITE_BACKEND_URL

        const response = await fetch(`${url}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: formData
        })
        if (response.status === 201) {
            setUser(initialStateUser)
            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } else if (respose.status === 400) {
            alert("El usuario ya existe")
        } else {
            alert("Error al registrar usuario, intente nuevamente y si el problema persiste contactese con soporte")
        }
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-6 text-center my-5 justify-content-center p-5 h-100">
                    <h1>Completa los datos para crear tu cuenta</h1>
                </div>
                <div className="col-12 col-md-6" >
                    <form
                        className="border m-2 p-3"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group mb-3">
                            <label htmlFor="btnName">Nombre Completo: </label>
                            <input
                                type="text"
                                placeholder="Ingrese su nombre completo"
                                className="form-control border-dark"
                                id="btnName"
                                name="lastname"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="btnEmail">Correo electronico: </label>
                            <input
                                type="text"
                                placeholder="Ingrese su correo electronico"
                                className="form-control border-dark"
                                id="btnEmail"
                                name="email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="btnAvatar">Imagen de perfil: </label>
                            <input
                                type="file"
                                className="form-control border-dark"
                                id="btnAvatar"
                                name="avatar"
                                onChange={(event) => {
                                    setUser({
                                        ...user,
                                        avatar: event.target.files[0]
                                    })
                                }}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="btnPass">Contraseña: </label>
                            <input
                                type="password"
                                placeholder="ingrese una contraseña"
                                className="form-control border-dark"
                                id="btnPass"
                                name="password"
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="btn btn-success w-100"
                        >Registrar</button>
                    </form>
                </div>

                <h5 className="text-center my-4">
                    ¿Ya tiene una cuenta? <Link to="/iniciar-sesion"> Inicia sesion</Link>
                </h5>
            </div>
        </div>
    )
}