"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Image from "next/image";
import "../styles/login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!baseUrl) {
      setError("BASE_URL is not defined");
      return;
    }
    if (!username || !password || !confirm) {
      setError("All fields are required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email: username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        setSuccess("Signup successful!");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        router.push("/"); // Navigate to home page on success
      }
    } catch {
      setError("Signup failed");
    }
  };

  // Google signup/login handler
  const handleGoogleLogin = () => {
    if (!baseUrl) {
      setError("BASE_URL is not defined");
      return;
    }
    window.location.href = `${baseUrl}/api/auth/google`;
  };

  // Store Google token from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
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
        window.location.reload();
      }
    }
  }, []);

  return (
    <div className="login-root">
      <Navbar />
      <div className="login-bg">
        <div className="login-card">
          <div className="login-title">Create Account</div>
          <form className="login-form" onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-btn">
              Create account
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
              width={24}
              height={24}
              className="login-google-logo"
            />
            Signup with Google
          </button>
          <div className="login-divider"></div>
          <div className="login-bottom-row">
            <span className="login-bottom-text">Already have an account? </span>
            <a href="/login" className="login-bottom-link">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
