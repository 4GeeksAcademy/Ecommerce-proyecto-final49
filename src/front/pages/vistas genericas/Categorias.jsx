import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard"

export const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Selecciona una categoría");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Cargue de las categorías disponibles desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backendUrl}/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  // Cargue de los productos filtrados por una categoría específica
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategoryId) return

      try {
        const response = await fetch(`${backendUrl}/products?category_id=${selectedCategoryId}`)
        const data = await response.json();
        setProducts(data)
      } catch (error) {
        console.error("Error al cargar productos:", error)
      }
    };
    fetchProducts();
  }, [selectedCategoryId, backendUrl])

  // Actualización del estado al seleccionar una categoría en el dropdown menu
  const handleCategorySelect = (category) => {
    setSelectedCategoryName(category.name)
    setSelectedCategoryId(category.id)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12">
          <h1 className="py-4 d-flex justify-content-center">CATEGORIAS</h1>
        </div>
        <div className="col-12 col-md-12 col-lg-12 d-flex justify-content-center py-3">

          {/* Menú desplegable */}
          <div className="dropdown">
            <button
              className="btn btn-white border dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedCategoryName}
            </button>
            <ul className="dropdown-menu">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        {/* Libros que se muestran */}
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <ProductCard product={product} />
              </div>
            ))
          ) : selectedCategoryId ? (
            <p className="text-center">No hay productos para esta categoría.  Escoje otra categoría!</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
