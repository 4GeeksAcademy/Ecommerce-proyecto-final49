export const PreguntasFrecuentes = () => {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Preguntas Frecuentes</h2>
      <ol className="ps-3">
        <li className="mb-4">
          <h4 className="mb-2">¿Cuánto tarda en llegar mi pedido?</h4>
          <p>
            Los tiempos de entrega varían según tu ubicación. En promedio, los pedidos se entregan entre 3 y 7 días hábiles 
            después de la confirmación del pago. Recibirás un correo con el número de seguimiento cuando tu pedido sea enviado.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">¿Puedo cambiar o devolver un producto?</h4>
          <p>
            Sí, aceptamos cambios y devoluciones dentro de los primeros 15 días desde la recepción del pedido, 
            siempre que el producto esté en perfectas condiciones y sin uso. Consulta nuestra 
            <a href="/politica-de-reembolso" className="text-decoration-underline text-primary"> Política de Devoluciones</a> 
            para más detalles.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">¿Qué métodos de pago aceptan?</h4>
          <p>
            Aceptamos pagos con tarjetas de crédito, débito, transferencias bancarias y plataformas de pago como PayU o MercadoPago, 
            dependiendo de tu ubicación.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">¿Cómo puedo rastrear mi pedido?</h4>
          <p>
            Una vez que tu pedido sea despachado, recibirás un correo electrónico con el número de seguimiento 
            y un enlace para rastrear el estado de tu envío en tiempo real.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">¿Puedo modificar mi pedido una vez realizado?</h4>
          <p>
            Si necesitas hacer algún cambio, contáctanos lo antes posible. Haremos lo posible por ayudarte, 
            pero una vez que el pedido ha sido enviado, no es posible realizar modificaciones.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">¿Tienen tienda física?</h4>
          <p>
            Actualmente operamos únicamente en línea para ofrecerte precios más competitivos y llegar a más lugares. 
            Sin embargo, ocasionalmente participamos en ferias y eventos. ¡Síguenos en redes sociales para más información!
          </p>
        </li>
      </ol>
    </div>
  );
};
