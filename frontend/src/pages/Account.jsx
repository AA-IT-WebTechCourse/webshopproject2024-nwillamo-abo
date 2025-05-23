import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// handles changing off password of an authenticated user
export default function Account() {
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({ old_password: "", new_password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("http://localhost:8000/api/shop/change-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Password changed successfully.");
      setForm({ old_password: "", new_password: "" });
    } else {
      setMessage((data.error || "Error changing password."));
    }
  };

  if (!user)
  return (
    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1rem", color: "#374151", textAlign: "center", marginTop: "2rem" }}>
      Please log in to view your account.
    </p>
  );

  return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Account Settings</h2>
        <p style={styles.subtext}>
          Logged in as: <strong>{user}</strong>
        </p>
    
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Old Password:
            <input
              type="password"
              name="old_password"
              value={form.old_password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            New Password:
            <input
              type="password"
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>
            Change Password
          </button>
        </form>
    
        {message && <p style={styles.message}>{message}</p>}
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
    marginBottom: "0.5rem",
    color: "#111827",
    textAlign: "center",
  },
  subtext: {
    fontSize: "1rem",
    color: "#4b5563",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  label: {
    fontSize: "1rem",
    color: "#374151",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s ease",
  },
  message: {
    marginTop: "1.5rem",
    color: "#1f2937",
    fontWeight: "bold",
    textAlign: "center",
  },
};
