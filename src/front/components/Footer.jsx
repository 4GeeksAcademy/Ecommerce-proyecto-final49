import { Link } from "react-router-dom";
export const Footer = () => (
	<footer className="fixed-bottom py-3 bg-dark text-white">
		<div className="container">
			<div className="row">
				<div className="col-12 col-md-4 ">
					<h4>Catergorias</h4>
					<ul className="list-unstyled">
						<li className="pb-1">
							<Link to="/quienes-somos" className="link-light link-offset-2">agregar categorias xd</Link>
						</li>
					</ul>
				</div>
				<div className="col-12 col-md-4 ">
					<h4>Acerca de nosotros</h4>
					<ul className="list-unstyled">
						<li className="pb-1">
							<Link to="/quienes-somos" className="link-light link-offset-2">Quiénes somos</Link>
						</li>
						<li className="pb-1">
							<Link to="/contactanos" className="link-light link-offset-2">Contáctanos</Link>
						</li>
						<li className="pb-1">
							<Link to="/preguntas-frecuentes" className="link-light link-offset-2">Preguntas frecuentes</Link>
						</li>
					</ul>
				</div>
				<div className="col-12 col-md-4">
					<h4>Nuestras politicas</h4>
					<ul className="list-unstyled">
						<li className="pb-1">
							<Link to="/politica-de-cancelacion" className="link-light link-offset-2">Política de cancelación</Link>
						</li>
						<li className="pb-1">
							<Link to="/politica-de-reembolso" className="link-light link-offset-2">Política de reembolsos</Link>
						</li>
						<li className="pb-1">
							<Link to="/politica-de-privacidad" className="link-light link-offset-2">Política de cancelación</Link>
						</li>
						<li className="pb-1">
							<Link to="/terminos-y-co" className="link-light link-offset-2">Terminos y condiciones</Link>
						</li>
					</ul>
				</div>

				<div className="col-12 text-center py-3">
					<p>
						© 2025, nombre de la tienda-xd
					</p>
				</div>
			</div>
		</div>
	</footer >
);
