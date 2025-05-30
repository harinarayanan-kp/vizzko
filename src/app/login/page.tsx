"use client";
import React, { useState } from "react";
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
            <div style={{ textAlign: "right", marginBottom: "1em" }}>
              <a
                href="/forgot-password"
                style={{ textDecoration: "none", fontSize: "0.9em" }}
              >
                Forgot password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {error && (
              <div style={{ color: "red", marginTop: 10 }}>{error}</div>
            )}
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
