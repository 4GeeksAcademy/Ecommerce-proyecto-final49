export const PoliticaCancelacion = () => (
  <div className="container py-4">
    <div className="col-12 text-center py-3 my-3 bg-dark text-white">
      <h2>Política de Cancelación</h2>
    </div>
    <ul className="ps-3 list-unstyled">
      <li className="mb-4">
        <h4 className="mb-2">1. Solicitud de cancelación</h4>
        <p>
          Las solicitudes de cancelación deben realizarse lo antes posible luego
          de completar un pedido. Una vez que el pedido ha sido procesado o
          enviado, no será posible cancelarlo.
        </p>
      </li>

      <li className="mb-4">
        <h4 className="mb-2">2. Cómo cancelar un pedido</h4>
        <p>
          Para cancelar un pedido, comunícate con nuestro equipo de atención al
          cliente a través de
          <a
            href="mailto:correo@ejemplo.com"
            className="text-decoration-underline text-primary"
          >
            {" "}
            correo@ejemplo.com
          </a>
          indicando el número de pedido y el motivo de la cancelación.
        </p>
      </li>

      <li className="mb-4">
        <h4 className="mb-2">3. Cancelación por parte de la tienda</h4>
        <p>
          Nos reservamos el derecho de cancelar pedidos en los siguientes casos:
          falta de stock, errores en precios o descripciones, problemas con el
          pago o sospechas de actividad fraudulenta. En estos casos, se
          notificará al cliente y se realizará el reembolso correspondiente.
        </p>
      </li>

      <li className="mb-4">
        <h4 className="mb-2">4. Reembolsos por cancelación</h4>
        <p>
          Si la cancelación es aprobada antes del envío del producto, se
          realizará el reembolso total del monto pagado. El tiempo de
          procesamiento del reembolso puede variar según el método de pago
          utilizado.
        </p>
      </li>

      <li className="mb-4">
        <h4 className="mb-2">5. Pedidos personalizados o en promoción</h4>
        <p>
          Los productos personalizados, hechos por encargo o en promoción no son
          elegibles para cancelación una vez confirmado el pedido.
        </p>
      </li>

      <li className="mb-4">
        <h4 className="mb-2">6. Aceptación de la política</h4>
        <p>
          Al realizar una compra en nuestro sitio, el cliente acepta esta
          Política de Cancelación. Nos reservamos el derecho de modificarla en
          cualquier momento, publicando los cambios en esta página.
        </p>
      </li>
    </ul>
  </div>
);
