import React from 'react';
import './styles/ProductCard.css';




const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div classname='product-card'>


            <img
                src={product.image_url}
                alt={product.name}
                className='product-card__image'
            />

            <h3 className='product-card__name'>{product.name}</h3>
            <p className='product-card__price'>${product.price.toFixed(2)}</p>
            <button classname='product-card__button'
                onClick={() => onAddToCart(product)}
            >Agregar al Carrito
            </button>
        </div>
    );
};

export default ProductCard;