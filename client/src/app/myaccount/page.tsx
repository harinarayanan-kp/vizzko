"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Tshirt3D from "../components/Tshirt3D";
import Image from "next/image";
import "../styles/myaccount.css";

interface User {
  name?: string;
  email?: string;
}

interface Order {
  _id?: string;
  id?: string;
  createdAt?: string;
  status?: string;
}

interface Design {
  frontImageUrl: string;
  backImageUrl?: string;
  shoulderImageUrl?: string;
  baseColor?: string;
}

export default function MyAccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Design[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDesign, setPopupDesign] = useState<Design | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const baseUrl = process.env.BASE_URL;
        // Fetch user info
        const userRes = await fetch(`${baseUrl}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
        // Fetch orders
        const ordersRes = await fetch(`${baseUrl}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ordersRes.ok) {
          let ordersData = await ordersRes.json();
          if (!Array.isArray(ordersData)) {
            if (ordersData.orders && Array.isArray(ordersData.orders)) {
              ordersData = ordersData.orders;
            } else {
              ordersData = [];
            }
          }
          setOrders(ordersData);
        }
        // Fetch generated designs
        const designsRes = await fetch(`${baseUrl}/api/designs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (designsRes.ok) {
          const designsData = await designsRes.json();
          setGeneratedImages(designsData);
        }
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <div className="myaccount-root">
      <Navbar />
      <div className="myaccount-bg">
        <div
          className="myaccount-dashboard-main"
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <div className="myaccount-title">Account Dashboard</div>
          {/* User Info */}
          <div className="myaccount-section" style={{ marginBottom: 24 }}>
            <div className="myaccount-label">Name</div>
            <div className="myaccount-value">{user?.name || "-"}</div>
            <div className="myaccount-label" style={{ marginTop: 12 }}>
              Email
            </div>
            <div className="myaccount-value">{user?.email || "-"}</div>
          </div>
          {/* Recent Orders Row */}
          <div className="myaccount-orders-row">
            <div className="myaccount-label">Recent Orders</div>
            <div className="myaccount-orders-list">
              {orders.length === 0 && (
                <div style={{ color: "#888", fontSize: 14 }}>
                  No orders yet.
                </div>
              )}
              {orders.map((order, idx) => (
                <div
                  className="myaccount-order-card"
                  key={order._id || order.id || idx}
                >
                  <div className="myaccount-order-title">
                    Order #{order._id || order.id || idx}
                  </div>
                  <div className="myaccount-order-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "-"}
                  </div>
                  <div
                    className={`myaccount-order-status myaccount-order-status-${order.status?.toLowerCase?.()}`}
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
              {generatedImages.length === 0 && (
                <div style={{ color: "#888", fontSize: 14 }}>
                  No generated designs yet.
                </div>
              )}
              {generatedImages.map((design, i) => (
                <Image
                  className="myaccount-generated-img"
                  src={design.frontImageUrl}
                  alt="Generated"
                  key={i}
                  width={120}
                  height={120}
                  onClick={() => {
                    setPopupDesign(design);
                    setShowPopup(true);
                  }}
                  style={{ cursor: "pointer" }}
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.opacity =
                      "0.3")
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showPopup && popupDesign && (
        <div
          className="myaccount-popup-overlay"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="myaccount-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="myaccount-popup-3dview">
              <Tshirt3D
                baseColor={popupDesign.baseColor || "#fff"}
                frontfullImage={popupDesign.frontImageUrl}
                backfullImage={popupDesign.backImageUrl}
                leftImage={popupDesign.shoulderImageUrl}
                rightImage={popupDesign.shoulderImageUrl}
                backupperImage={undefined}
              />
            </div>
            <button
              className="myaccount-popup-close"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
