import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import {
    Menu,
    Search,
    Heart,
    ShoppingBag,
    UserRound
} from 'lucide-react';

import { useStore } from '../context/StoreContext';


export default function Navbar() {
    const [open, setOpen] = useState(false);

    const { cart, wish, user } = useStore();

    return (
        <>
            <header className="navbar">

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu"
                    onClick={() => setOpen(!open)}
                    aria-label="Menu"
                >
                    <Menu />
                </button>


                {/* Brand Logo */}
                <Link to="/" className="brand">
                    A.V. JEWELLERY

                    <span>
                        TIMELESS · BEAUTIFUL · YOU
                    </span>
                </Link>


                {/* Navigation Links */}
                <nav className={open ? 'nav-open' : ''}>
                    <NavLink to="/">Home</NavLink>

                    <NavLink to="/shop">Shop</NavLink>

                    <NavLink to="/shop?category=Necklaces">
                        Necklaces
                    </NavLink>

                    <NavLink to="/shop?category=Earrings">
                        Earrings
                    </NavLink>

                    <NavLink to="/about">
                        Our Story
                    </NavLink>
                </nav>


                {/* Navbar Actions */}
                <div className="nav-actions">

                    {/* Search */}
                    <Link to="/shop" aria-label="Search">
                        <Search />
                    </Link>


                    {/* Account */}
                    <Link
                        to={user ? '/profile' : '/login'}
                        aria-label="Account"
                    >
                        <UserRound />
                    </Link>


                    {/* Wishlist */}
                    <Link
                        to="/wishlist"
                        className="count-icon"
                        aria-label="Wishlist"
                    >
                        <Heart />

                        <i>
                            {wish.length}
                        </i>
                    </Link>


                    {/* Shopping Cart */}
                    <Link
                        to="/cart"
                        className="count-icon"
                        aria-label="Cart"
                    >
                        <ShoppingBag />

                        <i>
                            {cart.reduce(
                                (s, x) => s + x.qty,
                                0
                            )}
                        </i>
                    </Link>

                </div>

            </header>
        </>
    );
}