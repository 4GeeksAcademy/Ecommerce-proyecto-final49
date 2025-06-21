export const VistaProducto = () => {

    // const calificacion = 3; // Este valor debe ser dinámico
    // const estrellas = "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
    return (
        <div className="container">
            <div className="row">
                <div className="col-6 col-md-4 py-4">
                    <img src="https://picsum.photos/id/2/300" alt="Imagen del producto" className="img-fluid" />
                </div>
                <div className="col-6 col-md-4 py-4">
                    <p><strong>Laptop VSAP VNJH1402 14.1'' Intel Celeron N4020 8gb Ram 256gb Ssd Windows 11 Pro Color Plateado</strong></p>
                    {/* <p>{estrellas} ({calificacion}/5)</p> */}
                </div>
                <div className="col-6 col-md-4 py-4">

                </div>
            </div>

        </div>
    )
}
