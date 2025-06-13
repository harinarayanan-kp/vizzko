"use client";
import React, { useState, useEffect } from "react";
import "../styles/login.css";
import Navbar from "../components/navbar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google login handler
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  // Email/password login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        window.location.href = "/"; // Redirect to home on success
      }
    } catch {
      setError("Login failed");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for token in query params (Google OAuth)
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("token", token);
        // Remove token from URL
        params.delete("token");
        const newUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, document.title, newUrl);
        // Optionally reload or redirect to ensure state is updated
        window.location.reload();
      }
    }
  }, []);

  return (
    <div className="">
      <Navbar />

      <div className="login-main">
        <div className="login-container">
          <h1 className="login-title">Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {error && (
              <div style={{ color: "red", marginTop: 10 }}>{error}</div>
            )}
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
              }}
            >
              New user?{" "}
              <a
                href="/signup"
                style={{
                  color: "#0070f3",
                  textDecoration: "underline",
                }}
              >
                Sign up
              </a>
            </div>
          </form>
          <div className="login-divider">or</div>
          <button
            className="login-google-button"
            type="button"
            onClick={handleGoogleLogin}
          >
            <img src="/Google.png" alt="Google" className="google-logo" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
