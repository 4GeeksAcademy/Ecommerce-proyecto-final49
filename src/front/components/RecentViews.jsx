import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const RecentViews = ({bkUrl}) => {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        const views = JSON.parse(localStorage.getItem('RecentViews')) || [];
        console.log("recentViews.parsed:", views);
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
        <div className="row mt-5 mb-5">
        {recent.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-3 mb-4">
                <ProductCard product={product} />
            </div>
        ))}
        </div>
        </>
    );
};

export default RecentViews;