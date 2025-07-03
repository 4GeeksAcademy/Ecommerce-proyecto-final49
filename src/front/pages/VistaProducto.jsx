import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styles/vistaproducto.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const VistaProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imgSelected, setImgSelected] = useState("");
  // Se adiciona la línea 11 para evaluar el stock
  const [quantity, setQuantity] = useState(1);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { store, actions } = useGlobalReducer();
  const navigate = useNavigate();

  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.image_url) setImgSelected(data.image_url);
        // Se adicionan las lineas 24 y 25 para evaluar el stock
        if (data.product_stock < quantity) {
          setQuantity(data.product_stock > 0 ? 1 : 0);
        }
      })
      .catch((err) => console.error(err));
  }, [id, backendUrl, quantity]);

  if (!product) return <div>Cargando producto...</div>;

  const ratingValue = product.rating || 0;
  const stars = "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);
  const totalReviews = 20;

  const availability = product.product_stock;
  let availableText = "";
  if (availability === 0) {
    availableText = "No disponible";
  } else if (availability === 1) {
    availableText = "1 unidad disponible";
  } else {
    availableText = `${availability} unidades disponibles`;
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.product_stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async (e) => {
    if (quantity === 0 || quantity > product.product_stock) {
      alert("No hay suficiente stock para la cantidad seleccionada.");
      return;
    }

    if (addingToCart) return;
    setAddingToCart(true);

    console.log(`Agregando ${quantity} de ${product.name} al carrito`);

    const success = await actions.addToCart(product, quantity);
    if (success) {
      console.log("Producto(s) agregado(s) al carrito");
    } else {
      console.log("Error al agregar producto(s) al carrito");
    }

    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (quantity === 0 || quantity > product.product_stock) {
      alert("No hay suficiente stock para la cantidad seleccionada.");
      return;
    }

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
              quantity: quantity,
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

        <div className="col-2 col-md-2 col-lg-1 d-flex flex-column gap-2 py-4 align-items-end">
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
          <div className="col-10 col-md-6 col-lg-5 py-4">
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
              <span className="fs-5">{ratingValue}</span>
              <span className="fs-4 ms-2">{stars}</span>
              <span className="fs-6 ms-2">({totalReviews})</span>
            </p>
            {(() => {
              const [intPart, decimalPart] = product.price
                .toFixed(2)
                .split(".");
              return (
                <p className="mb-0 pt-2 fs-1">
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

            {/*Muestra el stock disponible*/}
            <span className="fw-bold">Stock: {availableText}</span>

            {/*Selector de cantidad*/}
            <div className="d-flex align-items-center justify-content-center my-3 ">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="mx-3 fs-5">{quantity}</span>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  quantity >= product.product_stock ||
                  product.product_stock === 0
                }
              >
                +
              </button>
            </div>

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
    </div>
  );
};
