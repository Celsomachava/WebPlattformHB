const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

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
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Auth
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
  },

  async validateToken(token) {
    return this.request('/auth/validate', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },

  // Service Requests
  async getServiceRequests() {
    return this.request('/serviceanfragen');
  },

  async createServiceRequest(data) {
    return this.request('/serviceanfragen', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async syncServiceRequests(requests) {
    return this.request('/serviceanfragen/sync', {
      method: 'POST',
      body: JSON.stringify({ requests })
    });
  },

  async updateServiceRequestStatus(id, status) {
    return this.request(`/serviceanfragen/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Customers
  async getCustomerProfile() {
    return this.request('/customer/me');
  },

  async getCustomers() {
    return this.request('/customer');
  },

  async createCustomer(data) {
    return this.request('/customer', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateCustomer(kundennummer, data) {
    return this.request(`/customer/${kundennummer}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteCustomer(kundennummer) {
    return this.request(`/customer/${kundennummer}`, {
      method: 'DELETE'
    });
  },

  // Anlagen
  async getAnlagen() {
    return this.request('/anlagen');
  },

  async getAnlageByQR(qrCode) {
    return this.request(`/anlagen/qr/${qrCode}`);
  }
};