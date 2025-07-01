"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import "../styles/signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
    } catch (err: any) {
      setError("Signup failed");
    }
  };

  // Google signup/login handler
  const handleGoogleLogin = () => {
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
    <div className="signup-root">
      <Navbar />
      <div className="signup-bg">
        <div className="signup-container">
          <div className="signup-title">Create Account</div>
          <form className="signup-form" onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signup-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="signup-input"
            />
            <button type="submit" className="signup-btn">
              Signup
            </button>
            {error && <div className="signup-error">{error}</div>}
            {success && <div className="signup-success">{success}</div>}
          </form>
          <div className="signup-or">OR</div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="signup-google-btn"
          >
            <img src="/Google.png" alt="Google" className="signup-google-img" />
            Signup with Google
          </button>
          <div className="signup-divider"></div>
          <div className="signup-footer">
            <span className="signup-footer-text">
              Already have an account?{" "}
            </span>
            <a href="/login" className="signup-footer-link">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
