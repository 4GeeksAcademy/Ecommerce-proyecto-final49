import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styles/vistaproducto.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const VistaProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imgSelected, setImgSelected] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { store, actions } = useGlobalReducer();
  const navigate = useNavigate();

  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.image_url) setImgSelected(data.image_url);
      })
      .catch((err) => console.error(err));
  }, [id, backendUrl]);

  if (!product) return <div>Cargando producto...</div>;

  const ratingValue = product.rating || 0;
  const stars = "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);
  const totalReviews = 20;
  
  // Línea 32, se adicionó el parámetro e
  const handleAddToCart = async (e) => {
    // Línea 35, validación de la fuente de la llamada
    console.trace("handleAddToCart trace")
    if (addingToCart) return;
    setAddingToCart(true);

    console.log("handleAddToCart called");

    const success = await actions.addToCart(product);
    if (success) {
      console.log("Producto agregado al carrito");
    } else {
      console.log("Error al agregar producto al carrito");
    }

    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!product) {
      alert("Producto no disponible para comprar.");
      return;
    }

    if (!store.token) {
      alert("Para comprar ahora, por favor inicia sesión o regístrate.");
      navigate("/iniciar-sesion");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              product_name: product.name,
              product_id: product.id,
              price: product.price,
              quantity: 1, // Se asume 1 para "Comprar ahora"
              image_url: product.image_url,
            },
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al crear la sesión de pago.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("No se pudo obtener la URL de pago.");
      }
    } catch (error) {
      console.error("Error al procesar la compra directa:", error);
      alert(`Ocurrió un error al procesar tu compra: ${error.message}`);
    }
  };

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
          <button
            type="button"
            className="btn btn-success w-100"
            onClick={() => handleBuyNow()}
            //disabled={product.stock <= 0}
          >
            Comprar ahora
          </button>

          {/*Botón agregar al carrito*/}
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => handleAddToCart()}
            //disabled={product.stock <= 0}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};
