import React from "react";

const PaymentForm = () => {
    return (
        <>
            <div className="mb-3">
                <label className="form-label">Número de tarjeta</label>
                <input type="text" className="form-control" placeholder="1234 5678 9012 3456" required />
            </div>
            <div className="mb-3">
                <label className="form-label">Fecha de vencimiento</label>
                <input type="text" className="form-control" placeholder="MM/AA" required />
            </div>
            <div className="mb-3">
                <label className="form-label">CVV</label>
                <input type="text" className="form-control" placeholder="123" required />
            </div>
        </>
    );
};

export default PaymentForm;
