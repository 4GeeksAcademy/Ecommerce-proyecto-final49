import React from "react";

export const Checkout = () => {
    const BACKEND_URL = "http://localhost:5000"; // o import.meta.env...

    const handleCheckout = () => {
        fetch(`${BACKEND_URL}/api/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: [
                    {
                        product_name: "Ejemplo Producto",
                        price: 25.00,
                        quantity: 1
                    }
                ]
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.url) {
                window.location.href = data.url;
            }
        });
    };

    return (
        <div className="container mt-5">
            <h2>💳 Finalizar Compra</h2>
            <button className="btn btn-success" onClick={handleCheckout}>
                Pagar con Stripe
            </button>
        </div>
    );
};
