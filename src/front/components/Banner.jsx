import React from "react";
import "../styles/Banner.css";

const Banner = ({ title, subtitle, onSearch, categories, searchValue, onCategorySelect, }) => (
  <section className="banner">
    <img src='/Banner.jpg'
    alt='Banner Principal'
    className='Banner__img'
    />
    <div className="banner__overlay">
      <h1 className="banner__title">{title}</h1>
      {subtitle && <p className="banner__subtitle">{subtitle}</p>}

      {/* {onSearch && (
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
      )} */}

      {categories && categories.length > 0 && (
        <nav className="banner__categories">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)
              }            
              
              className="btn btn-outline-secondary me-2 mb-2"
            >
              {category.name}
            </button>
          ))}
        </nav>
      )}
    </div>
  </section>
);

export default Banner;