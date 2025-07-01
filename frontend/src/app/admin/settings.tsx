"use client";
import { useRouter } from "next/navigation";
import "./styles/settings.css";

const Settings = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
    setTimeout(() => window.location.reload(), 200);
  };

  return (
    <main className="settings-main">
      <div className="settings-title">Settings</div>
      <div className="settings-card">
        <button onClick={handleLogout} className="settings-logout-btn">
          Logout
        </button>
      </div>
    </main>
  );
};

export default Settings;
