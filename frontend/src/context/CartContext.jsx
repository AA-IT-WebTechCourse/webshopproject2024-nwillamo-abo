import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
//saves the cart across the website, allows for adding and removal of items, syncs authenticated users cart with API
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const { token } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (item) => {
    setCartItems((prev) => [...prev, item]);
    if (token) {
      try {
        const res = await fetch("http://localhost:8000/api/shop/cart/add/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ item_id: item.id }),
        });

        if (!res.ok) {
          console.error("Failed to add to backend cart");
        }
      } catch (err) {
        console.error("Cart add error:", err);
      }
    }
  };

  const removeFromCart = (itemToRemove) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
