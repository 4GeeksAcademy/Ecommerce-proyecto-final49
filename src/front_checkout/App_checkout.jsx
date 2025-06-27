// src/front_checkout/App_checkout.jsx
import React from "react";
import PaypalCheckout from "./PaypalCheckout";

const App_checkout = () => {
  return (
    <div className="App">
      <h2 className="text-center mt-4">🧾 Checkout con PayPal</h2>
      <PaypalCheckout />
    </div>
  );
};

export default App_checkout;
