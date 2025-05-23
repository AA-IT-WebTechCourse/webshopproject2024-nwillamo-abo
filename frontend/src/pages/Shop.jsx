import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
// shows all items in the shop
export default function Shop() {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  const fetchItems = async (search = "") => {
    const url = search
      ? `http://localhost:8000/api/shop/items/search/?q=${encodeURIComponent(search)}`
      : `http://localhost:8000/api/shop/items/all/`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to load items:", err);
      alert("Could not load shop items.");
    }
  };

  useEffect(() => {
    fetchItems(); 
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(query);
  };

  const handlePopulate = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/shop/populate/");
      alert(res.data.message);
      fetchItems(); 
    } catch (err) {
      console.error(err);
      alert("Error populating database.");
    }
  };

  return (
    <div style={styles.container}>
  <h1 style={styles.heading}>Discover Great Games</h1>

  <button onClick={handlePopulate} style={styles.populateButton}>
    Reset & Populate DB
  </button>

  <form onSubmit={handleSearch} style={styles.searchForm}>
    <input
      type="text"
      placeholder="Search items by title..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      style={styles.searchInput}
    />
    <button type="submit" style={styles.searchButton}>Search</button>
  </form>

  <div style={styles.grid}>
    {items.map((item) => {
      const isOwner = user === item.owner;

      return (
        <div key={item.id} style={styles.card}>
          <h3 style={styles.cardTitle}>{item.title}</h3>
          <p style={styles.cardDescription}>{item.description}</p>
          <p style={styles.cardPrice}>€{item.price.toFixed(2)}</p>
          <p style={styles.meta}>By {item.owner}</p>
          <p style={styles.meta}>Added on {new Date(item.date_added).toLocaleDateString()}</p>
          <button
            onClick={() => addToCart(item)}
            style={{
              ...styles.button,
              backgroundColor: isOwner ? "#aaa" : "#4f46e5",
              cursor: isOwner ? "not-allowed" : "pointer",
            }}
            disabled={isOwner}
          >
            {isOwner ? "Your Item" : "Add to Cart"}
          </button>
        </div>
      );
    })}
  </div>
</div>

  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f4f6f8",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#2c3e50",
  },
  populateButton: {
    display: "block",
    margin: "0 auto 1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  searchForm: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
    gap: "0.5rem",
  },
  searchInput: {
    width: "300px",
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  searchButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "0.5rem",
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#666",
    marginBottom: "0.5rem",
  },
  cardPrice: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: "0.5rem",
  },
  meta: {
    fontSize: "0.8rem",
    color: "#888",
    marginBottom: "0.75rem",
  },
  button: {
    padding: "0.5rem",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
  },
};
