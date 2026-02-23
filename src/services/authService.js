import { apiService } from './api.js';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('heduschka_token');
    this.user = null;
  }

  async login(userId, password) {
    try {
      const response = await apiService.login(userId, password);
      this.token = response.token;
      this.user = response.user;
      localStorage.setItem('heduschka_token', response.token);
      localStorage.setItem('heduschka_user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async validateToken() {
    try {
      if (!this.token) return { valid: false };
      const response = await apiService.validateToken(this.token);
      if (response.valid) {
        this.user = response.user;
        localStorage.setItem('heduschka_user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Token validation failed:', error);
      return { valid: false };
    }
  }

  async getCurrentUser() {
    try {
      if (!this.token) return null;
      const user = await apiService.getCurrentUser();
      this.user = user;
      localStorage.setItem('heduschka_user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  getToken() {
    return this.token || localStorage.getItem('heduschka_token');
  }

  getUser() {
    if (this.user) return this.user;
    const stored = localStorage.getItem('heduschka_user');
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getUserRole() {
    const user = this.getUser();
    return user?.role || 'customer';
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('heduschka_token');
    localStorage.removeItem('heduschka_user');
  }
}

export const authService = new AuthService();