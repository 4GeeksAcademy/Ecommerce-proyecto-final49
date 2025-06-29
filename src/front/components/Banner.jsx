import React from "react";
import "../styles/Banner.css";

const Banner = ({ title, subtitle, onSearch, categories, searchValue }) => (
  <section className="banner">
    <div className="banner__overlay">
      <h1 className="banner__title">{title}</h1>
      {subtitle && <p className="banner__subtitle">{subtitle}</p>}

      {onSearch && (
        <form
          className="banner__search d-flex"
          onSubmit={(event) => {
            event.preventDefault();
            const searcher = event.target.elements.search.value.trim();
            if (searcher.length > 0) {
              onSearch(searcher);
            }
          }}
        >
          <input
            name="search"
            type="text"
            placeholder="que estas buscando"
            className="form-control"
            value={searchValue}
            onChange={(event) => onSearch(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </form>
      )}

      {categories && categories.length > 0 && (
        <nav className="banner__categories mt-3">
          {categories.map((categorie) => (
            <button
              key={categorie.id}
              onClick={() => { const  cleaned = categorie.name.trim();
              onSearch(cleaned)
              }            
              }
              className="btn btn-outline-secondary me-2 mb-2"
            >
              {categorie.name}
            </button>
          ))}
        </nav>
      )}
    </div>
  </section>
);

export default Banner;
