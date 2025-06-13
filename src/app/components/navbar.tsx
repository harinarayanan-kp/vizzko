// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
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
    <nav className="bg-white/80 backdrop-blur-md shadow-md w-full z-20 top-0 left-0 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="text-[2rem] font-extrabold tracking-wide text-gray-900 hover:text-blue-600 transition-colors duration-300"
        >
          Vizzko
        </Link>
        <div className="flex items-center gap-4">
          {!loggedIn ? (
            <>
              <Link href="/login">
                <button className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow transition-transform duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-5 py-2 rounded-lg bg-black text-white font-semibold shadow transition-transform duration-200 hover:bg-gray-900 hover:scale-105 active:scale-95 focus:outline-none">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold shadow transition-transform duration-200 hover:bg-red-700 hover:scale-105 active:scale-95 focus:outline-none"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
