import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer>
            <div className="footer-top">

                {/* Brand Section */}
                <div>
                    <div className="brand footer-brand">
                        A.V.<span>JEWELLERY</span>
                    </div>

                    <p>
                        Jewellery that tells your story.
                        <br />
                        Made for every version of you.
                    </p>
                </div>

                {/* Explore Section */}
                <div>
                    <h4>Explore</h4>

                    <Link to="/shop">Shop all</Link>
                    <Link to="/shop">New arrivals</Link>
                    <Link to="/wishlist">Wishlist</Link>
                </div>

                {/* Help Section */}
                <div>
                    <h4>Help</h4>

                    <Link to="/contact">Contact us</Link>
                    <Link to="/orders">My orders</Link>
                    <Link to="/about">Our story</Link>
                </div>

                {/* Newsletter Section */}
                <div>
                    <h4>Stay in the loop</h4>

                    <p>
                        Notes on new collections and little moments.
                    </p>

                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            alert('Thank you for subscribing!');
                        }}
                        className="newsletter"
                    >
                        <input
                            placeholder="Your email address"
                            type="email"
                            required
                        />

                        <button>→</button>
                    </form>
                </div>

            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                © 2026 A.V. Jewellery

                <span>
                    Designed with love & a little sparkle.
                </span>
            </div>
        </footer>
    );
}