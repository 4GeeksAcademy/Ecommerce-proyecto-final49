// src/front_checkout/PaypalCheckout.jsx
import React, { useEffect, useRef } from "react";

const PaypalCheckout = () => {
  const paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: async () => {
          const response = await fetch("http://localhost:5002/checkout/create-order", {
            method: "POST",
          });
          const data = await response.json();
          return data.id;
        },
        onApprove: async (data, actions) => {
          const response = await fetch(`http://localhost:5002/checkout/capture-order/${data.orderID}`, {
            method: "POST",
          });
          const details = await response.json();
          alert(`✅ Pago completado por ${details.payer.name.given_name}`);
        },
        onError: (err) => {
          console.error("❌ Error:", err);
          alert("Ocurrió un error en el pago.");
        },
      })
      .render(paypalRef.current);
  }, []);

  return (
    <div className="container mt-5">
      <h3>Pagar con PayPal</h3>
      <div ref={paypalRef}></div>
    </div>
  );
};

export default PaypalCheckout;
