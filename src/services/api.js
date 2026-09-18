// Capa preparada para el backend.

export const API_URL = "http://TU-IP:3000/api";

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