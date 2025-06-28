// components/PromptLayout.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Tshirt3D from "../components/Tshirt3D";
import Navbar from "../components/navbar";
import "../styles/customise.css";

export default function PromptLayout() {
  const [prompt, setPrompt] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResult, setApiResult] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [cartAnim, setCartAnim] = useState(false);
  const [showGoToCart, setShowGoToCart] = useState(false);
  const [productSizes, setProductSizes] = useState<
    { size: string; price: number }[]
  >([]);
  const [productId, setProductId] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

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

  // On mount, load last apiResult from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("lastApiResult");
    if (saved) {
      try {
        setApiResult(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save apiResult to localStorage whenever it changes and is not null
  useEffect(() => {
    if (apiResult) {
      localStorage.setItem("lastApiResult", JSON.stringify(apiResult));
    }
  }, [apiResult]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        // Get product details by name directly
        const prodRes = await fetch(`${baseUrl}/api/products/tshirt`);
        if (!prodRes.ok) throw new Error("Product details not found");
        const prod = await prodRes.json();
        setProductId(prod._id);
        setProductSizes(prod.sizes || []);
        // Set default price for selected size
        const found = prod.sizes.find((s: any) => s.size === selectedSize);
        setPrice(found ? found.price : 0);
      } catch (err) {
        setError("Could not load product info");
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    // Update price when size changes
    const found = productSizes.find((s) => s.size === selectedSize);
    setPrice(found ? found.price : 0);
  }, [selectedSize, productSizes]);

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
      // Save design to DB
      if (token && data?.frontImageUrl) {
        const designId =
          data.frontImageUrl.split("/").pop().split(".")[0] + Date.now();
        await fetch(`${baseUrl}/api/designs/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            designId,
            frontImageUrl: data.frontImageUrl,
            backImageUrl: data.backImageUrl,
            shoulderImageUrl: data.shoulderImageUrl,
            baseColor: data.color,
            prompt,
          }),
        });
        // Attach designId to apiResult for cart
        setApiResult((prev: any) => ({ ...prev, designId }));
      }
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
      const designId = apiResult?.designId;
      if (!designId) {
        setError("No design to add to cart.");
        return;
      }
      const res = await fetch(`${baseUrl}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId || "tshirt",
          designId,
          quantity,
          size: selectedSize,
          color: apiResult?.color || "white",
          price,
        }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to add to cart");
      }
      setShowGoToCart(true);
      setTimeout(() => setShowGoToCart(false), 3200);
    } catch (err: any) {
      setError(err.message || "Error adding to cart");
    }
  };

  return (
    <div className="customize-root">
      <div className="customize-bg" ref={bgRef}>
        {/* 3D Model Section */}
        <div
          className="customize-modelSection"
          style={{ position: "relative", overflow: "hidden" }}
        >
          {/* 3D T-shirt model using API result if available */}
          <Tshirt3D
            baseColor={apiResult?.color || "#4f4f4f"}
            frontfullImage={apiResult?.frontImageUrl || "/front_sample.png"}
            backfullImage={apiResult?.backImageUrl || "/front_sample.png"}
            leftImage={apiResult?.shoulderImageUrl || ""}
            rightImage={apiResult?.shoulderImageUrl || ""}
            backupperImage={undefined}
          />
          {/* Glow follows cursor, but only inside model section */}
          <div
            className="customize-cursorGlow"
            style={{
              left: mousePos.x - 200,
              top: mousePos.y - 200,
              pointerEvents: "none",
              position: "absolute",
            }}
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
              {productSizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s.size)}
                  className={`customize-sizeBtn${
                    selectedSize === s.size ? " selected" : ""
                  }`}
                >
                  {s.size}
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
          <div className="customize-price">₹{price}</div>
          <button
            onClick={handleAddToCart}
            className="customize-addToCartBtn"
            disabled={showGoToCart}
          >
            {showGoToCart ? (
              <>
                <span className="customize-cart-success-icon">✔</span> Added!{" "}
                <span className="customize-cart-link">Go to Cart</span>
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
          {error && <div className="customize-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
