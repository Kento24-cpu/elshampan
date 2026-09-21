import { Platform } from "react-native";

const DEFAULT_API_URL = Platform.OS === "web"
  ? "http://localhost:3000/api"
  : "http://10.0.2.2:3000/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;

export { API_URL };

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  return entries.length === 0
    ? ""
    : `?${entries.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`;
};

const networkError = () => {
  const error = new Error("No pudimos contactar el servidor.");
  error.status = 0;
  return error;
};

export async function apiFetch(path, options = {}) {
  const { token, ...rest } = options;

  let response;

  // `fetch` rejects with an English driver message before any status exists, so
  // it is translated here instead of leaking "Network request failed" to the UI.
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(rest.headers || {})
      }
    });
  } catch {
    throw networkError();
  }

  const data = response.status === 204
    ? {}
    : await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Error del servidor");
    error.status = response.status;
    throw error;
  }

  return data;
}

export const authApi = {
  login: (body) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  logout: (token) => apiFetch("/auth/logout", { method: "POST", token }),
  me: (token) => apiFetch("/auth/me", { token }),
  updateMe: (body, token) => apiFetch("/auth/me", { method: "PATCH", body: JSON.stringify(body), token })
};

export const categoryApi = {
  list: () => apiFetch("/categories")
};

export const productApi = {
  list: (params) => apiFetch(`/products${buildQuery(params)}`),
  byId: (id) => apiFetch(`/products/${id}`)
};

export const orderApi = {
  create: (body, token) => apiFetch("/orders", { method: "POST", body: JSON.stringify(body), token }),
  list: (token, params) => apiFetch(`/orders${buildQuery(params)}`, { token }),
  byId: (id, token) => apiFetch(`/orders/${id}`, { token })
};

// Never throws: the callers use it to tell "the API is down" apart from
// "the API answered 503 because the database is down".
export const healthApi = {
  probe: async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json().catch(() => ({}));

      return { reachable: true, dbUp: response.ok && data.db === "up" };
    } catch {
      return { reachable: false, dbUp: false };
    }
  }
};
