// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}> The Game Shop</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Shop</Link>
        <Link to="/cart" style={styles.link}>Cart</Link>
        {user ? (
          <>
            <span style={styles.user}>Hello, {user}!</span>
            <Link to="/add-item" style={styles.link}>Add Item</Link>
            <button onClick={logout} style={styles.button}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}
        <Link to="/myitems" style={styles.link}>My Items</Link>
        <Link to="/account" style={styles.link}>Account</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#2c2c2c", 
    color: "#fff",
    borderBottomLeftRadius: "1rem",
    borderBottomRightRadius: "1rem",
    fontFamily: "'Poppins', sans-serif", 
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  },
  logo: {
    fontSize: "1.7rem",
    fontWeight: "600",
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "0.5rem",
    transition: "background 0.3s ease",
  },
  user: {
    color: "#d1d5db",
    fontStyle: "italic",
    margin: "0 0.5rem",
  },
  button: {
    background: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    padding: "0.4rem 0.8rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

