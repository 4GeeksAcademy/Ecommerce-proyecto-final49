import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styles/vistaproducto.css";

export const VistaProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imgSelected, setImgSelected] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // fetch al backend para obtener producto por id
    fetch(`${backendUrl}/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.image_url) setImgSelected(data.image_url);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div>Cargando producto...</div>;

  const ratingValue = product.rating || 0;
  const stars = "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);
  const totalReviews = 20; // Este valor puede ser dinámico

  return (
    <div className="container">
      <div className="row">
        {/*Bloque fotos del producto*/}
        <div className="col-6 col-md-2 col-lg-2 d-flex flex-column gap-2 py-4 align-items-end">
          {/*Foto principal en miniatura*/}
          {product.image_url && (
            <img
              src={product.image_url}
              className="img-thumbnail foto_miniatura"
              alt="Main picture"
              onClick={() => setImgSelected(product.image_url)}
            />
          )}

          {/*Demás fotos miniatura*/}
          {product.detail_images &&
            product.detail_images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Detail ${index + 1}`}
                className="img-thumbnail foto_miniatura"
                onClick={() => setImgSelected(url)}
              />
            ))}
        </div>

        {/*Foto principal grande*/}
        <div className="col-6 col-md-10 col-lg-4 py-4">
          <div className="py-4 border rounded-2 div_producto">
            <img
              src={imgSelected}
              alt="Selected product"
              className="img-fluid img_producto"
            />
          </div>
        </div>

        {/*Bloque descripción del producto y precio*/}
        <div className="col-12 col-md-6 col-lg-3 py-4 description_font_size d-flex flex-column">
          <Link to="/" className="text-decoration-none small_font_size">
            Ver más productos
          </Link>
          <p className="py-3 mb-0">
            <strong>{product.description}</strong>
          </p>
          <p className="mb-0 py-1">
            {ratingValue} {stars} ({totalReviews})
          </p>
          {(() => {
            const [intPart, decimalPart] = product.price.toFixed(2).split(".");
            return (
              <p className="mb-0 pt-1">
                ${intPart}
                <sup className="fs-7">{decimalPart}</sup>
              </p>
            );
          })()}
          <span className="small_font_size">IVA incluido</span>
        </div>

        {/*Bloque de compra*/}
        <div className="col-12 col-md-6 col-lg-3 my-4 border rounded-2 d-flex flex-column gap-2">
          <span className="mt-3">Llega gratis mañana</span>
          <span>Devolución gratis</span>
          <span className="small_font_size">
            Tienes 30 días para devolverlo
          </span>
          <span>Stock disponible</span>
          <span className="mb-5">Cantidad: 1 unidad (+5 disponibles)</span>

          {/*Botón comprar ahora*/}
          <Link to={`/checkout/${product.id}`}>   {/*CAMBIAR EL NOMBRE DE LA RUTA CUANDO MARIA LA CREE */}
            <button type="button" className="btn btn-primary w-100">
              Comprar ahora
            </button>
          </Link>

          {/*Botón agregar al carrito*/}
          <Link to={`/cart/${product.id}`}>   {/*CAMBIAR EL NOMBRE DE LA RUTA CUANDO MARIA LA CREE */}
            <button type="button" className="btn btn-primary w-100">
              Agregar al carrito
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
