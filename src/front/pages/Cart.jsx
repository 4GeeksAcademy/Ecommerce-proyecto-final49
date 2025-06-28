import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const userId = 1; // Cambia esto si usas auth
    const BACKEND_URL = "http://localhost:5000";

    // Obtener carrito del backend
    const fetchCart = () => {
        fetch(`${BACKEND_URL}/api/cart/${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Carrito recibido:", data);
                setCartItems(data);
            })
            .catch(err => {
                console.error("Error al cargar el carrito:", err);
            });
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Eliminar un producto individual
    const removeItem = (itemId) => {
        fetch(`${BACKEND_URL}/api/cart/${itemId}`, {
            method: "DELETE"
        }).then(() => {
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        });
    };

    // Vaciar todo el carrito
    const clearCart = () => {
        fetch(`${BACKEND_URL}/api/cart/clear/${userId}`, {
            method: "DELETE"
        }).then(() => {
            setCartItems([]);
        });
    };

    // Calcular total
    const getTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="container mt-4">
            <h2>🛒 Tu Carrito</h2>

            {cartItems.length === 0 ? (
                <p>No hay productos en el carrito.</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.id} className="card mb-3 p-3">
                            <h5>{item.product_name}</h5>
                            <p>Cantidad: {item.quantity}</p>
                            <p>Precio unitario: ${item.price}</p>
                            <p>Subtotal: ${item.quantity * item.price}</p>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeItem(item.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    <hr />
                    <h4>Total: ${getTotal()}</h4>
                    <button className="btn btn-warning mt-2" onClick={clearCart}>
                        Vaciar carrito
                    </button>
                </>
            )}
        </div>
    );
};
