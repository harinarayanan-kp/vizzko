"use client";
import React, { useState } from "react";
import ModernAdminDashboard from "./dashboard";

// Use NEXT_PUBLIC_API_BASE_URL from environment or fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const AdminPage = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token); // Save the token
      setIsLoggedIn(true);
    } else {
      setError("Invalid admin credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setAdminEmail("");
    setAdminPassword("");
    setError("");
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            padding: "2.5rem 2rem",
            width: 350,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 10,
              color: "#232526",
              letterSpacing: 1,
            }}
          >
            Admin Login
          </h2>
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
            }}
            required
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(90deg, #232526 0%, #414345 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              marginTop: 8,
              boxShadow: "0 2px 8px #23252622",
              letterSpacing: 1,
              transition: "background 0.2s",
            }}
          >
            Login
          </button>
          {error && (
            <div
              style={{
                color: "#d90429",
                background: "#ffeaea",
                borderRadius: 6,
                padding: "8px 12px",
                textAlign: "center",
                fontSize: 15,
                marginTop: 4,
              }}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    );
  }

  // After login, but not fetching orders
  return (
    <ModernAdminDashboard/>
  );
};

export default AdminPage;