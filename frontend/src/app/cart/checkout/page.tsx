"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import "../../styles/cart.css";

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [billing, setBilling] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to checkout.");
        setLoading(false);
        return;
      }
      // Fetch cart items
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const cartRes = await fetch(`${baseUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!cartRes.ok) throw new Error("Failed to fetch cart");
      const cartData = await cartRes.json();
      if (!cartData.items || cartData.items.length === 0) {
        setError("Your cart is empty.");
        setLoading(false);
        return;
      }
      // Calculate total
      const SIZE_PRICES: Record<string, number> = {
        S: 499,
        M: 589,
        L: 659,
        XL: 699,
        XXL: 699,
      };
      const total = cartData.items.reduce(
        (sum: number, item: any) =>
          sum + (SIZE_PRICES[item.size] || 589) * (item.quantity || 1),
        0
      );
      // Add price to each item
      const itemsWithPrice = cartData.items.map((item: any) => ({
        ...item,
        price: SIZE_PRICES[item.size] || 589,
      }));
      // Place order
      const orderRes = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: itemsWithPrice,
          total,
          name,
          address,
          billing,
          paymentStatus: "Pending",
          deliveryStatus: "Processing",
        }),
      });
      if (!orderRes.ok) throw new Error("Failed to place order");
      setSuccess(true);
      setTimeout(() => {
        router.push("/myaccount");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-root">
      <Navbar />
      <div className="cart-bg">
        <div className="cart-container">
          <div className="cart-title">Checkout</div>
          <div className="cart-items-list" style={{ marginBottom: 0 }}>
            <div
              className="cart-item"
              style={{
                background: "var(--color-glass-bg-strong)",
                boxShadow: "0 2px 8px #0002",
                borderRadius: 18,
                padding: "18px 18px",
                marginBottom: 24,
              }}
            >
              <div className="cart-item-info" style={{ flex: 1 }}>
                <div
                  className="cart-item-title"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "var(--color-text-main)",
                  }}
                >
                  Shipping & Billing Details
                </div>
                <div
                  className="cart-item-desc"
                  style={{
                    marginTop: 8,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Please enter your name, address, and billing info to confirm
                  your order.
                </div>
              </div>
            </div>
          </div>
          {success ? (
            <div className="cart-success">Order confirmed! Redirecting...</div>
          ) : (
            <form
              className="checkout-form"
              onSubmit={handleSubmit}
              style={{
                background: "var(--color-glass-bg)",
                boxShadow: "0 2px 16px 0 #0002",
                borderRadius: 18,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              <div className="checkout-field">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="checkout-input"
                  style={{ background: "#222", color: "#fff" }}
                />
              </div>
              <div className="checkout-field">
                <label>Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="checkout-input"
                  rows={3}
                  style={{ background: "#222", color: "#fff" }}
                />
              </div>
              <div className="checkout-field">
                <label>Billing Info</label>
                <input
                  type="text"
                  value={billing}
                  onChange={(e) => setBilling(e.target.value)}
                  required
                  className="checkout-input"
                  placeholder="Card/UPI/Other (not charged)"
                  style={{ background: "#222", color: "#fff" }}
                />
              </div>
              {error && <div className="cart-error">{error}</div>}
              <button
                className="cart-checkout-btn"
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 24,
                  alignSelf: "flex-end",
                }}
              >
                {loading ? "Placing Order..." : "Continue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
