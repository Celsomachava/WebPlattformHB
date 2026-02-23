// Database-only Auth Service
import { apiService } from './api.js';

let tokenValidationCache = null;
let tokenValidationPromise = null;
const CACHE_DURATION = 60000; // 1 minute

export const authService = {
  async getCurrentUser() {
    const token = localStorage.getItem('heduschka_token');
    if (!token) return null;
    
    try {
      return await apiService.getCurrentUser();
    } catch (error) {
      console.error('Failed to get current user:', error);
      localStorage.removeItem('heduschka_token');
      return null;
    }
  },

  async login(customerId, password) {
    try {
      const result = await apiService.login(customerId, password);
      localStorage.setItem('heduschka_token', result.token);
      tokenValidationCache = { token: result.token, timestamp: Date.now() };
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  },

  async logout() {
    localStorage.removeItem('heduschka_token');
    tokenValidationCache = null;
    tokenValidationPromise = null;
  },

  async getValidToken() {
    const token = localStorage.getItem('heduschka_token');
    if (!token) throw new Error('No token available');
    
    // Return cached token if still valid
    if (tokenValidationCache && 
        tokenValidationCache.token === token && 
        Date.now() - tokenValidationCache.timestamp < CACHE_DURATION) {
      return token;
    }
    
    // Reuse pending validation promise to prevent duplicate requests
    if (tokenValidationPromise) {
      await tokenValidationPromise;
      return token;
    }
    
    tokenValidationPromise = (async () => {
      try {
        await apiService.validateToken(token);
        tokenValidationCache = { token, timestamp: Date.now() };
      } catch (error) {
        localStorage.removeItem('heduschka_token');
        tokenValidationCache = null;
        throw new Error('Invalid token');
      } finally {
        tokenValidationPromise = null;
      }
    })();
    
    await tokenValidationPromise;
    return token;
  }
};