import React, { useRef, useEffect } from "react";
import "../styles/ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const titleRef = useRef(null);

  useEffect(() => {
    const titleBook = titleRef.current;
    if (!titleBook) return;

    const bookFontSize = () => {
      let fontSize = 24;
      titleBook.style.fontSize = fontSize + "px";

      while (titleBook.scrollWidth > titleBook.clientWidth && fontSize > 12) {
        fontSize -= 1;
        titleBook.style.fontSize = fontSize + "px";
      }
    };

bookFontSize ();

window.addEventListener('resize', bookFontSize);
return () => {
    window.removeEventListener('resize', bookFontSize);
};

  }, [product.name]);

  return (
    <div className="product-card">
      <img
        src={product.image_url}
        alt={product.name}
        className="product-card__image"
      />

      <h3 ref={titleRef} className="product-card__name">
        {product.name}
      </h3>
      <p className="product-card__price">${product.price.toFixed(2)}</p>
      <Link to={`/producto/${product.id}`}>
        <button className="product-card__button">Ver mas</button>
      </Link>
    </div>
  );
};

export default ProductCard;
