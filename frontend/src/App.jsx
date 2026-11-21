import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';

import {
  ProductDetails,
  Wishlist,
  Cart,
  Checkout,
  Orders,
  About,
  Contact
} from './pages/Pages';

// Authentication Pages
import {
  Login,
  Signup,
  ForgotPassword,
  Profile
} from './pages/Auth';

// Context
import { StoreProvider } from './context/StoreContext';


export default function App() {
  return (
    <StoreProvider>

      {/* Website Navbar */}
      <Navbar />

      {/* Website Routes */}
      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Shop Page */}
        <Route
          path="/shop"
          element={<Shop />}
        />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* About Us */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Contact Us */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* User Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Invalid URL - Redirect to Home */}
        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

      {/* Website Footer */}
      <Footer />

    </StoreProvider>
  );
}