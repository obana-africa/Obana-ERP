const API_BASE = '/api/storefront';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

export const storefrontApi = {
  // Theme management
  async saveTheme(theme) {
    const response = await fetch(`${API_BASE}/theme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme })
    });
    return handleResponse(response);
  },

  async getTheme() {
    const response = await fetch(`${API_BASE}/theme`);
    return handleResponse(response);
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/products?${query}`);
    return handleResponse(response);
  },

  // Publish
  async publish() {
    const response = await fetch(`${API_BASE}/publish`, { method: 'POST' });
    return handleResponse(response);
  },

  // Templates
  async getTemplates() {
    const response = await fetch(`${API_BASE}/templates`);
    return handleResponse(response);
  }
};