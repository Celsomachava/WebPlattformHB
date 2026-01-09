import React, { useState } from 'react';
import { authService } from '../../services/authService';

const Login = ({ onLogin }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.validateToken(token);
      if (result.valid) {
        onLogin(result.role);
      } else {
        setError('Ungültiger Token');
      }
    } catch (err) {
      setError('Anmeldung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f8f9fa'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Heduschka Service
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Zugangs-Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="KUNDE_xxx oder ADMIN_xxx"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: '100%',
              padding: '12px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !token ? 0.6 : 1
            }}
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6c757d'
        }}>
          <strong>Demo-Tokens:</strong><br />
          Kunde: KUNDE_001<br />
          Admin: ADMIN_001
        </div>
      </div>
    </div>
  );
};

export default Login;