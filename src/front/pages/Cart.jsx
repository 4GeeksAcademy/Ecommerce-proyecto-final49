import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

export const Cart = () => {
  const { store, actions } = useGlobalReducer();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const displayedCartItems = store.token ? store.backendCart : store.localCart;

  useEffect(() => {
    if (store.token) {
      actions.getBackendCart();
    }
  }, [store.token]);

  const handleRemoveItem = async (itemId) => {
    const success = await actions.removeCartItem(itemId);
    if (success) {
      console.log("Producto eliminado del carrito.");
    } else {
      console.error("Error al eliminar el producto del carrito.");
    }
  };

  const handleClearCart = async () => {
    const success = await actions.clearCart();
    if (success) {
      console.log("Carrito vaciado.");
    } else {
      console.error("Error al vaciar el carrito.");
    }
  };

  const getTotal = () => {
    return displayedCartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    if (displayedCartItems.length === 0) {
      alert("Tu carrito está vacío. Añade productos antes de pagar.");
      return;
    }

    if (!store.token) {
      alert("Para proceder al pago, por favor inicia sesión o regístrate.");
      navigate("/iniciar-sesion");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: displayedCartItems.map((item) => ({
            product_name: item.product_name,
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url,
          })),
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
      console.error("Error al crear sesión de Stripe:", error);
      alert(`Ocurrió un error al procesar el pago: ${error.message}`);
    }
  };

  return (
    <div className="cart-container mt-4">
      <h2 className="cart-title">🛒 Tu Carrito</h2>

      {displayedCartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Tu carrito está vacío. ¡Explora nuestros productos!</p>
          <Link to="/" className="btn btn-primary">
            Ir de compras
          </Link>
        </div>
      ) : (
        <>
          {displayedCartItems.map((item, index) => (
            <div
              key={item.product_id || item.id || index}
              className="cart-item-card d-flex align-items-center mb-3 p-3 border rounded"
            >
              <img
                src={
                  item.image_url ||
                  "https://placehold.co/80x80/cccccc/ffffff?text=No+Img"
                }
                alt={item.product_name}
                className="cart-item-image me-3"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="cart-item-details flex-grow-1">
                <h5 className="cart-item-name">{item.product_name}</h5>
                <p className="cart-item-price">
                  Precio unitario: ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
                </p>
                <p className="cart-item-quantity">Cantidad: {item.quantity}</p>
                <p className="cart-item-subtotal fw-bold">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveItem(item.id || item.product_id)}
              >
                Eliminar
              </button>
            </div>
          ))}

          <hr />
          <div className="cart-summary mt-4 p-3 border rounded bg-light">
            <h4>
              Total: <span className="text-primary">${getTotal()}</span>
            </h4>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-warning" onClick={handleClearCart}>
                Vaciar carrito
              </button>
              <button className="btn btn-success" onClick={handleCheckout}>
                PAGAR
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
