import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
// handles the adding of an item to the store by an authenticated user, only visible to authenticated usets
export default function AddItem() {
  const { token, user } = useContext(AuthContext);
  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/shop/items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Item created!");
        setData({ title: "", description: "", price: "" });
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || JSON.stringify(err)));
      }
    } catch (err) {
      console.error("AddItem error:", err);
      alert("⚠️ Network error. Please try again.");
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <p>Please log in to add items.</p>
      </div>
    );
  }

  return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Add New Item</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="title"
            placeholder="Item Title"
            value={data.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="description"
            placeholder="Item Description"
            value={data.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
          <input
            type="number"
            name="price"
            placeholder="Price (€)"
            value={data.price}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Create Item
          </button>
        </form>
      </div>
    );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#111827",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },
  textarea: {
    padding: "0.75rem",
    fontSize: "1rem",
    height: "120px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    resize: "vertical",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s ease",
  },
};

