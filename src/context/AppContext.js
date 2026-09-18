import React, { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const register = async (body) => {
    const data = await authApi.register(body);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrders([]);
  };

  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const count = cart.reduce((sum, x) => sum + x.quantity, 0);

  const value = useMemo(() => ({
    cart, addToCart, removeFromCart, updateQuantity, clearCart,
    favorites, toggleFavorite,
    user, setUser, orders, setOrders, total, count,
    token, login, register, logout
  }), [cart, favorites, user, token, orders, total, count]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
