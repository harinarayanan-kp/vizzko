"use client";
import { useEffect, useState } from "react";
import "./styles/orders.css";
import BASE_URL from "../../../config";

interface OrderItem {
  productId?: string;
  designId?: string;
  quantity?: number;
  size?: string;
  color?: string;
  price?: number;
}

interface Order {
  _id: string;
  user?: { email?: string; name?: string };
  items: OrderItem[];
  total?: number;
  paymentStatus?: string;
  deliveryStatus?: string;
  name?: string;
  address?: string;
  billing?: string;
  createdAt?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${BASE_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch orders");
        } else {
          setError("Failed to fetch orders");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <main className="orders-main">
      <div className="orders-title">Orders</div>
      <div className="orders-card">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="orders-error">{error}</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <div className="orders-accordion-list">
            {orders.map((order) => (
              <div key={order._id} className="order-accordion">
                <div
                  className="order-accordion-header"
                  onClick={() =>
                    setOpenOrder(openOrder === order._id ? null : order._id)
                  }
                  style={{
                    cursor: "pointer",
                    background: "var(--color-glass-bg-strong)",
                    borderRadius: 12,
                    padding: "16px 20px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow:
                      openOrder === order._id
                        ? "0 2px 12px #0002"
                        : "0 1px 4px #0001",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 16 }}>
                      Order #{order._id}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#8fa1c7",
                      }}
                    >
                      {order.user?.email || "N/A"} | {order.name || "-"} |{" "}
                      {order.paymentStatus || "-"} |{" "}
                      {order.deliveryStatus || "-"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: "#4f8cff",
                      fontWeight: 600,
                    }}
                  >
                    {openOrder === order._id ? "▲" : "▼"}
                  </div>
                </div>
                {openOrder === order._id && (
                  <div
                    className="order-accordion-body"
                    style={{
                      background: "var(--color-glass-bg)",
                      borderRadius: 12,
                      margin: "0 0 16px 0",
                      padding: "18px 24px",
                      boxShadow: "0 2px 12px #0001",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 24,
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <b>Name:</b> {order.name || "-"}
                      </div>
                      <div>
                        <b>Address:</b> {order.address || "-"}
                      </div>
                      <div>
                        <b>Billing:</b> {order.billing || "-"}
                      </div>
                      <div>
                        <b>Payment Status:</b> {order.paymentStatus || "-"}
                      </div>
                      <div>
                        <b>Delivery Status:</b> {order.deliveryStatus || "-"}
                      </div>
                      <div>
                        <b>Total:</b>{" "}
                        {order.total !== undefined ? `₹${order.total}` : "-"}
                      </div>
                      <div>
                        <b>Date:</b>{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "-"}
                      </div>
                    </div>
                    <div style={{ width: "100%" }}>
                      <b>Items:</b>
                      <ul
                        style={{
                          fontSize: 15,
                          paddingLeft: 24,
                          marginTop: 8,
                          width: "100%",
                        }}
                      >
                        {order.items.map((item, idx) => (
                          <li
                            key={idx}
                            style={{
                              marginBottom: 10,
                              background: "#23263a",
                              borderRadius: 8,
                              padding: "10px 14px",
                              width: "100%",
                              color: "#fff",
                              display: "flex",
                              gap: 24,
                              flexWrap: "wrap",
                              flexDirection: "column",
                            }}
                          >
                            <span>
                              <b>Product ID:</b> {item.productId || "-"}
                            </span>
                            <span>
                              <b>Design ID:</b> {item.designId || "-"}
                            </span>
                            <span>
                              <b>Quantity:</b> {item.quantity || "-"}
                            </span>
                            <span>
                              <b>Size:</b> {item.size || "-"}
                            </span>
                            <span>
                              <b>Color:</b> {item.color || "-"}
                            </span>
                            <span>
                              <b>Price:</b>{" "}
                              {typeof item.price === "number"
                                ? `₹${item.price}`
                                : "-"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
