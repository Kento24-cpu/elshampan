import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEYS = {
  token: "@elshampan/token",
  cart: "@elshampan/cart",
  favorites: "@elshampan/favorites"
};

// Every call swallows its error on purpose: a device with no storage available
// should still let the app work, it just will not remember anything.
export const storage = {
  read: async (key) => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  write: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignored
    }
  },
  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignored
    }
  }
};
