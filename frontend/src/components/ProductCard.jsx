import React from 'react';
import { Link } from 'react-router-dom';

import {
    Heart,
    ShoppingBag
} from 'lucide-react';

import { useStore } from '../context/StoreContext';


export default function ProductCard({ p }) {
    const { add, toggleWish, wish } = useStore();

    // Check whether product is already saved in wishlist
    const saved = wish.some(
        x => String(x.id) === String(p.id)
    );

    return (
        <article className="product-card">

            {/* Product Image Section */}
            <div className="product-photo">

                <Link to={`/product/${p.id}`}>
                    <img
                        src={p.image || p.images?.[0]}
                        alt={p.name}
                    />
                </Link>


                {/* Bestseller Tag */}
                {p.featured && (
                    <span className="tag">
                        BESTSELLER
                    </span>
                )}


                {/* Wishlist Button */}
                <button
                    className={`heart ${saved ? 'active' : ''}`}
                    onClick={() => toggleWish(p)}
                    aria-label="Toggle wishlist"
                >
                    <Heart
                        size={16}
                        fill={saved ? 'currentColor' : 'none'}
                    />
                </button>


                {/* Add to Bag Button */}
                <button
                    className="quick-add"
                    disabled={p.stock === 0}
                    onClick={() => add(p)}
                >
                    <ShoppingBag size={14} />

                    {p.stock === 0
                        ? 'SOLD OUT'
                        : 'ADD TO BAG'}
                </button>

            </div>


            {/* Product Name */}
            <Link
                className="product-name"
                to={`/product/${p.id}`}
            >
                {p.name}
            </Link>


            {/* Product Price */}
            <span className="price">
                ₹{Number(p.price).toLocaleString('en-IN')}
            </span>

        </article>
    );
}