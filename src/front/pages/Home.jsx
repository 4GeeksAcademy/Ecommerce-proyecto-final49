import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Banner from '../components/Banner.jsx';
import ProductCard from '../components/ProductCard.jsx';


export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [authors, setAuthors] = useState([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const [selectedAuthorId, setSelectedAuthorId] = useState(null);

	
	const handleSearch = (searchValue) => {
		console.log('Buscando:', searchValue);
	};

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
			<div className='container text-center mt-5'>

				<Banner
					title="No te pierdas estas ofertas"
					subtitle='Con la compra de mas de $50 el envio es gratis'
					onSearch={handleSearch}
					categories={categories}
				/>


				<h2> Productos destacados</h2>

				<div className='row product-grid'>
					{products.map((p) => {
						return p.is_featured && (
							(
								<div key={p.id} className='col-12 col-sm-6 col-md-3 mb-4'>
									<ProductCard product={p} />
								</div>
							)
						)
					})}

				</div>

				<h2> Todos los productos </h2>
				<div className='row product-grid'>
					{products.map((p) => {
						return (
							(
								<div key={p.id} className='col-12 col-sm-6 col-md-3 mb-4'>
									<ProductCard product={p} />
								</div>

							)
						)
					})}

				</div>
			</div >
		</div>
	)

}; 