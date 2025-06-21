import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import ProductCard from '../components/ProductCard.jsx';
import './styles/Home.css';

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const bkUrl = import.meta.env.VITE_BACKEND_URL;
				const response = await fetch(`${bkUrl}/api/products`);
				const data = await response.json();
				if (response.ok) setProducts(data);

			} catch (err) {
				console.error("Error al cargar caracteristicas del producto:", err);
			}
		};
		loadProducts();
	}, []);

	return (
		<div className='home-container text-center mt-5'>
			<h2> Productos destacados</h2>
			<div className='product-grid'>
				{products.map((p) => {
					return p.is_featured && (
						(

							<ProductCard product={p} />
						)
					)
				})}

			</div>

			<h2> Todos los productos </h2>
			<div className='product-grid'>
				{products.map((p) => {
					return (
						(

							<div key={p.image_url}>
								<img src={p.image_url} alt={p.name} />
								<h3>{p.name}</h3>
								<p>${p.price.toFixed(2)}</p>
								<button>Agregar al carrito</button>
							</div>
						)
					)
				})}


			</div>
		</div >
	)

}; 