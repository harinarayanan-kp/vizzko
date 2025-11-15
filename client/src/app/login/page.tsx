"use client";
import React, { useState, useEffect } from "react";
import "../styles/login.css";
import Navbar from "../components/navbar";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

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
    if (!BASE_URL) {
      setError("BASE_URL is not defined");
    }
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
    <div className="login-root">
      <Navbar />
      <div className="login-bg">
        {/* <Navbar /> */}
        <div className="login-card">
          <div className="login-title">Welcome Back!</div>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <div className="login-checkbox-row">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                    margin: 0,
                    padding: 0,
                  }}
                />
                <span
                  className={`login-checkbox-box${remember ? " checked" : ""}`}
                >
                  {remember && (
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <polyline
                        points="1,7 5,11 13,3"
                        style={{ fill: "none", stroke: "#fff", strokeWidth: 2 }}
                      />
                    </svg>
                  )}
                </span>
              </label>
              <span className="login-checkbox-text">Remember me</span>
              <span style={{ flex: 1 }} />
              <span className="login-forgot">Forgot Password?</span>
            </div>
            <button type="submit" className="login-btn">
              LOGIN
            </button>
            {error && <div className="login-error">{error}</div>}
          </form>
          <div className="login-or-text">OR</div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="login-google-btn"
          >
            <Image
              src="/Google.png"
              alt="Google"
              className="login-google-logo"
              width={20}
              height={20}
            />
            Login with Google
          </button>
          <div className="login-divider"></div>
          <div className="login-bottom-row">
            <span className="login-bottom-text">Create an account? </span>
            <a href="/signup" className="login-bottom-link">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
