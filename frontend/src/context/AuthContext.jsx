import { createContext, useState, useEffect } from "react";
// provides the authentication of users, manages login, logout and signup.
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/shop/whoami/", {
        headers: { Authorization: `Token ${token}` },
      })
        .then(res => res.json())
        .then(data => setUser(data.username))
        .catch(() => logout());
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await fetch("http://localhost:8000/api/shop/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Bad credentials");
    const { token } = await res.json();
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
