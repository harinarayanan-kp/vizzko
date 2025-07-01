"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./styles/product.css";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

interface Size {
  size: string;
  price: string | number;
}

interface Product {
  tshirt: string; // maps to 'name' in backend
  sizes: Size[];
  modelUrl: string;
}

interface ProductForm {
  tshirt: string;
  sizes: Size[];
  modelUrl: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProductForm>({
    tshirt: "",
    sizes: [{ size: "", price: "" }],
    modelUrl: "",
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<ProductForm | null>(null);
  const [token, setToken] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("adminToken") || "");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products);
      else setError(data.error || "Failed to fetch products");
    } catch (e) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>, idx?: number) => {
    if (
      typeof idx === "number" &&
      (e.target.name === "size" || e.target.name === "price")
    ) {
      const sizes = [...form.sizes];
      sizes[idx] = { ...sizes[idx], [e.target.name]: e.target.value };
      setForm({ ...form, sizes });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addSizeField = () =>
    setForm({ ...form, sizes: [...form.sizes, { size: "", price: "" }] });
  const removeSizeField = (idx: number) =>
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== idx) });

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tshirt: form.tshirt,
          sizes: form.sizes.map((s) => ({
            size: s.size,
            price: Number(s.price),
          })),
          modelUrl: form.modelUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ tshirt: "", sizes: [{ size: "", price: "" }], modelUrl: "" });
        fetchProducts();
      } else setError(data.error || "Failed to add product");
    } catch {
      setError("Failed to add product");
    }
  };

  const handleDelete = async (tshirt: string) => {
    if (!window.confirm("Delete this product?")) return;
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/products/${encodeURIComponent(tshirt)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) fetchProducts();
      else setError(data.error || "Failed to delete product");
    } catch {
      setError("Failed to delete product");
    }
  };

  // Remove edit state for price only, add full product edit
  const openEdit = (product: Product) => {
    setEditProduct(product);
    setEditForm({
      tshirt: product.tshirt,
      sizes: product.sizes.map((s) => ({ ...s, price: String(s.price) })),
      modelUrl: product.modelUrl,
    });
  };

  const handleEditFormChange = (
    e: ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => {
    if (!editForm) return;
    if (
      typeof idx === "number" &&
      (e.target.name === "size" || e.target.name === "price")
    ) {
      const sizes = [...editForm.sizes];
      sizes[idx] = { ...sizes[idx], [e.target.name]: e.target.value };
      setEditForm({ ...editForm, sizes });
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };

  const addEditSizeField = () =>
    editForm &&
    setEditForm({
      ...editForm,
      sizes: [...editForm.sizes, { size: "", price: "" }],
    });
  const removeEditSizeField = (idx: number) =>
    editForm &&
    setEditForm({
      ...editForm,
      sizes: editForm.sizes.filter((_, i) => i !== idx),
    });

  const handleEditSave = async () => {
    if (!editProduct || !editForm) return;
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/products/${encodeURIComponent(
          editProduct.tshirt
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newTshirt: editForm.tshirt,
            sizes: editForm.sizes.map((s) => ({
              size: s.size,
              price: Number(s.price),
            })),
            modelUrl: editForm.modelUrl,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEditProduct(null);
        setEditForm(null);
        fetchProducts();
      } else setError(data.error || "Failed to update product");
    } catch {
      setError("Failed to update product");
    }
  };

  const handleEditCancel = () => {
    setEditProduct(null);
    setEditForm(null);
  };

  return (
    <main className="products-main">
      <div className="products-title">Products</div>
      <div className="products-card">
        {error && <div className="products-error">{error}</div>}
        <button
          className="products-add-btn products-add-modal-btn"
          onClick={() => setShowAddModal(true)}
          type="button"
        >
          + Add Product
        </button>
        {/* Add Product Modal */}
        {showAddModal && (
          <div className="products-modal-bg">
            <div className="products-modal">
              <div className="products-modal-title">Add Product</div>
              <form
                onSubmit={(e) => {
                  handleAddProduct(e);
                  setShowAddModal(false);
                }}
                className="products-modal-form"
              >
                <div className="products-form-row">
                  <input
                    name="tshirt"
                    value={form.tshirt}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="T-shirt name"
                    required
                  />
                  <input
                    name="modelUrl"
                    value={form.modelUrl}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="3D Model URL"
                    required
                  />
                </div>
                <div className="products-form-row">
                  Sizes:
                  {form.sizes.map((s, idx) => (
                    <span key={idx} className="products-size-row">
                      <input
                        name="size"
                        value={s.size}
                        onChange={(e) => handleFormChange(e, idx)}
                        placeholder="Size"
                        required
                      />
                      <input
                        name="price"
                        value={s.price}
                        onChange={(e) => handleFormChange(e, idx)}
                        placeholder="Price"
                        required
                        type="number"
                      />
                      {form.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSizeField(idx)}
                          className="products-remove-btn"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={addSizeField}
                    className="products-size-btn"
                  >
                    + Size
                  </button>
                </div>
                <div className="products-modal-actions">
                  <button
                    className="products-delete-btn"
                    type="button"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="products-add-btn" type="submit">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th className="py-2">T-shirt</th>
                <th>3D Model</th>
                <th>Sizes & Prices</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.tshirt} className="border-t">
                  <td className="py-2">{p.tshirt}</td>
                  <td>{p.modelUrl}</td>
                  <td>
                    {p.sizes.map((s, idx) => (
                      <span key={idx} className="inline-block mr-2">
                        {s.size}: {s.price}
                      </span>
                    ))}
                  </td>
                  <td>
                    <button
                      onClick={() => openEdit(p)}
                      className="products-action-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.tshirt)}
                      className="products-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Edit Modal */}
        {editProduct && editForm && (
          <div className="products-modal-bg">
            <div className="products-modal">
              <div className="products-modal-title">Edit Product</div>
              <form
                className="products-modal-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditSave();
                }}
              >
                <div className="products-form-row">
                  <input
                    name="tshirt"
                    value={editForm.tshirt}
                    onChange={(e) => handleEditFormChange(e)}
                    placeholder="T-shirt name"
                    required
                  />
                  <input
                    name="modelUrl"
                    value={editForm.modelUrl}
                    onChange={(e) => handleEditFormChange(e)}
                    placeholder="3D Model URL"
                    required
                  />
                </div>
                <div className="products-form-row">
                  Sizes:
                  {editForm.sizes.map((s, idx) => (
                    <span key={idx} className="products-size-row">
                      <input
                        name="size"
                        value={s.size}
                        onChange={(e) => handleEditFormChange(e, idx)}
                        placeholder="Size"
                        required
                      />
                      <input
                        name="price"
                        value={s.price}
                        onChange={(e) => handleEditFormChange(e, idx)}
                        placeholder="Price"
                        required
                        type="number"
                      />
                      {editForm.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEditSizeField(idx)}
                          className="products-remove-btn"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={addEditSizeField}
                    className="products-size-btn"
                  >
                    + Size
                  </button>
                </div>
                <div className="products-modal-actions">
                  <button
                    className="products-delete-btn"
                    type="button"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                  <button className="products-add-btn" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
