import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Banner from "../components/Banner.jsx";
import ProductCard from "../components/ProductCard.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [searchText, setSearchText] = useState('');
  

  

  const bkUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function LoadCategoriesAndAuthors() {
      try {
        const categoriesResponse = await fetch(`${bkUrl}/api/categories`);
        const authorsResponse = await fetch(`${bkUrl}/api/authors`);

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        if (authorsResponse.ok) {
          const authorsData = await authorsResponse.json();
          setAuthors(authorsData);
        }
      } catch (loadError) {
        console.error("Error al cargar categorias o autores:", loadError);
      }
    }
    LoadCategoriesAndAuthors();
  }, [bkUrl]);

  useEffect(() => {
    async function loadFilteredProducts() {
      try {
        const queryParameters = new URLSearchParams();
        if (selectedCategoryId !== null)
          queryParameters.append("category_id", selectedCategoryId);
        if (selectedAuthorId !== null)
          queryParameters.append("author_id", selectedAuthorId);

		if (searchText !== '') {
			queryParameters.append('search', searchText);
		}

        const requestUrl = `${bkUrl}/api/products${
          queryParameters.toString() ? "?" + queryParameters.toString() : ""
        }`;
        const productsResponse = await fetch(requestUrl);
        const productsData = await productsResponse.json();

        if (productsResponse.ok) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (loadError) {
        console.error("Error al cargar productos filtrados:", loadError);
		setProducts([]);
      }
    }

    loadFilteredProducts();
  }, [bkUrl, selectedCategoryId, selectedAuthorId, searchText]);

  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
  };

  // useEffect(() => {
  // 	const loadProducts = async () => {
  // 		try {
  // 			const bkUrl = import.meta.env.VITE_BACKEND_URL;
  // 			const response = await fetch(`${bkUrl}/api/products`);
  // 			const data = await response.json();
  // 			if (response.ok) setProducts(data);

  // 		} catch (err) {
  // 			console.error("Error al cargar caracteristicas del producto:", err);
  // 		}
  // 	};
  // 	loadProducts();
  // }, []);

  

  return (
    <div className="home-container text-center mt-5">
      <div className="container text-center mt-5">
        <Banner
          title="No te pierdas estas ofertas"
          subtitle="Con la compra de mas de $50 el envio es gratis"
          onSearch={handleSearch}
		  searchValue={searchText}
          categories={categories}
		  authors={authors}
        />

        <div className="row mb-4">
          <div className="col">
            <select
              className="form-select"
              value={selectedCategoryId || ""}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedCategoryId(value ? Number(value) : null);
              }}
            >
              <option value=""> Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col">
            <select
              className="form-select"
              value={selectedAuthorId || ""}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedAuthorId(value ? Number(value) : null);
              }}
            >
              <option value=""> Todas los autores</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2> Productos destacados</h2>

            <div className="row product-grid">
          {products.map((p) => {
            return (
              p.is_featured && (
                <div key={p.id} className="col-12 col-sm-6 col-md-3 mb-4">
                  <ProductCard product={p} />
                </div>
              )
            );
          })}
        </div>

        <h2> Todas las categorias </h2>
        <div className="row product-grid">
          {products.map((p) => {
            return (
              <div key={p.id} className="col-12 col-sm-6 col-md-3 mb-4">
                <ProductCard product={p} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
