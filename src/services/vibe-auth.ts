// VIBE Architecture - Authentication Service

import { User, Role, AuthTokens } from '../models/vibe-types';
import { offlineDB } from './vibe-storage';

class AuthService {
  private currentUser: User | null = null;
  private tokens: AuthTokens | null = null;

  async login(customerId: string): Promise<AuthTokens> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000)
      };

      this.currentUser = data.user;
      await this.storeTokensSecurely(this.tokens);
      await this.storeUserSession(this.currentUser);
      
      return this.tokens;
    } catch (error) {
      // Offline fallback - check stored session
      return this.validateOfflineSession(customerId);
    }
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.tokens.refreshToken}` }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { access_token, expires_in } = await response.json();
      
      this.tokens.accessToken = access_token;
      this.tokens.expiresAt = Date.now() + (expires_in * 1000);
      
      await this.updateStoredAccessToken(access_token);
      return access_token;
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.tokens?.accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.tokens.accessToken}` }
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      await this.clearStoredTokens();
      this.currentUser = null;
      this.tokens = null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from storage
    const storedUser = await offlineDB.get('user_sessions', 'current');
    if (storedUser && storedUser.expires_at > Date.now()) {
      this.currentUser = storedUser.user;
      return this.currentUser;
    }

    return null;
  }

  async getValidToken(): Promise<string | null> {
    if (!this.tokens) {
      await this.restoreTokensFromStorage();
    }

    if (!this.tokens) {
      return null;
    }

    // Check if token is expired
    if (Date.now() >= this.tokens.expiresAt - 60000) { // Refresh 1 minute before expiry
      try {
        await this.refreshAccessToken();
      } catch (error) {
        return null;
      }
    }

    return this.tokens.accessToken;
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;

    const rolePermissions = {
      [Role.ADMIN]: ['read_all_data', 'manage_users', 'export_datev', 'read_own_data', 'write_own_data'],
      [Role.CUSTOMER]: ['read_own_data', 'write_own_data'],
      [Role.TECHNICIAN]: ['read_own_data', 'write_own_data']
    };

    return rolePermissions[this.currentUser.role]?.includes(permission) || false;
  }

  canAccessCustomerData(requestedCustomerId: string): boolean {
    if (!this.currentUser) return false;

    // Admins can access all data
    if (this.currentUser.role === Role.ADMIN) {
      return true;
    }

    // Customers can only access their own data
    return this.currentUser.customer_id === requestedCustomerId;
  }

  private async validateOfflineSession(customerId: string): Promise<AuthTokens> {
    const session = await offlineDB.get('user_sessions', customerId);
    
    if (!session || Date.now() > session.expires_at) {
      throw new Error('No valid offline session');
    }

    this.currentUser = session.user;
    this.tokens = session.tokens;
    
    return this.tokens;
  }

  private async storeTokensSecurely(tokens: AuthTokens): Promise<void> {
    // In a real implementation, this would use secure storage
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }

  private async storeUserSession(user: User): Promise<void> {
    const session = {
      user_id: user.id,
      user,
      tokens: this.tokens,
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    await offlineDB.put('user_sessions', session);
  }

  private async updateStoredAccessToken(accessToken: string): Promise<void> {
    if (this.tokens) {
      this.tokens.accessToken = accessToken;
      await this.storeTokensSecurely(this.tokens);
    }
  }

  private async restoreTokensFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem('auth_tokens');
      if (stored) {
        this.tokens = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to restore tokens:', error);
    }
  }

  private async clearStoredTokens(): Promise<void> {
    localStorage.removeItem('auth_tokens');
    
    if (this.currentUser) {
      await offlineDB.delete('user_sessions', this.currentUser.id);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();