import React from "react";
import PropTypes from "prop-types";

const CardItem = ({ item }) => {
  return (
    <div className="card h-100">
      <img src={item.image} className="card-img-top" alt={item.name} />
      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text">💲{item.price.toFixed(2)}</p>
        <p className="card-text">Cantidad: {item.quantity}</p>
      </div>
    </div>
  );
};

CardItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default CardItem;
