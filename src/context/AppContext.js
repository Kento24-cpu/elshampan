import React, { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const addToCart = (product) => setCart((prev) => {
    const found = prev.find((x) => x.id === product.id);
    if (found) return prev.map((x) => x.id === product.id ? { ...x, quantity: Math.min(x.quantity + 1, product.stock) } : x);
    return [...prev, { ...product, quantity: 1 }];
  });

  const removeFromCart = (id) => setCart((prev) => prev.filter((x) => x.id !== id));
  const updateQuantity = (id, quantity) => setCart((prev) => prev.map((x) => x.id === id ? { ...x, quantity: Math.max(1, Math.min(quantity, x.stock)) } : x));
  const clearCart = () => setCart([]);

  const toggleFavorite = (id) => setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const count = cart.reduce((sum, x) => sum + x.quantity, 0);

  const value = useMemo(() => ({
    cart, addToCart, removeFromCart, updateQuantity, clearCart,
    favorites, toggleFavorite,
    user, setUser, orders, setOrders, total, count
  }), [cart, favorites, user, orders, total, count]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);