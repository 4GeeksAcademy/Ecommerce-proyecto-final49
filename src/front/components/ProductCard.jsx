import React from 'react';
import '../styles/ProductCard.css';
import { Link } from 'react-router-dom';




const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className='product-card'>


            <img
                src={product.image_url}
                alt={product.name}
                className='product-card__image'
            />

            <h3 className='product-card__name'>{product.name}</h3>
            <p className='product-card__price'>${product.price.toFixed(2)}</p>
            <Link to={`/producto/${product.id}`}>
            <button className='product-card__button'
            >Ver mas
            </button>
            </Link>
        </div>
    );
};

export default ProductCard;