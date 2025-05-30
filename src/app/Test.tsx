"use client";
import React, { useState, useEffect } from "react";
import Tshirt3D from "./components/Tshirt3D";

const Test: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check login status on mount
  useEffect(() => {
    // Check for token in URL (Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, "/");
    }

    // Always check for token in localStorage
    const token = tokenFromUrl || localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || null);
      } catch {
        setUserEmail(null);
      }
    } else {
      setUserEmail(null);
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserEmail(null);
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setImages([]);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <div style={{ marginBottom: 16 }}>
        {userEmail ? (
          <>
            Signed in as <b>{userEmail}</b>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: 12,
                padding: "4px 12px",
                fontSize: "0.95em",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>Not signed in</>
        )}
      </div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        style={{ width: "70%", padding: "8px" }}
        disabled={!userEmail}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt || !userEmail}
        style={{ marginLeft: 8 }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      {!userEmail && (
        <div style={{ color: "orange", marginTop: 10 }}>
          Please sign in to generate images.
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
        }}
      >
        <Tshirt3D image={images[0] || ""} />

        {images.length > 0 && (
          <div
            style={{
              width: 300,
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={`data:image/png;base64,${images[0]}`}
              alt="Generated"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: 8,
                boxShadow: "0 2px 8px #0002",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
