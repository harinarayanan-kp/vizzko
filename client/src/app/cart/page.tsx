"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Image from "next/image";
import "../styles/cart.css";

interface CartItem {
  _id?: string;
  productId: string;
  designId: string;
  size: string;
  color: string;
  quantity?: number;
}

interface Design {
  designId: string;
  frontImageUrl?: string;
  prompt?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState<Record<string, Design>>({});
  const [productPrices, setProductPrices] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your cart.");
          setLoading(false);
          return;
        }
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await fetch(`${baseUrl}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCartItems(data.items || []);
        // Fetch all designs for this user
        const dres = await fetch(`${baseUrl}/api/designs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (dres.ok) {
          const ddata = await dres.json();
          const dmap: Record<string, Design> = {};
          ddata.forEach((d: Design) => {
            dmap[d.designId as string] = d;
          });
          setDesigns(dmap);
        }
        // Fetch prices for all cart items
        const priceMap: Record<string, number> = {};
        for (const item of data.items || []) {
          const priceRes = await fetch(
            `${baseUrl}/api/products/price/${item.productId}/${item.size}`
          );
          if (priceRes.ok) {
            const { price } = await priceRes.json();
            priceMap[`${item.productId}_${item.size}`] = price;
          }
        }
        setProductPrices(priceMap);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Error loading cart");
        } else {
          setError("Error loading cart");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Remove item from cart
  const handleRemove = async (item: CartItem) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${baseUrl}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item.productId,
          designId: item.designId,
          size: item.size,
          color: item.color,
        }),
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((i) => i !== item));
      }
    } catch {}
  };

  const getItemPrice = (item: CartItem) => {
    return productPrices[`${item.productId}_${item.size}`] || 0;
  };

  const total = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-root">
      <Navbar />
      <div className="cart-bg">
        <div className="cart-container">
          <div className="cart-title">Your Cart</div>
          {loading ? (
            <div className="cart-items-list">
              {[...Array(2)].map((_, idx) => (
                <div className="cart-item cart-item-loading" key={idx}>
                  <div className="cart-item-img cart-item-img-loading" />
                  <div className="cart-item-info">
                    <div className="cart-item-desc cart-item-desc-loading" />
                    <div className="cart-item-size cart-item-size-loading" />
                    <div className="cart-item-price cart-item-price-loading" />
                  </div>
                  <div className="cart-item-qty cart-item-qty-loading" />
                  <div className="cart-item-remove cart-item-remove-loading" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="cart-error">{error}</div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.length === 0 && (
                  <div className="cart-empty-state">
                    <div className="cart-empty-state-title">
                      Your cart is empty
                    </div>
                    <div className="cart-empty-state-desc">
                      Looks like you haven&apos;t added anything yet.
                      <br />
                      Start customizing your T-shirt!
                    </div>
                  </div>
                )}
                {cartItems.map((item, idx) => {
                  const design = designs[item.designId] || {};
                  // console.log("CartItem", item, "Design", design);
                  return (
                    <div className="cart-item" key={item._id || idx}>
                      <Image
                        className="cart-item-img"
                        src={design.frontImageUrl || "/image.png"}
                        alt={design.prompt || "T-shirt"}
                        width={80}
                        height={80}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/image.png";
                        }}
                      />
                      <div className="cart-item-info">
                        <div className="cart-item-desc">
                          {design.prompt ? (
                            design.prompt
                          ) : (
                            <span style={{ color: "#888" }}>
                              No prompt available
                            </span>
                          )}
                        </div>
                        <div className="cart-item-size">
                          <span style={{ color: "#fff", fontSize: 13 }}>
                            Size:
                          </span>{" "}
                          <b>{item.size}</b>
                        </div>
                        <div className="cart-item-price">
                          ₹{getItemPrice(item).toFixed(2)}
                        </div>
                      </div>
                      <div className="cart-item-qty">x{item.quantity || 1}</div>
                      <button
                        className="cart-item-remove"
                        onClick={() => handleRemove(item)}
                        title="Remove from cart"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="10" cy="10" r="10" fill="#f44336" />
                          <rect
                            x="6"
                            y="9"
                            width="8"
                            height="2"
                            rx="1"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="cart-summary">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">₹{total.toFixed(2)}</span>
              </div>
              <button
                className="cart-checkout-btn"
                onClick={() => (window.location.href = "/cart/checkout")}
                type="button"
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
