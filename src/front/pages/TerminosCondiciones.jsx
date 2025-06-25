export const TerminosCondiciones = () => {
  return (
    <div className="container py-4">
      <div className="col-12 text-center py-3 my-3 bg-dark text-white">
        <h2>Terminos y condiciones</h2>
      </div>
      <ul className="ps-3 list-unstyled">
        <li className="mb-4">
          <h4 className="mb-2">Aceptación de los Términos</h4>
          <p>
            Al acceder y utilizar este sitio web, aceptas estar sujeto a los
            presentes Términos y Condiciones. Si no estás de acuerdo con alguna
            parte de estos términos, por favor no utilices este sitio.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Información del Sitio</h4>
          <p>
            [Nombre de la tienda] es una tienda en línea dedicada a la venta de
            ropa y accesorios. Nos reservamos el derecho de modificar o
            actualizar la información del sitio en cualquier momento y sin
            previo aviso, incluyendo precios, productos y disponibilidad.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Proceso de Compra</h4>
          <p>
            El cliente debe proporcionar información veraz, completa y
            actualizada al momento de realizar una compra. Una vez confirmada la
            orden, recibirás un correo de confirmación. Nos reservamos el
            derecho de rechazar o cancelar pedidos por errores en los datos,
            problemas de stock o sospechas de fraude.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Precios y Pagos</h4>
          <p>
            Todos los precios están expresados en [moneda local] e incluyen los
            impuestos aplicables, salvo que se indique lo contrario. Los pagos
            pueden realizarse a través de los métodos disponibles en la
            plataforma y son procesados de manera segura.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Envíos y Entregas</h4>
          <p>
            Los tiempos de entrega pueden variar según la ubicación del cliente
            y la disponibilidad de los productos. [Nombre de la tienda] no se
            hace responsable por retrasos causados por terceros
            (transportadoras, eventos de fuerza mayor, etc.).
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Cambios y Devoluciones</h4>
          <p>
            Aceptamos cambios y devoluciones dentro del plazo y condiciones
            establecidos en nuestra
            <a
              href="/politica-de-reembolso"
              className="text-decoration-underline text-primary"
            >
              {" "}
              Política de Devoluciones
            </a>
            . El producto debe estar sin uso, en perfecto estado y con su
            empaque original.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Propiedad Intelectual</h4>
          <p>
            Todo el contenido de este sitio web (imágenes, textos, logos,
            diseños) es propiedad de [Nombre de la tienda] o de sus respectivos
            propietarios, y está protegido por leyes de propiedad intelectual.
            Está prohibido el uso no autorizado del mismo.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Protección de Datos</h4>
          <p>
            La información personal que el usuario proporciona será tratada de
            acuerdo con nuestra
            <a
              href="/politica-de-privacidad"
              className="text-decoration-underline text-primary"
            >
              {" "}
              Política de Privacidad
            </a>
            , cumpliendo con la normativa vigente sobre protección de datos.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Responsabilidad</h4>
          <p>
            [Nombre de la tienda] no se responsabiliza por daños derivados del
            uso indebido del sitio o de los productos adquiridos. Nos esforzamos
            por ofrecer información precisa, pero no garantizamos que el sitio
            esté libre de errores.
          </p>
        </li>

        <li className="mb-4">
          <h4 className="mb-2">Legislación Aplicable</h4>
          <p>
            Estos términos se rigen por las leyes de [país/localidad] y
            cualquier disputa será resuelta ante los tribunales competentes.
          </p>
        </li>
      </ul>
    </div>
  );
};
