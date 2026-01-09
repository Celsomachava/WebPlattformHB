import { useState, useEffect } from 'react';

const TOKEN_KEY = 'heduschka_auth_token';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = () => {
    try {
      const storedToken = getSecureToken();
      if (storedToken && validateTokenFormat(storedToken)) {
        const userData = parseToken(storedToken);
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = (inputToken) => {
    try {
      if (!validateTokenFormat(inputToken)) {
        return false;
      }

      const userData = parseToken(inputToken);
      
      if (!userData.kunden_id || !userData.role) {
        return false;
      }

      setSecureToken(inputToken);
      setToken(inputToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isCustomer = () => {
    return user?.role === 'kunde';
  };

  // Security helpers
  const validateTokenFormat = (token) => {
    return token && (token.startsWith('KUNDE_') || token.startsWith('ADMIN_'));
  };

  const parseToken = (token) => {
    const [role, id] = token.split('_');
    return {
      kunden_id: token,
      role: role.toLowerCase() === 'admin' ? 'admin' : 'kunde',
      id: id
    };
  };

  const setSecureToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(`${TOKEN_KEY}_session`, Date.now().toString());
  };

  const getSecureToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const session = sessionStorage.getItem(`${TOKEN_KEY}_session`);
    
    // Check session timeout (24 hours)
    if (session && Date.now() - parseInt(session) > 24 * 60 * 60 * 1000) {
      clearAuth();
      return null;
    }
    
    return token;
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(`${TOKEN_KEY}_session`);
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  return {
    token,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin,
    isCustomer,
    getAuthHeaders
  };
};