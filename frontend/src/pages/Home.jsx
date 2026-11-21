import React from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';


// ==================== CATEGORIES ====================

const cats = [
    [
        'Earrings',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    [
        'Rings',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
    ],
    [
        'Necklaces',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    [
        'Bracelets',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80'
    ]
];


// ==================== HOME COMPONENT ====================

export default function Home() {
    const { products } = useStore();


    // Get featured products
    const featured = products
        .filter(p => p.featured)
        .slice(0, 4);


    // Display featured products or first 4 products
    const display = featured.length
        ? featured
        : products.slice(0, 4);


    return (
        <main>


            {/* ==================== HERO SECTION ==================== */}

            <section className="hero">

                {/* Hero Content */}
                <div className="hero-copy">

                    <p className="eyebrow">
                        A.V. JEWELLERY · NEW COLLECTION
                    </p>

                    <h1>
                        Find your
                        <br />
                        <em>everyday</em> sparkle.
                    </h1>

                    <p>
                        Timeless pieces, made to celebrate
                        the little moments and the big ones too.
                    </p>

                    <Link
                        className="btn-dark"
                        to="/shop"
                    >
                        Shop the collection
                    </Link>

                </div>


                {/* Hero Image */}
                <div className="hero-image">

                    <img
                        src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85"
                        alt="Elegant gold jewellery"
                    />

                </div>

            </section>


            {/* ==================== CATEGORY SECTION ==================== */}

            <section className="section">

                <div className="section-head">

                    <div>
                        <p className="eyebrow">
                            EXPLORE OUR WORLD
                        </p>

                        <h2>
                            Shop by <em>category.</em>
                        </h2>
                    </div>


                    <Link
                        to="/shop"
                        className="text-link"
                    >
                        View all pieces ↗
                    </Link>

                </div>


                {/* Category Grid */}
                <div className="category-grid">

                    {cats.map(([name, img]) => (
                        <Link
                            className="category-tile"
                            to={`/shop?category=${name}`}
                            key={name}
                        >

                            <img
                                src={img}
                                alt={name}
                            />

                            <span>
                                {name}

                                <b>
                                    SHOP ↗
                                </b>
                            </span>

                        </Link>
                    ))}

                </div>

            </section>


            {/* ==================== NEW ARRIVALS ==================== */}

            <section className="section arrivals">

                <div className="section-head">

                    <div>
                        <p className="eyebrow">
                            JUST ARRIVED
                        </p>

                        <h2>
                            New <em>favourites.</em>
                        </h2>
                    </div>


                    <Link
                        to="/shop"
                        className="text-link"
                    >
                        Shop new arrivals ↗
                    </Link>

                </div>


                {/* Product Display */}
                {display.length ? (

                    <div className="product-grid">

                        {display.map(p => (
                            <ProductCard
                                p={p}
                                key={p.id}
                            />
                        ))}

                    </div>

                ) : (

                    <div className="empty">
                        New jewellery is coming soon.
                    </div>

                )}

            </section>


            {/* ==================== OCCASION SECTION ==================== */}

            <section className="occasion">

                {/* Occasion Image */}
                <div className="occasion-img">

                    <img
                        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85"
                        alt="Gold jewellery for celebrations"
                    />

                </div>


                {/* Occasion Content */}
                <div className="occasion-copy">

                    <p className="eyebrow">
                        MADE FOR YOUR MOMENTS
                    </p>

                    <h2>
                        From everyday
                        <br />
                        to <em>extraordinary.</em>
                    </h2>

                    <p>
                        Find the finishing touch for every occasion—
                        whether it's a quiet coffee, a celebration,
                        or a day worth remembering.
                    </p>

                    <Link
                        className="btn-dark"
                        to="/shop"
                    >
                        Discover your style
                    </Link>

                </div>

            </section>


            {/* ==================== COMPLETE THE LOOK ==================== */}

            <section className="section look">

                <p className="eyebrow">
                    YOUR STYLE, YOUR STORY
                </p>

                <h2>
                    Complete the <em>look.</em>
                </h2>

                <p>
                    Pieces that are beautiful together—
                    and even more beautiful on you.
                </p>


                {/* Product Grid */}
                {display.length ? (

                    <div className="product-grid">

                        {display.slice(0, 4).map(p => (
                            <ProductCard
                                p={p}
                                key={p.id}
                            />
                        ))}

                    </div>

                ) : null}

            </section>


            {/* ==================== STORE PROMISES ==================== */}

            <div className="promise">

                <span>
                    ✦ Thoughtful packaging
                </span>

                <span>
                    ✦ Easy customer support
                </span>

                <span>
                    ✦ Cash on delivery
                </span>

                <span>
                    ✦ Made for gifting
                </span>

            </div>

        </main>
    );
}