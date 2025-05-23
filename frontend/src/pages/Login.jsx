// Handles login, and on succesfull login redirects to shop page
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setCreds((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(creds.username, creds.password);
      navigate("/");
    } catch {
      alert("Login failed: invalid credentials");
    }
  };

  return (
<div style={styles.container}>
  <h2 style={styles.heading}>Log In to Your Account</h2>
  <form onSubmit={handleSubmit} style={styles.form}>
    <input
      name="username"
      placeholder="Username"
      value={creds.username}
      onChange={handleChange}
      required
      style={styles.input}
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={creds.password}
      onChange={handleChange}
      required
      style={styles.input}
    />
    <button type="submit" style={styles.button}>
      Log In
    </button>
  </form>
</div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "400px",
    margin: "4rem auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    color: "#374151",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outlineColor: "#4f46e5",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
};
