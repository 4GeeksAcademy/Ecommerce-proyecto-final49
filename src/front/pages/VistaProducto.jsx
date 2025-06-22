export const VistaProducto = () => {

    // const calificacion = 3; // Este valor debe ser dinámico
    // const estrellas = "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
    return (
        <div className="container">
            <div className="row">
                <div className="col-2 d-flex flex-column gap-2">
                    <img src="https://picsum.photos/id/101/60" className="img-thumbnail" alt="miniatura 1" />
                    <img src="https://picsum.photos/id/102/60" className="img-thumbnail" alt="miniatura 2" />
                    <img src="https://picsum.photos/id/103/60" className="img-thumbnail" alt="miniatura 3" />
                    <img src="https://picsum.photos/id/104/60" className="img-thumbnail" alt="miniatura 4" />
                </div>
                <div className="col-6 col-md-4 py-4">
                    <img src="https://picsum.photos/id/2/300" alt="Imagen del producto" className="img-fluid" />
                </div>
                <div className="col-6 col-md-4 py-4">
                    <p><strong>Laptop VSAP VNJH1402 14.1'' Intel Celeron N4020 8gb Ram 256gb Ssd Windows 11 Pro Color Plateado</strong></p>
                    {/* <p>{estrellas} ({calificacion}/5)</p> */}
                    <h3>$373<sup className="fs-6">45</sup></h3>
                    <span>IVA incluido</span>
                </div>
                <div className="col-6 col-md-4 py-4">

                </div>
            </div>

        </div>
    )
}
