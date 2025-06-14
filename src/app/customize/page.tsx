// components/PromptLayout.tsx
"use client";

import { useState } from "react";
import Tshirt3D from "../components/Tshirt3D";
import styles from "./Customize.module.css";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function PromptLayout() {
  const [prompt, setPrompt] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResult, setApiResult] = useState<any>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.modelWrapper}>
          <div className={styles.modelCanvasContainer}>
            <Tshirt3D
              frontImage={apiResult?.frontImageUrl || "/vizzko_front_base.png"}
              backImage={apiResult?.backImageUrl || "/vizzko_back_base.png"}
              baseColor={apiResult?.color || "#FFFFFF"}
            />
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.promptBox}>
            <div className={styles.promptTitle}>Describe your design</div>
            <div className={styles.promptInputRow}>
              <input
                type="text"
                placeholder="Prompt Here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={styles.promptInput}
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className={styles.generateBtn}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Size Selector */}
          <div className={styles.sizeBox}>
            <div className={styles.sizeTitle}>Choose your size</div>
            <div className={styles.sizeRow}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={
                    selectedSize === size
                      ? `${styles.sizeBtn} ${styles.selected}`
                      : styles.sizeBtn
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Price */}
          <div className={styles.qtyBox}>
            <div className={styles.qtyTitle}>Quantity</div>
            <div className={styles.qtyRow}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className={styles.qtyBtn}
              >
                -
              </button>
              <div className={styles.qtyValue}>{quantity}</div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className={styles.qtyBtn}
              >
                +
              </button>
            </div>
            <div className={styles.price}>₹582.00</div>
            <button onClick={handleAddToCart} className={styles.addToCartBtn}>
              Add to Cart
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
