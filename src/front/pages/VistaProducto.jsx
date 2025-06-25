import { Link } from "react-router-dom";
import React, { useState } from "react";
import '../styles/vistaproducto.css';

export const VistaProducto = () => {

    const calificacion = 4; // Este valor debe ser dinámico
    const estrellas = "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
    const total_resenas = 20;

    const [imgSeleccionada, setImgSeleccionada] = useState("../public/mochila_imagen_1.png");

    return (
        <div className="container">
            <div className="row">

                {/*Bloque fotos del producto*/}
                <div className="col-2 col-md-2 col-lg-2 d-flex flex-column gap-2 py-4 align-items-end">
                    <img 
                    src="../public/mochila_imagen_1.png" 
                    className="img-thumbnail foto_miniatura" 
                    alt="miniatura 1" 
                    onClick={() => setImgSeleccionada("../public/mochila_imagen_1.png")}/>
                    <img 
                    src="../public/mochila_imagen_2.png" 
                    className="img-thumbnail foto_miniatura" 
                    alt="miniatura 2" 
                    onClick={() => setImgSeleccionada("../public/mochila_imagen_2.png")}/>
                    <img 
                    src="../public/mochila_imagen_3.png" 
                    className="img-thumbnail foto_miniatura" 
                    alt="miniatura 3" 
                    onClick={() => setImgSeleccionada("../public/mochila_imagen_3.png")}/>
                    <img 
                    src="../public/mochila_imagen_4.png" 
                    className="img-thumbnail foto_miniatura" 
                    alt="miniatura 4" 
                    onClick={() => setImgSeleccionada("../public/mochila_imagen_4.png")}/>
                </div>
                <div className="col-4 col-md-4 col-lg-4 py-4">
                    <div className="py-4 border rounded-2 div_producto">
                        <img src={imgSeleccionada} alt="Imagen del producto" className="img-fluid img_producto" />
                    </div>
                </div>

                {/*Bloque descripción del producto y precio*/}
                <div className="col-3 col-md-3 py-4 description_font_size d-flex flex-column">
                    <Link to="/" className="text-decoration-none small_font_size">Ver más productos </Link>
                    <p className="py-3 mb-0"><strong>Mochila De Viaje Laptop 15.6 Pulgadas Aprobado Por Avión 10kg Antirrobo Impermeable 
                        Taygeer Más Bolsa Organizadora 1001 Color Negro</strong></p>
                    <p className="mb-0 py-1">{calificacion} {estrellas} ({total_resenas})</p>
                    <p className="mb-0 pt-1">$373<sup className="fs-7">45</sup></p>
                    <span className="small_font_size">IVA incluido</span>
                </div>

                {/*Bloque comprar o carrito de compras*/}
                <div className="col-3 col-md-3 col-lg-3 my-4 border rounded-2 d-flex flex-column gap-2">
                    <span className="mt-3">Llega gratis mañana</span>
                    <span>Devolución gratis</span>
                    <span className="small_font_size">Tienes 30 días para devolverlo</span>
                    <span>Stock disponible</span>
                    <span className="mb-5">Cantidad: 1 unidad (+5 disponibles)</span>
                    <button type="button" class="btn btn-primary">Comprar ahora</button>
                    <button type="button" class="btn btn-primary">Agregar al carrito</button>
                </div>
            </div>

        </div>
    )
}
