const API_BASE = 'http://localhost:3001/api';

export const apiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('heduschka_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Auth endpoints
  async login(userId, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId, password })
    });
  },

  async getCurrentUser() {
    return this.request('/auth/me');
  },

  async validateToken(token) {
    return this.request('/auth/validate', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }
};