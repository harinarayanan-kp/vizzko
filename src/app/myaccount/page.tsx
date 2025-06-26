"use client";
import React from "react";
import Navbar from "../components/navbar";
import "../styles/myaccount.css";

const dummyUser = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  joined: "2024-11-15",
};

const dummyOrders = [
  {
    id: "ORD-1001",
    title: "AI Art T-shirt",
    date: "2025-06-10",
    status: "Delivered",
  },
  {
    id: "ORD-1002",
    title: "Minimal Globe Tee",
    date: "2025-06-18",
    status: "Shipped",
  },
  {
    id: "ORD-1003",
    title: "Custom Window Shirt",
    date: "2025-06-22",
    status: "Processing",
  },
];

export default function MyAccountPage() {
  // Dummy generated images
  const generatedImages = [
    "/front_sample.png",
    "/tshirt2.glb",
    "/scene.gltf",
    "/vizzko_front_base.png",
    "/vizzko_back_base.png",
  ];

  return (
    <div className="myaccount-root">
      <Navbar />
      <div className="myaccount-bg myaccount-dashboard-layout">
        {/* Sidebar: Edit user details */}
        <div className="myaccount-sidebar">
          <div className="myaccount-sidebar-title">Edit Profile</div>
          <form className="myaccount-edit-form">
            <label className="myaccount-label">Name</label>
            <input className="myaccount-input" defaultValue={dummyUser.name} />
            <label className="myaccount-label">Email</label>
            <input className="myaccount-input" defaultValue={dummyUser.email} />
            <label className="myaccount-label">Shipping Address</label>
            <textarea
              className="myaccount-input"
              defaultValue="123 Main St, City, Country"
              rows={2}
            />
            <button className="myaccount-save-btn" type="button">
              Save Changes
            </button>
          </form>
        </div>
        {/* Main content */}
        <div className="myaccount-dashboard-main">
          <div className="myaccount-title">Account Dashboard</div>
          {/* Recent Orders Row */}
          <div className="myaccount-orders-row">
            <div className="myaccount-label">Recent Orders</div>
            <div className="myaccount-orders-list">
              {dummyOrders.map((order) => (
                <div className="myaccount-order-card" key={order.id}>
                  <div className="myaccount-order-title">{order.title}</div>
                  <div className="myaccount-order-date">{order.date}</div>
                  <div
                    className={`myaccount-order-status myaccount-order-status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Generated Images Row */}
          <div className="myaccount-images-row">
            <div className="myaccount-label">Your Generated Designs</div>
            <div className="myaccount-images-list">
              {generatedImages.map((img, i) => (
                <img
                  className="myaccount-generated-img"
                  src={img}
                  alt="Generated"
                  key={i}
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              ))}
            </div>
          </div>
          {/* Dashboard grid */}
          <div className="myaccount-dashboard-grid">
            <div className="myaccount-dashboard-card">
              <div className="myaccount-dashboard-label">Orders</div>
              <div className="myaccount-dashboard-value">
                {dummyOrders.length}
              </div>
            </div>
            <div className="myaccount-dashboard-card">
              <div className="myaccount-dashboard-label">Member Since</div>
              <div className="myaccount-dashboard-value">
                {dummyUser.joined}
              </div>
            </div>
            <div className="myaccount-dashboard-card">
              <div className="myaccount-dashboard-label">Email</div>
              <div className="myaccount-dashboard-value">{dummyUser.email}</div>
            </div>
            <div className="myaccount-dashboard-card">
              <div className="myaccount-dashboard-label">Name</div>
              <div className="myaccount-dashboard-value">{dummyUser.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
