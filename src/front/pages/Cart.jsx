import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

export const Cart = () => {
  const { store, actions } = useGlobalReducer();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // const displayedCartItems = store.token ? store.localCart : store.backendCart;
  const displayedCartItems = store.token ? store.localCart : store.localCart;

  console.log(store);

  useEffect(() => {
    if (store.token) {
      actions.getBackendCart();
    }
  }, [store.token]);

  const handleRemoveItem = async (itemId) => {
    const success = await actions.removeCartItem(itemId);
    if (!success) console.error("Error al eliminar producto del carrito.");
  };

  const handleClearCart = async () => {
    const success = await actions.clearCart();
    if (!success) console.error("Error al vaciar el carrito.");
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
      alert("Para pagar necesitas iniciar sesión.");
      navigate("/iniciar-sesion");
      return;
    }

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${backendUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Muy importante para rutas protegidas
        },
        body: JSON.stringify({
          items: displayedCartItems.map((item) => ({
            product_name: item.product_name || item.name,
            product_id: item.product_id || item.id,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url || "",
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar el checkout.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("No se pudo obtener la URL de Stripe.");
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      alert(`Error durante el pago: ${error.message}`);
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
                alt={item.product_name || item.name}
                className="cart-item-image me-3"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="cart-item-details flex-grow-1">
                <h5 className="cart-item-name">
                  {item.product_name || item.name}
                </h5>
                <p className="cart-item-price">
                  Precio unitario: ${item.price.toFixed(2)}
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
          <Link to="/" className="btn btn-primary text-white ms-3">
            Comprar más
          </Link>
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
