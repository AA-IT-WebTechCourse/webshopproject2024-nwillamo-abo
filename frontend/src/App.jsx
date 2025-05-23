import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./pages/Shop";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Account from "./pages/Account";
import MyItems from "./pages/MyItems";
import Navbar from './components/Navbar';
import Cart from "./pages/Cart";
import AddItem from "./pages/AddItem";
import { CartProvider } from './context/CartContext';
import  AuthProvider from './context/AuthContext';  // <-- Import AuthProvider, NOT AuthContext

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar /> 
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/myitems" element={<MyItems />} />
            <Route path="/" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-item" element={<AddItem />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
