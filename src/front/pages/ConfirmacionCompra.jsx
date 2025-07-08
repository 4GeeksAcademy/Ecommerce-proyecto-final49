import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/confirmacioncompra.css";

export const ConfirmacionCompra = () => {
  const [searchParams] = useSearchParams();
  const [datosPago, setDatosPago] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const paymentId = searchParams.get("payment_intent");
    console.log("PaymentIntent recibido en URL:", paymentId);

    if (paymentId) {
      // Código para validar la url 07JUL ***
      const fullUrl = `${backendUrl}/verifica-pago/${paymentId}`;
      console.log("Consultando al backend:", fullUrl);
      // Fin código para validar la url 07JUL ***

      fetch(`${backendUrl}/verifica-pago/${paymentId}`)
        .then((response) => response.json())
        .then((data) => setDatosPago(data))
        .catch((err) => console.error("Error al verificar el pago:", err));
    }
  }, []);

  if (!datosPago) return <div>Verificando el pago ...</div>;

  return (
    <div className="container">
      <div className="row d-flex align-items-center flex-column">
        <div className="col-12 col-md-7 col-lg-7 my-4 border rounded-2">
          <h2 className="mt-3">
            <i className="fa-solid fa-circle-check icono_check"></i> ¡Bien
            hecho! Pago procesado
          </h2>
          <span>Te enviaremos un e-mail con el detalle de la compra.</span>
          <p className="mt-3">
            <strong>Estado:</strong> {datosPago.status}
          </p>
          <p>
            <strong>Método:</strong> {datosPago.payment_method}
          </p>
          <p>
            <strong>Monto:</strong> ${datosPago.amount.toFixed(2)}{" "}
            {datosPago.currency.toUpperCase()}
          </p>
          <p>
            <strong>Referencia:</strong> {searchParams.get("payment_intent")}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(datosPago.created * 1000).toLocaleString()}
          </p>

          <a href="/" className="btn btn-success my-4">
            Volver al inicio
          </a>
        </div>
        <div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
    </div>
  );
};
