class AuthService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Get current token
  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Simple token validation (customer user)
  async validateToken(token) {
    try {
      // In real implementation, this would call the backend
      // For MVP, we'll use a simple validation
      if (token && token.startsWith('KUNDE_')) {
        this.setToken(token);
        return { valid: true, role: 'customer' };
      }
      if (token && token.startsWith('ADMIN_')) {
        this.setToken(token);
        return { valid: true, role: 'admin' };
      }
      return { valid: false };
    } catch (error) {
      console.error('Token validation failed:', error);
      return { valid: false };
    }
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Get user role from token
  getUserRole() {
    const token = this.getToken();
    if (!token) return null;
    
    if (token.startsWith('ADMIN_')) return 'admin';
    if (token.startsWith('KUNDE_')) return 'customer';
    return 'customer'; // default
  }
}

export const authService = new AuthService();