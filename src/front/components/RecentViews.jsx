import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const RecentViews = ({bkUrl}) => {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        const views = JSON.parse(localStorage.getItem('RecentViews')) || [];
        if (!views.length) return;

        Promise.all(
            views.map((productId) => 
                fetch(`${bkUrl}/product/${productId}`)
                    .then((response) =>response.json())
)
)
.then(setRecent)
.catch(console.error);
    }, [bkUrl]);

    if (!recent.length) return null;

    return(
        <>
        <h2> vistos recientemente</h2>
        <div className="d-flex overflow-auto mb-4">
        {recent.map((product) => (
            <div key={product.id} className="me-3">
                <ProductCard product={product} />
            </div>
        ))}
        </div>
        </>
    );
};

export default RecentViews;