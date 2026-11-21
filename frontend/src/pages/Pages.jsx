import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';


// ==================== PRODUCT DETAILS ====================

export function ProductDetails() {
    const { id } = useParams();

    const {
        products,
        add,
        toggleWish,
        wish
    } = useStore();

    // Find the selected product
    const p = products.find(
        x => String(x.id) === String(id)
    );

    const [recent, setRecent] = useState([]);


    // Recently Viewed Products
    useEffect(() => {
        if (p) {
            const old = JSON.parse(
                localStorage.getItem('av_recent') || '[]'
            ).filter(
                x => String(x.id) !== String(p.id)
            );

            const next = [p, ...old].slice(0, 6);

            localStorage.setItem(
                'av_recent',
                JSON.stringify(next)
            );

            setRecent(next);
        }
    }, [p]);


    // Product Not Found
    if (!p) {
        return (
            <div className="section">

                <h1>Product not found</h1>

                <Link to="/shop">
                    Back to shop
                </Link>

            </div>
        );
    }


    // Related Products
    const match = products
        .filter(
            x =>
                x.id !== p.id &&
                (
                    x.category === p.category ||
                    x.name !== p.name
                )
        )
        .slice(0, 4);


    return (
        <main className="section detail">


            {/* ==================== PRODUCT IMAGE ==================== */}

            <div className="detail-image">

                <img
                    src={p.image}
                    alt={p.name}
                />

            </div>


            {/* ==================== PRODUCT INFORMATION ==================== */}

            <div className="detail-info">

                <p className="eyebrow">
                    A.V. / {p.category?.toUpperCase()}
                </p>

                <h1>
                    {p.name}
                </h1>


                {/* Product Price */}
                <div className="price detail-price">
                    ₹{p.price.toLocaleString('en-IN')}
                </div>


                {/* Product Description */}
                <p>
                    {p.description ||
                        p.desc ||
                        'A beautiful jewellery piece, made to add a little sparkle to your everyday.'}
                </p>


                <p className="small-note">
                    Gift-ready packaging included.
                </p>


                {/* Add to Cart */}
                <button
                    className="btn-dark full"
                    disabled={p.stock === 0}
                    onClick={() => add(p)}
                >
                    {p.stock === 0
                        ? 'Out of stock'
                        : 'Add to bag'}
                </button>


                {/* Wishlist */}
                <button
                    className="btn-outline full"
                    onClick={() => toggleWish(p)}
                >
                    {wish.some(
                        x => String(x.id) === String(p.id)
                    )
                        ? '♥ Saved to wishlist'
                        : '♡ Add to wishlist'}
                </button>


                {/* WhatsApp Enquiry */}
                <a
                    className="whatsapp"
                    href={`https://wa.me/?text=${encodeURIComponent(
                        `Hi, I'm interested in ${p.name} (₹${p.price}).`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Ask us on WhatsApp ↗
                </a>


                {/* Product Details and Care */}
                <div className="details-accordion">

                    <p>
                        DETAILS & CARE
                    </p>

                    <p>
                        Keep your jewellery away from moisture,
                        perfumes and harsh chemicals.
                        Store in its pouch after use.
                    </p>

                    <p>
                        Available stock: {p.stock ?? 'Please enquire'}
                    </p>

                </div>

            </div>


            {/* ==================== RELATED PRODUCTS ==================== */}

            <section className="section related">

                <h2>
                    Complete the look
                </h2>

                <div className="product-grid">

                    {match.map(x => (
                        <ProductCard
                            p={x}
                            key={x.id}
                        />
                    ))}

                </div>

            </section>


            {/* ==================== RECENTLY VIEWED ==================== */}

            <section className="section related">

                <h2>
                    Recently viewed
                </h2>

                <div className="product-grid">

                    {recent.map(x => (
                        <ProductCard
                            p={x}
                            key={x.id}
                        />
                    ))}

                </div>

            </section>

        </main>
    );
}


// ==================== WISHLIST ====================

export function Wishlist() {
    const {
        wish,
        toggleWish,
        add
    } = useStore();

    return (
        <main className="section">

            <p className="eyebrow">
                YOUR LITTLE LOVE LIST
            </p>

            <h1>
                Wishlist
            </h1>


            {/* Wishlist Products */}
            {wish.length ? (

                <div className="product-grid">

                    {wish.map(p => (
                        <ProductCard
                            p={p}
                            key={p.id}
                        />
                    ))}

                </div>

            ) : (

                /* Empty Wishlist */
                <div className="empty">

                    <p>
                        Your wishlist is waiting for a little sparkle.
                    </p>

                    <Link
                        to="/shop"
                        className="btn-dark"
                    >
                        Discover jewellery
                    </Link>

                </div>

            )}

        </main>
    );
}


// ==================== SHOPPING CART ====================

export function Cart() {
    const {
        cart,
        remove,
        qty
    } = useStore();


    // Calculate Cart Total
    const total = cart.reduce(
        (s, p) => s + p.price * p.qty,
        0
    );


    return (
        <main className="section cart-page">

            <p className="eyebrow">
                YOUR SELECTION
            </p>

            <h1>
                Shopping bag
            </h1>


            {/* Empty Cart */}
            {!cart.length ? (

                <div className="empty">

                    <p>
                        Your bag is currently empty.
                    </p>

                    <Link
                        to="/shop"
                        className="btn-dark"
                    >
                        Explore the collection
                    </Link>

                </div>

            ) : (

                /* Cart Layout */
                <div className="cart-layout">


                    {/* ==================== CART ITEMS ==================== */}

                    <div className="cart-items">

                        {cart.map(p => (

                            <div
                                className="cart-row"
                                key={p.id}
                            >

                                <div>

                                    {/* Product Image */}
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                    />


                                    {/* Product Details */}
                                    <div className="cart-desc">

                                        <b>
                                            {p.name}
                                        </b>

                                        <p>
                                            ₹{p.price.toLocaleString('en-IN')}
                                        </p>


                                        {/* Quantity Controls */}
                                        <div className="quantity">

                                            <button
                                                onClick={() =>
                                                    qty(
                                                        p.id,
                                                        p.qty - 1
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {p.qty}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    qty(
                                                        p.id,
                                                        p.qty + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>


                                        {/* Remove Product */}
                                        <button
                                            className="remove"
                                            onClick={() =>
                                                remove(p.id)
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>


                                {/* Product Subtotal */}
                                <b>
                                    ₹{(
                                        p.price * p.qty
                                    ).toLocaleString('en-IN')}
                                </b>

                            </div>

                        ))}

                    </div>


                    {/* ==================== ORDER SUMMARY ==================== */}

                    <aside className="summary">

                        <h3>
                            Order summary
                        </h3>


                        {/* Subtotal */}
                        <div>

                            <span>
                                Subtotal
                            </span>

                            <b>
                                ₹{total.toLocaleString('en-IN')}
                            </b>

                        </div>


                        {/* Shipping */}
                        <div>

                            <span>
                                Shipping
                            </span>

                            <span>
                                {total >= 2999
                                    ? 'Complimentary'
                                    : 'Free delivery'}
                            </span>

                        </div>


                        <hr />


                        {/* Total */}
                        <div className="total">

                            <span>
                                Total
                            </span>

                            <b>
                                ₹{total.toLocaleString('en-IN')}
                            </b>

                        </div>


                        {/* Checkout Button */}
                        <Link
                            to="/checkout"
                            className="btn-dark full"
                        >
                            Continue to checkout
                        </Link>

                    </aside>

                </div>

            )}

        </main>
    );
}


// ==================== CHECKOUT ====================

export function Checkout() {
    const {
        cart,
        user,
        placeOrder
    } = useStore();

    const nav = useNavigate();


    // Delivery Form
    const [form, set] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: ''
    });


    const [err, setErr] = useState('');
    const [busy, setBusy] = useState(false);


    // Calculate Order Total
    const total = cart.reduce(
        (s, p) => s + p.price * p.qty,
        0
    );


    return (
        <main className="section">

            <p className="eyebrow">
                ALMOST YOURS
            </p>

            <h1>
                Checkout
            </h1>


            {/* Login Required */}
            {!user ? (

                <div className="empty">

                    <p>
                        Please login before placing your order.
                    </p>

                    <Link
                        className="btn-dark"
                        to="/login"
                    >
                        Login
                    </Link>

                </div>

            ) : !cart.length ? (

                /* Empty Cart */
                <p>
                    Your bag is empty.

                    <Link to="/shop">
                        Shop jewellery
                    </Link>
                </p>

            ) : (

                /* Checkout Form */
                <form
                    className="checkout-form"

                    onSubmit={async e => {
                        e.preventDefault();

                        setBusy(true);
                        setErr('');

                        try {
                            const o = await placeOrder(form);

                            nav('/orders', {
                                state: {
                                    placed: o._id
                                }
                            });

                        } catch (x) {
                            setErr(x.message);

                        } finally {
                            setBusy(false);
                        }
                    }}
                >


                    {/* ==================== DELIVERY DETAILS ==================== */}

                    <div>

                        <h3>
                            Delivery details
                        </h3>


                        {/* Full Name */}
                        <input
                            required
                            placeholder="Full name"
                            value={form.name}
                            onChange={e =>
                                set({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                        />


                        {/* Phone Number */}
                        <input
                            required
                            placeholder="Phone number"
                            type="tel"
                            value={form.phone}
                            onChange={e =>
                                set({
                                    ...form,
                                    phone: e.target.value
                                })
                            }
                        />


                        {/* Email */}
                        <input
                            required
                            placeholder="Email address"
                            type="email"
                            value={form.email}
                            onChange={e =>
                                set({
                                    ...form,
                                    email: e.target.value
                                })
                            }
                        />


                        {/* Delivery Address */}
                        <textarea
                            required
                            placeholder="Full address, landmark, city, state, PIN code"
                            rows="4"
                            value={form.address}
                            onChange={e =>
                                set({
                                    ...form,
                                    address: e.target.value
                                })
                            }
                        />


                        {/* Payment Method */}
                        <p>
                            <b>
                                Payment method: Cash on Delivery
                            </b>
                        </p>

                        <p className="muted">
                            Online payment gateway can be
                            integrated in a later version.
                        </p>


                        {/* Error Message */}
                        {err && (
                            <p className="form-error">
                                {err}
                            </p>
                        )}

                    </div>


                    {/* ==================== ORDER SUMMARY ==================== */}

                    <div className="summary">

                        <h3>
                            Order summary
                        </h3>


                        {/* Item Count */}
                        <p>
                            {cart.reduce(
                                (s, p) => s + p.qty,
                                0
                            )} items
                        </p>


                        {/* Total Amount */}
                        <h3>
                            Total ₹{total.toLocaleString('en-IN')}
                        </h3>


                        {/* Place Order */}
                        <button
                            className="btn-dark full"
                            disabled={busy}
                        >
                            {busy
                                ? 'Placing order...'
                                : 'Place COD order'}
                        </button>

                    </div>

                </form>

            )}

        </main>
    );
}


// ==================== ORDERS ====================

export function Orders() {
    const {
        user,
        token
    } = useStore();


    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // Fetch User Orders
    useEffect(() => {
        if (!user || !token) {
            setLoading(false);
            return;
        }

        fetch(
            `${
                import.meta.env.VITE_API_URL ||
                'http://localhost:5000/api'
            }/orders/mine`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

            .then(r =>
                r.ok
                    ? r.json()
                    : Promise.reject()
            )

            .then(setOrders)

            .catch(() =>
                setError('Could not load orders.')
            )

            .finally(() =>
                setLoading(false)
            );

    }, [user, token]);


    return (
        <main className="section">

            <p className="eyebrow">
                YOUR A.V. ACCOUNT
            </p>

            <h1>
                My orders
            </h1>


            {/* Login Required */}
            {!user ? (

                <div className="empty">

                    <p>
                        Please login to view your orders.
                    </p>

                    <Link
                        to="/login"
                        className="btn-dark"
                    >
                        Login
                    </Link>

                </div>

            ) : loading ? (

                /* Loading */
                <p>
                    Loading orders...
                </p>

            ) : error ? (

                /* Error */
                <p>
                    {error}
                </p>

            ) : !orders.length ? (

                /* No Orders */
                <div className="empty">

                    <p>
                        You haven't placed an order yet.
                    </p>

                    <Link
                        to="/shop"
                        className="btn-dark"
                    >
                        Shop now
                    </Link>

                </div>

            ) : (

                /* Orders List */
                orders.map(o => (

                    <div
                        className="order-card"
                        key={o._id}
                    >


                        {/* Order Header */}
                        <div className="order-head">

                            <b>
                                Order #{o._id.slice(-8).toUpperCase()}
                            </b>

                            <span className="order-status">
                                {o.status}
                            </span>

                        </div>


                        {/* Order Date */}
                        <p className="muted">
                            {new Date(
                                o.createdAt
                            ).toLocaleString('en-IN')}

                            · Cash on Delivery
                        </p>


                        {/* Ordered Products */}
                        {o.items.map(i => (

                            <div
                                className="order-item"
                                key={i.productId}
                            >

                                <img
                                    src={i.image}
                                    alt={i.name}
                                />

                                <div>
                                    {i.name}

                                    <br />

                                    <small>
                                        Qty {i.qty}
                                    </small>
                                </div>


                                {/* Item Price */}
                                <b>
                                    ₹{(
                                        i.price * i.qty
                                    ).toLocaleString('en-IN')}
                                </b>

                            </div>

                        ))}


                        {/* Order Total */}
                        <div className="order-total">

                            Total

                            <b>
                                ₹{o.total.toLocaleString('en-IN')}
                            </b>

                        </div>

                    </div>

                ))

            )}

        </main>
    );
}


// ==================== ABOUT ====================

export function About() {
    return (
        <main className="section story">


            {/* Story Content */}
            <div>

                <p className="eyebrow">
                    THE HEART OF A.V.
                </p>

                <h1>
                    Jewellery that tells
                    <em> your story.</em>
                </h1>


                <p>
                    We believe jewellery is more than
                    an accessory. It is a little reminder
                    of who you are, the people you love,
                    and the moments that make life meaningful.
                </p>


                <p>
                    A.V. brings together timeless inspiration
                    and modern simplicity, with pieces made
                    to feel personal, beautiful, and easy to wear.
                </p>


                {/* Shop Button */}
                <Link
                    to="/shop"
                    className="btn-dark"
                >
                    Explore our pieces
                </Link>

            </div>


            {/* Story Image */}
            <img
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1100&q=85"
                alt="A.V. Jewellery jewellery story"
            />

        </main>
    );
}


// ==================== CONTACT ====================

export function Contact() {
    return (
        <main className="section contact">

            <p className="eyebrow">
                WE'RE HERE FOR YOU
            </p>

            <h1>
                Let's talk <em>sparkle.</em>
            </h1>


            <p>
                Have a question about a piece, an order,
                or gifting? Send us a note.
            </p>


            {/* Contact Form */}
            <form
                onSubmit={e => {
                    e.preventDefault();

                    alert(
                        'Thanks for reaching out! Please use WhatsApp for direct enquiries.'
                    );
                }}
            >

                {/* Name */}
                <input
                    required
                    placeholder="Your name"
                />


                {/* Email */}
                <input
                    required
                    type="email"
                    placeholder="Email address"
                />


                {/* Order Number */}
                <input
                    placeholder="Order number (optional)"
                />


                {/* Message */}
                <textarea
                    rows="5"
                    required
                    placeholder="How can we help you?"
                />


                {/* Submit Button */}
                <button className="btn-dark">
                    Send inquiry
                </button>

            </form>


            {/* WhatsApp Contact */}
            <a
                className="whatsapp"
                href="https://wa.me/?text=Hi%20A.V.%20Jewellery%2C%20I%20have%20a%20jewellery%20inquiry."
                target="_blank"
                rel="noreferrer"
            >
                Chat on WhatsApp ↗
            </a>

        </main>
    );
}