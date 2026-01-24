// Simple Auth Service Fallback
import { apiService } from './api.js';

export const authService = {
  async getCurrentUser() {
    const token = localStorage.getItem('heduschka_token');
    if (!token) return null;
    
    try {
      return await apiService.getCurrentUser();
    } catch (error) {
      // Fallback to local storage
      if (token && (token.startsWith('KUNDE_') || token.startsWith('ADMIN_'))) {
        const [role, id] = token.split('_');
        return {
          id: token,
          customer_id: token,
          role: role === 'ADMIN' ? 'ADMIN_001' : 'KUNDE_XXX',
          name: role === 'ADMIN' ? 'Admin User' : 'Max Mustermann',
          email: role === 'ADMIN' ? 'admin@heduschka.de' : 'max.mustermann@mustermann.de',
          phone: role === 'ADMIN' ? '+49 987 654321' : '+49 123 456789',
          company: role === 'ADMIN' ? 'Heduschka GmbH' : 'Mustermann GmbH',
          address: role === 'ADMIN' ? 'Industriestraße 10, 54321 Adminstadt' : 'Musterstraße 1, 12345 Musterstadt',
          position: role === 'ADMIN' ? 'Administrator' : 'Geschäftsführer',
          created_at: Date.now()
        };
      }
      return null;
    }
  },

  async login(customerId) {
    try {
      const password = customerId === 'ADMIN_001' ? 'admin123' : 'demo123';
      const result = await apiService.login(customerId, password);
      localStorage.setItem('heduschka_token', result.token);
      return result;
    } catch (error) {
      console.error('API error, using fallback:', error);
      // Fallback
      if (customerId && (customerId.startsWith('KUNDE_') || customerId.startsWith('ADMIN_'))) {
        localStorage.setItem('heduschka_token', customerId);
        return {
          accessToken: 'demo-token',
          refreshToken: 'demo-refresh',
          expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        };
      }
      throw new Error('Invalid credentials');
    }
  },

  async logout() {
    localStorage.removeItem('heduschka_token');
  },

  async getValidToken() {
    return localStorage.getItem('heduschka_token') || 'demo-token';
  }
};