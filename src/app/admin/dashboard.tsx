"use client";

import React, { useState, useEffect } from "react";
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
import "./styles/dashboard.css";

// Import the new section components
import Users from "./users";
import Products from "./products";
import Orders from "./orders";
import Settings from "./settings";

const Sidebar: React.FC<{
  selected: Section;
  onSelect: (section: Section) => void;
}> = ({ selected, onSelect }) => (
  <aside className="admin-sidebar">
    <div>
      <div className="admin-sidebar-title">Admin Dashboard</div>
      <nav className="admin-sidebar-nav">
        <button
          className={`admin-sidebar-btn${
            selected === "dashboard" ? " selected" : ""
          }`}
          onClick={() => onSelect("dashboard")}
        >
          <FaTachometerAlt /> Dashboard
        </button>
        <button
          className={`admin-sidebar-btn${
            selected === "users" ? " selected" : ""
          }`}
          onClick={() => onSelect("users")}
        >
          <FaUsers /> Users
        </button>
        <button
          className={`admin-sidebar-btn${
            selected === "products" ? " selected" : ""
          }`}
          onClick={() => onSelect("products")}
        >
          <FaBoxOpen /> Products
        </button>
        <button
          className={`admin-sidebar-btn${
            selected === "orders" ? " selected" : ""
          }`}
          onClick={() => onSelect("orders")}
        >
          <FaShoppingCart /> Orders
        </button>
        <button
          className={`admin-sidebar-btn${
            selected === "settings" ? " selected" : ""
          }`}
          onClick={() => onSelect("settings")}
        >
          <FaCog /> Settings
        </button>
      </nav>
    </div>
    <div className="admin-sidebar-footer">Admin</div>
  </aside>
);

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  className = "",
  children,
}) => <div className={`admin-card ${className}`}>{children}</div>;
const CardContent: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className = "", children }) => (
  <div className={`admin-card-content ${className}`}>{children}</div>
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

type Section = "dashboard" | "users" | "products" | "orders" | "settings";

const Dashboard: React.FC<{
  onUsersClick?: () => void;
}> = ({ onUsersClick }) => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    designs: 0,
    orders: 0,
    generatedImages: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const token = localStorage.getItem("adminToken");
        // Fetch users count
        const usersRes = await fetch(`${baseUrl}/api/admin/users/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = usersRes.ok ? (await usersRes.json()).count : 0;
        // Fetch designs count
        const designsRes = await fetch(`${baseUrl}/api/admin/designs/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const designs = designsRes.ok ? (await designsRes.json()).count : 0;
        // Fetch generated images count
        const genImgRes = await fetch(
          `${baseUrl}/api/admin/generatedImages/count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const generatedImages = genImgRes.ok
          ? (await genImgRes.json()).count
          : 0;
        // Fetch orders count and revenue
        const ordersRes = await fetch(`${baseUrl}/api/admin/orders/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let orders = 0,
          revenue = 0;
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          orders = data.count || 0;
          revenue = data.revenue || 0;
        }
        setStats({ users, designs, orders, generatedImages, revenue });
      } catch {
        setStats({
          users: 0,
          designs: 0,
          orders: 0,
          generatedImages: 0,
          revenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setOrdersLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRecentOrders(data.orders?.slice(-4).reverse() || []);
        } else {
          setRecentOrders([]);
        }
      } catch {
        setRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  return (
    <main className="admin-main">
      <div className="admin-header">
        <div className="admin-title">Dashboard</div>
        <div className="admin-search">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search..."
          />
          <span className="admin-search-icon">🔍</span>
        </div>
      </div>
      {/* Add a wrapper for the stats cards to enforce equal height */}
      <div className="admin-stats admin-stats-equal">
        <Card>
          <CardContent>
            <div
              className="admin-card-title cursor-pointer hover:underline"
              onClick={onUsersClick}
              style={{ cursor: onUsersClick ? "pointer" : undefined }}
            >
              <FaUsers size={22} />
              <span>Users</span>
            </div>
            <div className="admin-stat-value">
              {loading ? "-" : stats.users}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="admin-card-title">
              <FaChartBar size={22} />
              <span>Generated Images</span>
            </div>
            <div className="admin-stat-value">
              {loading ? "-" : stats.generatedImages}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="admin-card-title">
              <FaBoxOpen size={22} />
              <span>Designs</span>
            </div>
            <div className="admin-stat-value">
              {loading ? "-" : stats.designs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="admin-card-title">
              <FaShoppingCart size={22} />
              <span>Orders</span>
            </div>
            <div className="admin-stat-value">
              {loading ? "-" : stats.orders}
            </div>
          </CardContent>
        </Card>
        <Card className="admin-analytics">
          <CardContent>
            <div className="admin-card-title">
              <FaChartLine size={22} />
              <span>Total Revenue</span>
            </div>
            <div className="admin-stat-value">
              {loading ? "-" : `₹${stats.revenue.toLocaleString()}`}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

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
    case "dashboard":
      content = <Dashboard onUsersClick={() => setSelectedSection("users")} />;
      break;
    case "settings":
      content = <Settings />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <div className="admin-root">
      <Sidebar selected={selectedSection} onSelect={setSelectedSection} />
      {content}
    </div>
  );
};

export default ModernAdminDashboard;
