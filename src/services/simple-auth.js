// Simple Auth Service Fallback
export const authService = {
  async getCurrentUser() {
    // Simple fallback for demo
    const token = localStorage.getItem('heduschka_token');
    if (token && (token.startsWith('KUNDE_') || token.startsWith('ADMIN_'))) {
      const [role, id] = token.split('_');
      return {
        id: token,
        customer_id: token,
        role: role === 'ADMIN' ? 'ADMIN_001' : 'KUNDE_XXX',
        name: role === 'ADMIN' ? 'Administrator' : 'Kunde',
        email: 'demo@heduschka.com',
        created_at: Date.now()
      };
    }
    return null;
  },

  async login(customerId) {
    if (customerId && (customerId.startsWith('KUNDE_') || customerId.startsWith('ADMIN_'))) {
      localStorage.setItem('heduschka_token', customerId);
      return {
        accessToken: 'demo-token',
        refreshToken: 'demo-refresh',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };
    }
    throw new Error('Invalid credentials');
  },

  async logout() {
    localStorage.removeItem('heduschka_token');
  },

  async getValidToken() {
    return 'demo-token';
  }
};