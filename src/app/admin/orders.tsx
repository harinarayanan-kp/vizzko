"use client";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  user?: { email?: string };
  items: any[];
  total?: number;
  createdAt?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <main className="flex-1 bg-gradient-to-br from-[#181c39] to-[#242b53] min-h-screen p-8 overflow-y-auto">
      <div className="text-2xl font-bold text-[#e6e9f5] mb-4">Orders</div>
      <div className="bg-[#23254d] rounded-xl p-6 text-[#e6e9f5] min-h-[200px]">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Items</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-[#31345a]">
                    <td className="py-2 px-4">{order._id}</td>
                    <td className="py-2 px-4">{order.user?.email || "N/A"}</td>
                    <td className="py-2 px-4">{order.items.length}</td>
                    <td className="py-2 px-4">
                      {order.total !== undefined ? `₹${order.total}` : "-"}
                    </td>
                    <td className="py-2 px-4">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;