import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sanitizeInput } from '../../utils/security';

const SecureLogin = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const sanitizedToken = sanitizeInput(token);
      const result = await login(sanitizedToken);
      
      if (!result.success) {
        setError(result.error || 'Anmeldung fehlgeschlagen');
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
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1>🔒 Heduschka Service</h1>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Sichere Anmeldung erforderlich
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500' 
            }}>
              Zugangs-Token *
            </label>
            <input
              type="password"
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
              autoComplete="off"
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              marginBottom: '20px',
              fontSize: '14px',
              padding: '8px',
              background: '#f8d7da',
              borderRadius: '4px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Anmelden...' : '🔐 Sicher anmelden'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#e7f3ff',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#0c5460'
        }}>
          <strong>🛡️ Sicherheitshinweise:</strong><br />
          • HTTPS-Verschlüsselung aktiv<br />
          • Token werden sicher gespeichert<br />
          • DSGVO-konform<br /><br />
          <strong>Demo-Tokens:</strong><br />
          Kunde: KUNDE_001<br />
          Admin: ADMIN_001
        </div>
      </div>
    </div>
  );
};

export default SecureLogin;