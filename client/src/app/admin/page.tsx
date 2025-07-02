"use client";
import React, { useState, useEffect } from "react";
import ModernAdminDashboard from "./dashboard";
import "./styles/login.css";
import BASE_URL from "../../../config";

// Use NEXT_PUBLIC_API_BASE_URL from environment or fallback to localhost
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const AdminPage = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Check for adminToken on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      if (token) setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("adminToken", data.token); // Store admin token
      setIsLoggedIn(true);
    } else {
      setError("Invalid admin credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminToken");
    setAdminEmail("");
    setAdminPassword("");
    setError("");
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-bg">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2 className="admin-login-title">Admin Login</h2>
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="admin-login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="admin-login-input"
            required
          />
          <button type="submit" className="admin-login-btn">
            Login
          </button>
          {error && <div className="admin-login-error">{error}</div>}
        </form>
      </div>
    );
  }

  // After login, render dashboard
  return <ModernAdminDashboard />;
};

export default AdminPage;
