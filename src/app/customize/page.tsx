// components/PromptLayout.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Tshirt3D from "../components/Tshirt3D";
import Navbar from "../components/navbar";
import "../styles/customise.css";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function PromptLayout() {
  const [prompt, setPrompt] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResult, setApiResult] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Track mouse movement (relative to .bg)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const rect = bgRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate glowPos toward mousePos for smooth trailing
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setGlowPos((prev) => {
        const lerp = 0.18; // Lower = slower, Higher = snappier
        return {
          x: prev.x + (mousePos.x - prev.x) * lerp,
          y: prev.y + (mousePos.y - prev.y) * lerp,
        };
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [mousePos]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setApiResult(null);
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
      setApiResult(data);
    } catch (err: any) {
      setError(err.message || "Error generating image");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to add to cart.");
        return;
      }
      const designId = apiResult?.frontImageUrl;

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
    <div className="customize-root">
      <div className="customize-bg" ref={bgRef}>
        {/* Glow follows cursor */}
        <div
          className="customize-cursorGlow"
          style={{
            left: mousePos.x - 200,
            top: mousePos.y - 200,
          }}
        />
        {/* 3D Model Section */}
        <div className="customize-modelSection">
          {/* Sample 3D T-shirt model using new tshirt3.glb props */}
          <Tshirt3D
            baseColor="#e0e0e0"
            backfullImage="/front_sample.png"
            backupperImage="/front_sample.png"
            frontfullImage="/front_sample.png"
            leftImage="/front_sample.png"
            rightImage="/front_sample.png"
          />
        </div>
        {/* Controls Section */}
        <div className="customize-controlsSection">
          <div className="customize-heading">Customize your T-shirt</div>
          <div className="customize-promptRow">
            <div className="customize-label">Describe your design</div>
            <div className="customize-promptInputRow">
              <textarea
                ref={promptInputRef}
                placeholder="Prompt Here"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (promptInputRef.current) {
                    promptInputRef.current.style.height = "auto";
                    promptInputRef.current.style.height =
                      promptInputRef.current.scrollHeight + "px";
                  }
                }}
                disabled={loading}
                rows={1}
                className="customize-textarea"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="customize-generateBtn"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: !prompt.trim() || loading ? 0.6 : 1,
                }}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          <div className="customize-sizeRow">
            <div className="customize-label">Choose your size</div>
            <div className="customize-sizeBtns">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`customize-sizeBtn${
                    selectedSize === size ? " selected" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="customize-qtyRow">
            <div className="customize-label">Quantity</div>
            <div className="customize-qtyBtns">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="customize-qtyBtn"
              >
                -
              </button>
              <div className="customize-qtyValue">{quantity}</div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="customize-qtyBtn"
              >
                +
              </button>
            </div>
          </div>
          <div className="customize-price">₹582.00</div>
          <button onClick={handleAddToCart} className="customize-addToCartBtn">
            Add to Cart
          </button>
          {error && <div className="customize-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
