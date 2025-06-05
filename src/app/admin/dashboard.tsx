"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaChartBar,
  FaShoppingCart,
  FaChartLine,
  FaEnvelope,
  FaCog,
  FaTachometerAlt,
  FaBoxOpen,
} from "react-icons/fa";

// Import the new section components
import Users from "./users";
import Products from "./products";
import Orders from "./orders";
import Analytics from "./analytics";
import Settings from "./settings";

// Dummy Card and CardContent implementation using Tailwind CSS
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`rounded-2xl shadow-lg ${className}`}>{children}</div>
);
const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  { title: "Total Users", value: "1,200", icon: <FaUsers size={22} /> },
  { title: "Total Revenue", value: "$34,200", icon: <FaChartBar size={22} /> },
  { title: "Total Orders", value: "850", icon: <FaShoppingCart size={22} /> },
  { title: "Conversion Rate", value: "3.5%", icon: <FaChartLine size={22} /> },
];

type Section = "dashboard" | "users" | "products" | "orders" | "analytics" | "messages" | "settings";

const Sidebar: React.FC<{
  selected: Section;
  onSelect: (section: Section) => void;
}> = ({ selected, onSelect }) => (
  <aside className="bg-gradient-to-b from-[#202348] to-[#171930] text-[#e6e9f5] w-64 p-6 min-h-screen flex flex-col justify-between">
    <div>
      <div className="text-2xl font-bold mb-8 tracking-wide">Admin Dashboard</div>
      <nav className="space-y-2">
        <button
          className={`flex items-center gap-3 p-2 rounded-xl w-full text-left ${
            selected === "dashboard" ? "bg-[#272b56]" : "hover:bg-[#23254d]"
          }`}
          onClick={() => onSelect("dashboard")}
        >
          <FaTachometerAlt /> Dashboard
        </button>
        <button
          className={`flex items-center gap-3 p-2 rounded-xl w-full text-left ${
            selected === "users" ? "bg-[#272b56]" : "hover:bg-[#23254d]"
          }`}
          onClick={() => onSelect("users")}
        >
          <FaUsers /> Users
        </button>
        <button
          className={`flex items-center gap-3 p-2 rounded-xl w-full text-left ${
            selected === "products" ? "bg-[#272b56]" : "hover:bg-[#23254d]"
          }`}
          onClick={() => onSelect("products")}
        >
          <FaBoxOpen /> Products
        </button>
        <button
          className={`flex items-center gap-3 p-2 rounded-xl w-full text-left ${
            selected === "orders" ? "bg-[#272b56]" : "hover:bg-[#23254d]"
          }`}
          onClick={() => onSelect("orders")}
        >
          <FaShoppingCart /> Orders
        </button>
        <button
          className={`flex items-center gap-3 p-2 rounded-xl w-full text-left ${
            selected === "analytics" ? "bg-[#272b56]" : "hover:bg-[#23254d]"
          }`}
          onClick={() => onSelect("analytics")}
        >
          <FaChartLine /> Analytics
        </button>
        <button
          className={`flex items-center gap-3 p-2 rounded-xl w-full text-left ${
            selected === "messages" ? "bg-[#272b56]" : "hover:bg-[#23254d]"
          }`}
          onClick={() => onSelect("messages")}
        >
          <FaEnvelope /> Messages
        </button>
        <button
          className={`flex items-center gap-3 p-2 rounded-xl w-full text-left ${
            selected === "settings" ? "bg-[#272b56]" : "hover:bg-[#23254d]"
          }`}
          onClick={() => onSelect("settings")}
        >
          <FaCog /> Settings
        </button>
      </nav>
    </div>
    <div className="text-xs text-[#b0b2ca]">Admin</div>
  </aside>
);

const DashboardStats: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
    {stats.map((stat) => (
      <Card className="bg-[#23254d] border-none text-[#e6e9f5]" key={stat.title}>
        <CardContent className="flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2 text-sm">{stat.icon}<span>{stat.title}</span></div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const Dashboard: React.FC = () => (
  <main className="flex-1 bg-gradient-to-br from-[#181c39] to-[#242b53] min-h-screen p-8 overflow-y-auto">
    <div className="flex justify-between items-center mb-8">
      <div className="text-3xl font-bold text-[#e6e9f5]">Dashboard</div>
      <div className="relative">
        <input type="text" className="bg-[#23254d] rounded-full px-4 py-2 text-[#e6e9f5] focus:outline-none" placeholder="Search..." />
        <span className="absolute right-3 top-2 text-[#b0b2ca]">🔍</span>
      </div>
    </div>
    <DashboardStats />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-[#23254d] border-none text-[#e6e9f5] md:col-span-2">
        <CardContent>
          <div className="text-lg font-bold mb-4">Sales Analytics</div>
          <div className="w-full h-40 flex items-center justify-center text-[#b0b2ca] text-xl font-mono">[Analytics Chart]</div>
        </CardContent>
      </Card>
      <Card className="bg-[#23254d] border-none text-[#e6e9f5]">
        <CardContent>
          <div className="text-lg font-bold mb-4">Recent Orders</div>
          <ul className="space-y-2">
            <li className="flex justify-between"><span>Order #1234</span><span>↑</span></li>
            <li className="flex justify-between"><span>Order #1233</span><span>↓</span></li>
            <li className="flex justify-between"><span>Order #1232</span><span>-</span></li>
            <li className="flex justify-between"><span>Order #1231</span><span>-</span></li>
          </ul>
        </CardContent>
      </Card>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="bg-[#23254d] border-none text-[#e6e9f5]">
        <CardContent>
          <div className="text-lg font-bold mb-4">Messages</div>
          <ul className="space-y-2">
            <li className="flex justify-between"><span>John Doe</span><span>...</span></li>
            <li className="flex justify-between"><span>Jane Smith</span><span>...</span></li>
            <li className="flex justify-between"><span>Emily White</span><span>...</span></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </main>
);

const ModernAdminDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<Section>("dashboard");

  let content: React.ReactNode;
  switch (selectedSection) {
    case "users":
      content = <Users />;
      break;
    case "products":
      content = <Products />;
      break;
    case "orders":
      content = <Orders />;
      break;
    case "analytics":
      content = <Analytics />;
      break;
    case "dashboard":
      content = <Dashboard />;
      break;
    case "messages":
      content = (
        <main className="flex-1 bg-gradient-to-br from-[#181c39] to-[#242b53] min-h-screen p-8 overflow-y-auto">
          <div className="text-2xl font-bold text-[#e6e9f5] mb-4">Messages</div>
          <div className="bg-[#23254d] rounded-xl p-6 text-[#e6e9f5]">[Messages Section]</div>
        </main>
      );
      break;
    case "settings":
      content = <Settings />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar selected={selectedSection} onSelect={setSelectedSection} />
      {content}
    </div>
  );
};

export default ModernAdminDashboard;
