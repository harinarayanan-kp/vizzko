"use client";
import { useRouter } from "next/navigation";

const Settings = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
    setTimeout(() => window.location.reload(), 200);
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-[#181c39] to-[#242b53] min-h-screen p-8 overflow-y-auto">
      <div className="text-2xl font-bold text-[#e6e9f5] mb-4">Settings</div>
      <div className="bg-[#23254d] rounded-xl p-6 text-[#e6e9f5] flex flex-col gap-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors w-fit"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default Settings;