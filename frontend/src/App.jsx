import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });

  const setFlashMessage = (type, text) => {
    setStatusMessage({ type, text });
    window.clearTimeout(window.__statusTimer);
    window.__statusTimer = window.setTimeout(() => {
      setStatusMessage({ type: "", text: "" });
    }, 2400);
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (error) {
      setFlashMessage("error", "Could not load items. Check backend connection.");
      console.log("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addItem = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const quantityValue = Number(formData.quantity);
      const priceValue = Number(formData.price);

      if (!formData.name.trim() || !formData.category.trim()) {
        setFlashMessage("error", "Name and category are required.");
        return;
      }

      if (!Number.isFinite(quantityValue) || quantityValue < 0) {
        setFlashMessage("error", "Quantity must be a valid number (0 or more).");
        return;
      }

      if (!Number.isFinite(priceValue) || priceValue < 0) {
        setFlashMessage("error", "Price must be a valid number (0 or more).");
        return;
      }

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        quantity: quantityValue,
        price: priceValue,
      };
      await axios.post(API_URL, payload);
      setFormData({
        name: "",
        category: "",
        quantity: "",
        price: "",
      });
      fetchItems();
      setFlashMessage("success", "Item added successfully.");
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const networkMessage = error?.message;
      setFlashMessage(
        "error",
        backendMessage || networkMessage || "Failed to add item."
      );
      console.log("Error adding item:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteItem = async (id) => {
    const shouldDelete = window.confirm("Delete this item from inventory?");

    if (!shouldDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
      setFlashMessage("success", "Item deleted.");
    } catch (error) {
      setFlashMessage("error", "Failed to delete item.");
      console.log("Error deleting item:", error);
    }
  };

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(items.map((item) => item.category?.trim()).filter(Boolean)),
    ];
  }, [items]);

  const visibleItems = useMemo(() => {
    let nextItems = [...items];

    if (query.trim()) {
      const keyword = query.toLowerCase();
      nextItems = nextItems.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.category.toLowerCase().includes(keyword)
      );
    }

    if (categoryFilter !== "all") {
      nextItems = nextItems.filter((item) => item.category === categoryFilter);
    }

    nextItems.sort((a, b) => {
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "qty-high") return Number(b.quantity) - Number(a.quantity);
      if (sortBy === "qty-low") return Number(a.quantity) - Number(b.quantity);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return nextItems;
  }, [items, query, categoryFilter, sortBy]);

  const totalValue = useMemo(() => {
    return visibleItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
  }, [visibleItems]);

  const lowStockCount = useMemo(() => {
    return visibleItems.filter((item) => Number(item.quantity) <= 3).length;
  }, [visibleItems]);

  return (
    <div className="app-shell">
      <div className="ambient ambient-top" aria-hidden="true" />
      <div className="ambient ambient-bottom" aria-hidden="true" />

      <main className="container">
        <section className="hero">
          <p className="eyebrow">Inventory Command Center</p>
          <h1>Mini MERN Item Manager</h1>
          <p className="hero-subtext">
            Track stock, spot low inventory, and keep your catalog organized in
            one place.
          </p>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <p>Total Items</p>
            <h2>{visibleItems.length}</h2>
          </article>
          <article className="stat-card">
            <p>Total Value</p>
            <h2>Rs. {totalValue.toLocaleString()}</h2>
          </article>
          <article className="stat-card alert-card">
            <p>Low Stock (&lt;= 3)</p>
            <h2>{lowStockCount}</h2>
          </article>
        </section>

        <section className="panel">
          <h3>Add New Item</h3>
          <form onSubmit={addItem} className="form">
            <input
              type="text"
              name="name"
              placeholder="Item name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

            <button type="submit" disabled={isAdding}>
              {isAdding ? "Saving..." : "Add Item"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="toolbar">
            <input
              type="text"
              placeholder="Search by name or category"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All categories" : category}
                </option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price-high">Price high to low</option>
              <option value="price-low">Price low to high</option>
              <option value="qty-high">Quantity high to low</option>
              <option value="qty-low">Quantity low to high</option>
            </select>
          </div>

          {statusMessage.text ? (
            <p className={`status-message ${statusMessage.type}`}>
              {statusMessage.text}
            </p>
          ) : null}

          {isLoading ? (
            <p className="loading">Loading items...</p>
          ) : (
            <div className="item-list">
              {visibleItems.length === 0 ? (
                <p className="empty-state">
                  No items match the current search or filter.
                </p>
              ) : (
                visibleItems.map((item, index) => (
                  <article
                    className="item-card"
                    key={item._id}
                    style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}
                  >
                    <div className="item-title-row">
                      <h4>{item.name}</h4>
                      <span className="category-chip">{item.category}</span>
                    </div>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs. {Number(item.price).toLocaleString()}</p>
                    <button onClick={() => deleteItem(item._id)}>Delete</button>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;