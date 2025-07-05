import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import ProductCard from "../components/ProductCard.jsx";

const AllBooks = () => {
  const { store, dispatch } = useGlobalReducer();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const bkUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${bkUrl}/products`);
        const data = await response.json();

        if (response.ok) {
          const sorted = [...data].sort((a, b) =>
            a.name.localeCompare(b.name, "es", { sensitivity: "base" })
          );

          setProducts(sorted);
        }
      } catch (error) {
        console.error("Error al cargar los libros:", error);
      }
    };

    loadBooks();
  }, []);

  return (
    <div className="container mt-4">
      <h1> Todos nuestros libros</h1>
      <div className="row">
        {products.map((book) => (
          <div key={book.id} className="col-12 col-sm-6 col-md-3 mb-4">
            <ProductCard product={book} onAddToCart={null} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBooks;
