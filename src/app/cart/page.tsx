"use client";
import React from "react";
import Navbar from "../components/navbar";
import "../styles/cart.css";

const dummyCartItems = [
  {
    id: 1,
    title: "AI Art T-shirt",
    desc: "Premium cotton, custom AI-generated print.",
    price: 29.99,
    qty: 2,
    img: "/tshirt.glb", // Use a PNG/JPG if available, fallback to a placeholder
  },
  {
    id: 2,
    title: "Minimal Globe Tee",
    desc: "Soft touch, globe design, limited edition.",
    price: 24.5,
    qty: 1,
    img: "/globe.svg",
  },
  {
    id: 3,
    title: "Custom Window Shirt",
    desc: "Window motif, glassmorphic style.",
    price: 32.0,
    qty: 1,
    img: "/window.svg",
  },
];

export default function CartPage() {
  const total = dummyCartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-root">
      <Navbar />
      <div className="cart-bg">
        <div className="cart-container">
          <div className="cart-title">Your Cart</div>
          <div className="cart-items-list">
            {dummyCartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  className="cart-item-img"
                  src={item.img}
                  alt={item.title}
                  onError={(e) => (e.currentTarget.src = "/image.png")}
                />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-desc">{item.desc}</div>
                  <div className="cart-item-price">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="cart-item-qty">x{item.qty}</div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-value">${total.toFixed(2)}</span>
          </div>
          <button className="cart-checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
}
