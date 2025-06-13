"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/login.css";
import Navbar from "../components/navbar";

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
    <div className="">
      <Navbar />
      <div className="login-main">
        <div className="login-container">
          <h1 className="login-title">Signup</h1>
          <form className="login-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Email"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="login-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button type="submit" className="login-button">
              Signup
            </button>
            {error && (
              <div style={{ color: "red", marginTop: 10 }}>{error}</div>
            )}
            {success && (
              <div style={{ color: "green", marginTop: 10 }}>{success}</div>
            )}
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "#666",
                fontSize: 14,
              }}
            >
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  color: "#0070f3",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Login
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

export default Signup;
