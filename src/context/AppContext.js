import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";
import { KEYS, storage } from "../services/storage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [orders, setOrders] = useState([]);
  // Screens read this so they do not paint the signed out state before the
  // stored session has been read back.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const [storedToken, storedCart, storedFavorites] = await Promise.all([
        storage.read(KEYS.token),
        storage.read(KEYS.cart),
        storage.read(KEYS.favorites)
      ]);

      if (!active) return;

      if (Array.isArray(storedCart)) setCart(storedCart);
      if (Array.isArray(storedFavorites)) setFavorites(storedFavorites);
      if (storedToken) setToken(storedToken);

      setHydrated(true);

      if (!storedToken) return;

      try {
        const profile = await authApi.me(storedToken);
        if (active) setUser(profile);
      } catch (error) {
        // A revoked or expired token is dropped silently instead of leaving the
        // app in a signed in looking state that fails on every request.
        if (active && error.status === 401) {
          setToken(null);
          storage.remove(KEYS.token);
        }
      }
    };

    hydrate();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) storage.write(KEYS.cart, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) storage.write(KEYS.favorites, favorites);
  }, [favorites, hydrated]);

  const addToCart = (product) => setCart((prev) => {
    const found = prev.find((x) => x.id === product.id);
    if (found) return prev.map((x) => x.id === product.id ? { ...x, quantity: Math.min(x.quantity + 1, product.stock) } : x);
    return [...prev, { ...product, quantity: 1 }];
  });

  const removeFromCart = (id) => setCart((prev) => prev.filter((x) => x.id !== id));
  const updateQuantity = (id, quantity) => setCart((prev) => prev.map((x) => x.id === id ? { ...x, quantity: Math.max(1, Math.min(quantity, x.stock)) } : x));
  const clearCart = () => setCart([]);

  const toggleFavorite = (id) => setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const startSession = (data) => {
    setUser(data.user);
    setToken(data.token);
    storage.write(KEYS.token, data.token);
    return data.user;
  };

  const login = async (credentials) => startSession(await authApi.login(credentials));

  const register = async (body) => startSession(await authApi.register(body));

  // Revokes the session on the server too. Best effort on purpose: if the API is
  // unreachable the local state is cleared anyway, so the user is never stuck
  // signed in because of a network problem.
  const logout = useCallback(async () => {
    try {
      if (token) await authApi.logout(token);
    } catch {
      // ignored
    }

    setUser(null);
    setToken(null);
    setOrders([]);
    storage.remove(KEYS.token);
  }, [token]);

  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const count = cart.reduce((sum, x) => sum + x.quantity, 0);

  const value = useMemo(() => ({
    cart, addToCart, removeFromCart, updateQuantity, clearCart,
    favorites, toggleFavorite,
    user, setUser, orders, setOrders, total, count,
    token, login, register, logout, hydrated
  }), [cart, favorites, user, token, orders, total, count, logout, hydrated]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
