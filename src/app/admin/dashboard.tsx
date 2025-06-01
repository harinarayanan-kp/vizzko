"use client";

import React from "react";
import Link from "next/link";

// Use inline SVGs for icons to maximize compatibility
const UsersIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const BarChartIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
);
const ShoppingCartIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
);
const LineChartIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M9 17l3-3 4 4 5-5"/></svg>
);
const MailIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const SettingsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c.13.49.51.9 1 1a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.29.31-.42.74-.33 1.18z"/></svg>
);
const DashboardIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
);
const PackageIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4.13a2 2 0 0 0-2 0l-7 4.13A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.13a2 2 0 0 0 2 0l7-4.13a2 2 0 0 0 1-1.73z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);

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
  { title: "Total Users", value: "1,200", icon: <UsersIcon /> },
  { title: "Total Revenue", value: "$34,200", icon: <BarChartIcon /> },
  { title: "Total Orders", value: "850", icon: <ShoppingCartIcon /> },
  { title: "Conversion Rate", value: "3.5%", icon: <LineChartIcon /> },
];

const Sidebar: React.FC = () => (
  <aside className="bg-gradient-to-b from-[#202348] to-[#171930] text-[#e6e9f5] w-64 p-6 min-h-screen flex flex-col justify-between">
    <div>
      <div className="text-2xl font-bold mb-8 tracking-wide">Admin Dashboard</div>
      <nav className="space-y-2">
        <Link href="#" className="flex items-center gap-3 p-2 rounded-xl bg-[#272b56]">
          <DashboardIcon /> Dashboard
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#23254d] cursor-pointer">
          <UsersIcon /> Users
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#23254d] cursor-pointer">
          <PackageIcon /> Products
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#23254d] cursor-pointer">
          <ShoppingCartIcon /> Orders
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#23254d] cursor-pointer">
          <LineChartIcon /> Analytics
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#23254d] cursor-pointer">
          <MailIcon /> Messages
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#23254d] cursor-pointer">
          <SettingsIcon /> Settings
        </Link>
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
          {/* Replace below with actual chart component in real app */}
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
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default ModernAdminDashboard;
