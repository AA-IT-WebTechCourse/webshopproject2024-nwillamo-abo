import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  const handleCheckout = async () => {
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    const body = token
      ? null 
      : JSON.stringify({ cart: cartItems.map((item) => item.id) });

    try {
      const res = await fetch("http://localhost:8000/api/shop/checkout/", {
        method: "POST",
        headers,
        body,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Purchase complete!");
        clearCart();
      } else {
        alert((data.error || "Checkout failed."));
      }
    } catch (err) {
      console.error(err);
      alert("Error processing checkout.");
    }
  };

  return (
<div style={styles.container}>
  <h2 style={styles.heading}>Your Cart</h2>
  {cartItems.length === 0 ? (
    <p style={styles.empty}>Your cart is currently empty.</p>
  ) : (
    <>
      <div style={styles.itemList}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.item}>
            <div>
              <h4 style={styles.itemTitle}>{item.title}</h4>
              <p style={styles.itemPrice}>€{item.price.toFixed(2)}</p>
            </div>
            <button onClick={() => removeFromCart(item)} style={styles.removeButton}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleCheckout} style={styles.checkoutButton}>
        Buy Now
      </button>
    </>
  )}
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
  empty: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#888",
  },
  itemList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.06)",
  },
  itemTitle: {
    fontSize: "1.1rem",
    fontWeight: "500",
    marginBottom: "0.25rem",
    color: "#333",
  },
  itemPrice: {
    fontSize: "0.95rem",
    color: "#10b981",
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  checkoutButton: {
    marginTop: "2rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "1rem",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    cursor: "pointer",
  },
};

