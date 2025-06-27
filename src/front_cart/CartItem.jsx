// src/front_cart/CartItem.jsx
import React from "react";

const CartItem = ({ item, onRemove }) => (
  <div className="card mb-3">
    <div className="card-body d-flex justify-content-between align-items-center">
      <div>
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text">
          ${item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>
      <button className="btn btn-outline-danger" onClick={() => onRemove(item.id)}>
        Eliminar
      </button>
    </div>
  </div>
);

export default CartItem;
