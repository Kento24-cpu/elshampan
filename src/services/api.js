const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000/api";

export { API_URL };

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  return entries.length === 0
    ? ""
    : `?${entries.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`;
};

export async function apiFetch(path, options = {}) {
  const { token, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

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
