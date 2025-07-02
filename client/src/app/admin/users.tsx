"use client";
import React, { useEffect, useState } from "react";
import "./styles/user.css";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    setPage(1); // Reset to first page when search changes
  }, [search]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.BASE_URL;
        const token = localStorage.getItem("adminToken");
        const params = new URLSearchParams({
          limit: limit.toString(),
          skip: ((page - 1) * limit).toString(),
        });
        if (search) params.append("search", search);
        const res = await fetch(
          `${baseUrl}/api/admin/users?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
          setTotal(data.total || 0);
        } else {
          setUsers([]);
          setTotal(0);
        }
      } catch {
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [search, page]);

  const totalPages = Math.ceil(total / limit);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      const baseUrl = process.env.BASE_URL;
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${baseUrl}/api/admin/users/${editUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      if (res.ok) {
        setEditUser(null);
        setEditName("");
        setEditEmail("");
        // Refresh users
        const fetchUsers = async () => {
          setLoading(true);
          try {
            const baseUrl = process.env.BASE_URL;
            const token = localStorage.getItem("adminToken");
            const params = new URLSearchParams({
              limit: limit.toString(),
              skip: ((page - 1) * limit).toString(),
            });
            if (search) params.append("search", search);
            const res = await fetch(
              `${baseUrl}/api/admin/users?${params.toString()}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (res.ok) {
              const data = await res.json();
              setUsers(data.users || []);
              setTotal(data.total || 0);
            } else {
              setUsers([]);
              setTotal(0);
            }
          } catch {
            setUsers([]);
            setTotal(0);
          } finally {
            setLoading(false);
          }
        };
        fetchUsers();
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeleteLoading(userId);
    try {
      const baseUrl = process.env.BASE_URL;
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((users) => users.filter((u) => u._id !== userId));
        setTotal((t) => t - 1);
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <main className="users-main">
      <div className="users-title">Users</div>
      <div className="users-search-bar">
        <input
          type="text"
          className="users-search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <span className="users-search-icon">🔍</span>
      </div>
      <div className="users-card">
        {loading ? (
          <div>Loading...</div>
        ) : users.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Joined</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 flex gap-2">
                    <button
                      className="users-action-btn users-edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="users-action-btn users-delete-btn"
                      onClick={() => handleDelete(user._id)}
                      disabled={deleteLoading === user._id}
                    >
                      {deleteLoading === user._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Edit Modal */}
        {editUser && (
          <div className="users-modal-bg">
            <div className="users-modal">
              <div className="users-modal-title">Edit User</div>
              <div className="mb-2">
                <label className="users-modal-label">Name</label>
                <input
                  className="users-modal-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="users-modal-label">Email</label>
                <input
                  className="users-modal-input"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              <div className="users-modal-actions">
                <button
                  className="users-modal-cancel users-action-btn"
                  onClick={() => setEditUser(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  className="users-modal-save users-action-btn"
                  onClick={handleEditSave}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pagination */}
        <div className="users-pagination">
          <span className="text-sm text-[#5a5d7a]">
            Showing {users.length} of {total} users
          </span>
          <div className="flex gap-2">
            <button
              className="users-pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-[#5a5d7a]">
              Page {page} / {totalPages || 1}
            </span>
            <button
              className="users-pagination-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Users;
