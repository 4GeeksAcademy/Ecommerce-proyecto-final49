import React from 'react';
import '../styles/Banner.css';

const Banner = ({ title, subtitle, onSearch, categories }) => (
    <section className='banner'>
        <div className='banner__overlay'>
            <h1 className='banner__title'>titulo</h1>
            {subtitle && <p className='banner__subtitle'>subtitulo</p>}

            {onSearch && (
                <form
                    className='banner__search d-flex' onSubmit={event => {
                        event.preventDefault();
                        const searcher = event.target.elements.search.value.trim();
                        if (searcher) onSearch(searcher);
                    }}
                >

                    <input
                        name='search'
                        type='text'
                        placeholder='que estas buscando'
                        className='form-control '
                    />
                    <button type='submit' className='btn btn-primary'>Buscar</button>
                </form>
            )}

            {categories && categories.length > 0 && (
            <nav className='banner__categories mt-3'>
                {categories.map(categorie => (
                    <button
                        key={categories}
                        onClick={() => onSearch(categorie)}
                        className='btn btn-outline-secondary me-2 mb-2'
                    >
                        {categorie}
                    </button>
                ))}
            </nav>
            )}

        </div>


    </section>
);

export default Banner;