// src/front_cart/CartView.jsx
import React, { useContext } from "react";
import CartContext from "./CartContext";
import CartItem from "./CartItem";
import { calculateTotal } from "./utils_cart";

const CartView = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const total = calculateTotal(cart);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 Carrito de Compras</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info">Tu carrito está vacío.</div>
      ) : (
        <div>
          {cart.map(item => (
            <CartItem key={item.id} item={item} onRemove={removeFromCart} />
          ))}

          <div className="mt-3">
            <h4>Total: ${total.toFixed(2)}</h4>
            <button className="btn btn-danger mt-2" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
