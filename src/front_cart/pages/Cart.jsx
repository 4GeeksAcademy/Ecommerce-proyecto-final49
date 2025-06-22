import React, { useState, useEffect } from "react";
import CardItem from "../components/CardItem";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Datos simulados (temporal hasta conectar con la API real)
    const mockCart = [
      {
        id: 1,
        name: "Producto 1",
        price: 25.99,
        quantity: 2,
        image: "https://via.placeholder.com/100"
      },
      {
        id: 2,
        name: "Producto 2",
        price: 15.5,
        quantity: 1,
        image: "https://via.placeholder.com/100"
      }
    ];
    setCartItems(mockCart);
  }, []);

  return (
    <div className="container mt-5">
      <h2>🛒 Carrito de compras</h2>
      <div className="row">
        {cartItems.map(item => (
          <div className="col-md-4 mb-3" key={item.id}>
            <CardItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
