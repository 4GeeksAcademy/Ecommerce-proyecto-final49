import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../store/cartContext";
import PaymentForm from "../components/PaymentForm";
import "bootstrap/dist/css/bootstrap.min.css";

const Payment = () => {
    const { cartItems, getTotalPrice } = useContext(CartContext);
    const navigate = useNavigate();

    const handlePayment = (e) => {
        e.preventDefault();
        // Aquí podrías hacer lógica extra como validación fake
        alert("Pago procesado exitosamente 🎉");
        navigate("/checkout/success"); // redirige a la confirmación de compra
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Pasarela de Pago</h2>
            <div className="row">
                <div className="col-md-6">
                    <h5>Resumen de la compra:</h5>
                    <ul className="list-group">
                        {cartItems.map((item) => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {item.name} x {item.quantity}
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                        <li className="list-group-item d-flex justify-content-between">
                            <strong>Total:</strong>
                            <strong>${getTotalPrice().toFixed(2)}</strong>
                        </li>
                    </ul>
                </div>
                <div className="col-md-6">
                    <h5 className="mb-3">Información de Pago</h5>
                    <form onSubmit={handlePayment}>
                        <PaymentForm />
                        <button type="submit" className="btn btn-primary mt-3 w-100">Pagar ahora</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
