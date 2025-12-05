const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const auth = {
  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  register: (username, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
};

export const todos = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/todos${query ? `?${query}` : ""}`);
  },
  get: (id) => request(`/todos/${id}`),
  create: (data) =>
    request("/todos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/todos/${id}`, {
      method: "DELETE",
    }),
  addCategory: (id, categoryId) =>
    request(`/todos/${id}/categories`, {
      method: "POST",
      body: JSON.stringify({ categoryId }),
    }),
  deleteCategory: (id, categoryId) =>
    request(`/todos/${id}/categories/${categoryId}`, {
      method: "DELETE",
    }),
  getCategories: (id) => request(`/todos/${id}/categories`),
};

export const categories = {
  getAll: () => request("/categories"),
  get: (id) => request(`/categories/${id}`),
  create: (data) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),
  update: (id, data) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
