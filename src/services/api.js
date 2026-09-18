const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000/api";

export { API_URL };

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(data.message || "Error del servidor");

  return data;
}

export const authApi = {
  login: (body) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) })
};

export const productApi = {
  list: () => apiFetch("/products"),
  byId: (id) => apiFetch(`/products/${id}`)
};

export const orderApi = {
  create: (body, token) => apiFetch("/orders", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }),
  list: (token) => apiFetch("/orders", { headers: { Authorization: `Bearer ${token}` } })
};
