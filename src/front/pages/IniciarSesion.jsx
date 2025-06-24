export const IniciarSesion = () => {
  return (
    <form className="container-fluid">
  <div className="row">
    <div className="col-12 col-md-6 text-center my-2">
      <h1>Ingresa tu correo electrónico y contraseña para iniciar sesión</h1>
    </div>
    <div className="col-12 col-md-6 text-center my-2">
      <div className="form-group">
        <label htmlFor="email" className="d-block">Correo electrónico</label>
        <input
          type="email"
          id="email"
          className="form-control border border-dark my-2"
          placeholder="Ingresa tu correo electrónico"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="d-block my-2">Contraseña</label>
        <input
          type="password"
          id="password"
          className="form-control border-dark my-2"
          placeholder="Ingresa tu contraseña"
          required
        />
      </div>
      <button type="submit" className="my-4 btn btn-success">
        Iniciar sesión
      </button>
    </div>
  </div>
</form>


  )
}
