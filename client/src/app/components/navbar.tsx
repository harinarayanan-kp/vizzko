// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import "../styles/navbar.css";

function NavbarContent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = searchParams.get("token");
      if (token) {
        localStorage.setItem("token", token);
        setLoggedIn(true);
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search
        );
      } else {
        setLoggedIn(!!localStorage.getItem("token"));
      }
    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
    setTimeout(() => window.location.reload(), 200);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/home" className="navbar-logo">
          Vizzko
        </Link>
        <div className="navbar-btns">
          {!loggedIn ? (
            <>
              <Link href="/login">
                <button className="navbar-btn">Sign In</button>
              </Link>
              <Link href="/signup">
                <button className="navbar-btn white">Sign Up</button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/cart" className="navbar-icon-btn" title="Cart">
                <svg
                  className="navbar-icon"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </Link>
              <Link
                href="/myaccount"
                className="navbar-icon-btn"
                title="Profile"
              >
                <svg
                  className="navbar-icon"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="navbar-btn logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
