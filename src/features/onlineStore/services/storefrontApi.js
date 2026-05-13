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
     // For now, save to localStorage
    localStorage.setItem('obana_theme', JSON.stringify(theme));
    return { success: true };

    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE}/theme`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ theme })
    // });
    // return handleResponse(response);
  },

  async getTheme() {
       // For now, load from localStorage
    const saved = localStorage.getItem('obana_theme');
    return saved ? JSON.parse(saved) : null;


    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE}/theme`);
    // return handleResponse(response);
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/products?${query}`);
    return handleResponse(response);
  },

  // Publish
  async publish() {
     localStorage.setItem('obana_published', 'true');
    return { success: true };

    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE}/publish`, { method: 'POST' });
    // return handleResponse(response);
  },

  // Templates
  async getTemplates() {
    const response = await fetch(`${API_BASE}/templates`);
    return handleResponse(response);
  }
};