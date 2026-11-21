import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';


// ==================== SHOP COMPONENT ====================

export default function Shop() {
    const [params] = useSearchParams();

    const { products } = useStore();


    // ==================== FILTER STATES ====================

    const [cat, setCat] = useState(
        params.get('category') || 'All'
    );

    const [sort, setSort] = useState('featured');

    const [style, setStyle] = useState('All');

    const [occasion, setOcc] = useState('All');

    const [search, setSearch] = useState('');


    // ==================== FILTER & SORT PRODUCTS ====================

    const list = useMemo(() => {

        // Filter Products
        let p = products.filter(x =>
            (
                cat === 'All' ||
                x.category === cat
            ) && (
                style === 'All' ||
                x.style === style
            ) && (
                occasion === 'All' ||
                x.occasion === occasion
            ) && (
                !search ||
                x.name.toLowerCase().includes(
                    search.toLowerCase()
                )
            )
        );


        // Sort by Price: Low to High
        if (sort === 'low') {
            p.sort(
                (a, b) => a.price - b.price
            );
        }


        // Sort by Price: High to Low
        if (sort === 'high') {
            p.sort(
                (a, b) => b.price - a.price
            );
        }


        return p;

    }, [
        products,
        cat,
        sort,
        style,
        occasion,
        search
    ]);


    // ==================== SHOP PAGE ====================

    return (
        <main className="shop-page section">


            {/* Page Heading */}
            <p className="eyebrow">
                THE A.V. COLLECTION
            </p>

            <h1>
                Find your <em>shine.</em>
            </h1>


            {/* ==================== SHOP FILTERS ==================== */}

            <div className="shop-controls">


                {/* Search Filter */}
                <div className="filter-group">

                    <label>
                        Search
                    </label>

                    <input
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search jewellery"
                    />

                </div>


                {/* Category Filter */}
                <div className="filter-group">

                    <label>
                        Category
                    </label>

                    <select
                        value={cat}
                        onChange={e =>
                            setCat(e.target.value)
                        }
                    >

                        {[
                            'All',
                            'Earrings',
                            'Rings',
                            'Necklaces',
                            'Bracelets'
                        ].map(x => (
                            <option key={x}>
                                {x}
                            </option>
                        ))}

                    </select>

                </div>


                {/* Style Filter */}
                <div className="filter-group">

                    <label>
                        Style
                    </label>

                    <select
                        value={style}
                        onChange={e =>
                            setStyle(e.target.value)
                        }
                    >

                        {[
                            'All',
                            'Traditional',
                            'Modern',
                            'Minimal'
                        ].map(x => (
                            <option key={x}>
                                {x}
                            </option>
                        ))}

                    </select>

                </div>


                {/* Occasion Filter */}
                <div className="filter-group">

                    <label>
                        Occasion
                    </label>

                    <select
                        value={occasion}
                        onChange={e =>
                            setOcc(e.target.value)
                        }
                    >

                        {[
                            'All',
                            'Wedding',
                            'Party',
                            'Daily Wear',
                            'Festive'
                        ].map(x => (
                            <option key={x}>
                                {x}
                            </option>
                        ))}

                    </select>

                </div>


                {/* Sorting */}
                <div className="filter-group">

                    <label>
                        Sort
                    </label>

                    <select
                        value={sort}
                        onChange={e =>
                            setSort(e.target.value)
                        }
                    >

                        <option value="featured">
                            Featured
                        </option>

                        <option value="low">
                            Price: Low to high
                        </option>

                        <option value="high">
                            Price: High to low
                        </option>

                    </select>

                </div>

            </div>


            {/* ==================== PRODUCT RESULTS ==================== */}

            <p className="result-count">
                {list.length} beautiful pieces
            </p>


            {/* Product Grid */}
            <div className="product-grid">

                {list.map(p => (
                    <ProductCard
                        p={p}
                        key={p.id}
                    />
                ))}

            </div>


            {/* Empty Products Message */}
            {!list.length && (
                <p className="empty">
                    No products yet or no matches.
                    Admin can add products from the dashboard.
                </p>
            )}

        </main>
    );
}