// components/PromptLayout.tsx
'use client';

import { useState } from 'react';
import Tshirt3D from '../components/Tshirt3D';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function PromptLayout() {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setImages([]);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt, sampleCount: 1 }),
      });
      if (!res.ok) throw new Error("Failed to generate image");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err: any) {
      setError(err.message || "Error generating image");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setError('');
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to add to cart.");
        return;
      }
      const designId = images[0]; // If images[0] is the ID, otherwise adjust accordingly

      const res = await fetch(`${baseUrl}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: "tshirt",
          designId,
          quantity,
          size: selectedSize,
          color: "white",
        }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to add to cart");
      }
      alert(`Added ${quantity} x ${selectedSize} T-shirt(s) to cart!`);
    } catch (err: any) {
      setError(err.message || "Error adding to cart");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top left, #e2deb0 0%, #d1cb97 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          background: "radial-gradient(ellipse at top left, #e2deb0 0%, #d1cb97 100%)",
          borderRadius: 40,
          boxShadow: "0 8px 40px #0006",
          padding: 40,
          width: "100%",
          maxWidth: 900,
          minHeight: 600,
          display: "flex",
          flexDirection: "row",
          gap: 40,
        }}
      >
        {/* Left: 3D Model */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 320,
          }}
        >
          <div
            style={{
              background: "#fff8",
              borderRadius: 24,
              boxShadow: "0 2px 12px #0002",
              width: 320,
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tshirt3D image={images[0] || ""} />
          </div>
        </div>

        {/* Right: Controls */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 32,
            minWidth: 320,
          }}
        >
          {/* Size Selector */}
          <div style={{ width: "100%", textAlign: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 16 }}>
              Choose your size
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    padding: "8px 24px",
                    borderRadius: 20,
                    border: "none",
                    background: selectedSize === size ? "#fff" : "#f7f6ed",
                    color: selectedSize === size ? "#232526" : "#232526bb",
                    boxShadow: selectedSize === size ? "0 2px 8px #0001" : "none",
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{
                background: "#c7c18a",
                border: "none",
                borderRadius: 8,
                width: 40,
                height: 40,
                fontSize: 28,
                fontWeight: 700,
                color: "#232526",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              -
            </button>
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                width: 48,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                border: "none",
              }}
            >
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(q => q + 1)}
              style={{
                background: "#c7c18a",
                border: "none",
                borderRadius: 8,
                width: 40,
                height: 40,
                fontSize: 28,
                fontWeight: 700,
                color: "#232526",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              +
            </button>
          </div>

          {/* Price */}
          <div style={{ fontSize: 36, fontWeight: 700, margin: "8px 0" }}>
            ₹582.00
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            style={{
              background: "#b6b07a",
              color: "#232526",
              fontWeight: 700,
              fontSize: 24,
              border: "none",
              borderRadius: 12,
              padding: "10px 48px",
              marginTop: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px #0001",
              transition: "background 0.15s",
            }}
          >
            Add to Cart
          </button>

          {/* Prompt Input */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              width: "100%",
              marginTop: 32,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px #0001",
              }}
            >
          
            </div>
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 2px 8px #0001",
                display: "flex",
                alignItems: "center",
                padding: "0 0 0 18px",
                minHeight: 64,
              }}
            >
              <input
                type="text"
                placeholder="Prompt Here"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 22,
                  flex: 1,
                  height: 56,
                  color: "#232526",
                }}
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                style={{
                  background: "#b6b07a",
                  color: "#232526",
                  fontWeight: 700,
                  fontSize: 20,
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  margin: 8,
                  cursor: prompt.trim() && !loading ? "pointer" : "not-allowed",
                  opacity: prompt.trim() && !loading ? 1 : 0.7,
                  transition: "background 0.15s",
                }}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ color: "#d90429", marginTop: 8, fontWeight: 500 }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
