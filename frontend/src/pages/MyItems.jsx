import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// shows current items of authenticated user per category, deletion and price changes of items
export default function MyItems() {
  const { token, user } = useContext(AuthContext);
  const [items, setItems] = useState({ on_sale: [], sold: [], purchased: [] });

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/api/shop/items/mine/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then(setItems);
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item from sale?")) return;

    const res = await fetch(`http://localhost:8000/api/shop/items/delete/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });

    if (res.ok) {
      setItems((prev) => ({
        ...prev,
        on_sale: prev.on_sale.filter((item) => item.id !== id),
      }));
    } else {
      alert("Failed to delete item.");
    }
  };

  const handlePriceChange = (id, newPrice) => {
    setItems((prev) => ({
      ...prev,
      on_sale: prev.on_sale.map((item) =>
        item.id === id ? { ...item, price: newPrice } : item
      ),
    }));
  };

  const savePrice = async (id, price) => {
    const res = await fetch(`http://localhost:8000/api/shop/items/update/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ price }),
    });

    if (!res.ok) {
      alert("Failed to update price.");
    }
  };

  if (!user)
  return (
    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1rem", color: "#374151", textAlign: "center", marginTop: "2rem" }}>
      Please log in to view your items.
    </p>
  );

  return (
<div style={styles.container}>
  <h2 style={styles.heading}>My Items</h2>

  <section>
    <h3 style={styles.subheading}>Items for Sale</h3>
    {items.on_sale.length === 0 ? (
      <p style={styles.emptyText}>No items currently for sale.</p>
    ) : (
      items.on_sale.map((item) => (
        <div key={item.id} style={styles.card}>
          <h3 style={styles.title}>{item.title}</h3>
          <p>{item.description}</p>
          <label style={styles.label}>
            Price: €
            <input
              type="number"
              value={item.price}
              onChange={(e) => handlePriceChange(item.id, e.target.value)}
              style={styles.input}
            />
          </label>
          <div style={styles.buttonRow}>
            <button onClick={() => savePrice(item.id, item.price)} style={styles.save}>
              Save Price Change 
            </button>
            <button onClick={() => handleDelete(item.id)} style={styles.delete}>
              Remove from Sale
            </button>
          </div>
          <p style={styles.meta}>Added on {new Date(item.date_added).toLocaleDateString()}</p>
        </div>
      ))
    )}
  </section>

  <section>
    <h3 style={styles.subheading}>Sold Items</h3>
    {items.sold.length === 0 ? (
      <p style={styles.emptyText}>No items sold yet.</p>
    ) : (
      items.sold.map((item) => (
        <div key={item.id} style={styles.card}>
          <h3 style={styles.title}>{item.title}</h3>
          <p>{item.description}</p>
          <p><strong>Sold for €{item.price}</strong></p>
          <p style={styles.meta}>Added on {new Date(item.date_added).toLocaleDateString()}</p>
        </div>
      ))
    )}
  </section>

  <section>
    <h3 style={styles.subheading}>Purchased Items</h3>
    {items.purchased.length === 0 ? (
      <p style={styles.emptyText}>You haven't purchased any items yet.</p>
    ) : (
      items.purchased.map((item) => (
        <div key={item.id} style={styles.card}>
          <h3 style={styles.title}>{item.title}</h3>
          <p>{item.description}</p>
          <p><strong>Purchased for €{item.price}</strong></p>
          <p style={styles.meta}>Purchased on {new Date(item.date_added).toLocaleDateString()}</p>
        </div>
      ))
    )}
  </section>
</div>

  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "320px",
    margin: "0 auto",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2rem",
    color: "#333",
  },
  subheading: {
    fontSize: "1.5rem",
    color: "#4f46e5",
    marginTop: "2rem",
    marginBottom: "1rem",
  },
  card: {
    backgroundColor: "#fdfdfd",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
    color: "#111827",
  },
  input: {
    width: "100px",
    padding: "0.4rem",
    marginLeft: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  label: {
    display: "block",
    marginTop: "0.5rem",
    fontWeight: "500",
  },
  buttonRow: {
    marginTop: "0.75rem",
    display: "flex",
    gap: "0.5rem",
  },
  save: {
    backgroundColor: "#10b981",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  delete: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  meta: {
    fontSize: "0.8rem",
    color: "#6b7280",
    marginTop: "0.5rem",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#777",
    marginBottom: "1rem",
  },
};

