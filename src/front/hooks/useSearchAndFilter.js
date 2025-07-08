import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useSearchAndFilter(products) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get("search") || "");
    const [selectedCategoryId, setSelectedCategoryId] = useState(
        searchParams.get("category") ? Number(searchParams.get("category")) : null

    );

    const [selectedAuthorId, setSelectedAuthorId] = useState(
        searchParams.get('author') ? Number(searchParams.get('author')) : null
    );

    useEffect(() => {
        setSearchText(searchParams.get('search') || "");
        setSelectedCategoryId(
            searchParams.get("category") ? Number(searchParams.get("category")) : null
        );
        SetSelectedAuthorId(
            searchParams.get('author') ? Number(searchParams.get('author')) : null
        );
    }, [searchParams]);

    const displayedProducts = products.filter((p) => searchText ? p.title.toLowerCase().includes(searchText.toLowerCase())
: true
).filter((p) => selectedCategoryId ? p.categoryId === selectedCategoryId : true
    )
        .filter((p) => selectedAuthorId ? p.authorId === selectedAuthorId : true
        );

    function handleSearch(text) {
        setSearchParams({
            ...Object.frontEntries(searchParams),
            search: text,
        })
    }

    function handleCategorySelect(id) {
        const newParams = {
            ...Object.fromEntries(searchParams),
            category: id,
        };
        setSearchParams(newParams);
    }
    function handleAuthorSelect(id) {
        const newParams = {
            ...Object.fromEntries(searchParams),
            author: id,
        };
        setSearchParams(newParams);
    }

    return {
        searchText,
        displayedProducts,
        selectedCategoryId,
        selectedAuthorId,
        handleSearch,
        handleCategorySelect,
        handleAuthorSelect
    };
}