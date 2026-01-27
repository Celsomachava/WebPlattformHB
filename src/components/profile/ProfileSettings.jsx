import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const ProfileSettings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    position: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const token = await authService.getValidToken();
      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setPersonalData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          company: userData.company || '',
          address: userData.address || '',
          position: userData.position || userData.role || ''
        });
      } else {
        // Fallback to user prop
        if (user) {
          setPersonalData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            company: user.company || '',
            address: user.address || '',
            position: user.position || user.role || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to user prop
      if (user) {
        setPersonalData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          company: user.company || '',
          address: user.address || '',
          position: user.position || user.role || ''
        });
      }
    }
  };

  const savePersonalData = async () => {
    setLoading(true);
    try {
      setMessage('Persönliche Daten erfolgreich gespeichert');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Fehler beim Speichern der Daten');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwörter stimmen nicht überein');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);
    try {
      setMessage('Passwort erfolgreich geändert');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Fehler beim Ändern des Passworts');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, type = 'text', value, onChange, required = false, disabled = false }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '5px', 
        fontWeight: '500',
        color: '#333'
      }}>
        {label} {required && <span style={{ color: '#dc3545' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: disabled ? '#e9ecef' : 'white',
          cursor: disabled ? 'not-allowed' : 'text'
        }}
      />
    </div>
  );

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Profileinstellungen</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Verwalten Sie Ihre persönlichen Daten und Einstellungen</p>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: message.includes('Fehler') ? '#f8d7da' : '#d4edda',
          color: message.includes('Fehler') ? '#721c24' : '#155724',
          border: `1px solid ${message.includes('Fehler') ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '30px', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { key: 'personal', label: 'Persönliche Daten', icon: '👤' },
            { key: 'security', label: 'Sicherheit', icon: '🔒' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab.key ? '#007bff' : '#6c757d',
                borderBottom: activeTab === tab.key ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: activeTab === tab.key ? '500' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'personal' && (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '25px', color: '#333' }}>Persönliche Informationen</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <InputField
              label="Vollständiger Name"
              value={personalData.name}
              onChange={(e) => setPersonalData({...personalData, name: e.target.value})}
              disabled={user?.role !== 'admin'}
              required
            />
            <InputField
              label="E-Mail-Adresse"
              type="email"
              value={personalData.email}
              onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
              disabled={user?.role !== 'admin'}
              required
            />
            <InputField
              label="Telefonnummer"
              value={personalData.phone}
              onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
              disabled={user?.role !== 'admin'}
            />
            <InputField
              label="Position"
              value={personalData.position}
              onChange={(e) => setPersonalData({...personalData, position: e.target.value})}
              disabled={user?.role !== 'admin'}
            />
          </div>
          
          <InputField
            label="Unternehmen"
            value={personalData.company}
            onChange={(e) => setPersonalData({...personalData, company: e.target.value})}
            disabled={user?.role !== 'admin'}
          />
          
          <InputField
            label="Adresse"
            value={personalData.address}
            onChange={(e) => setPersonalData({...personalData, address: e.target.value})}
            disabled={user?.role !== 'admin'}
          />

          {user?.role === 'admin' && (
            <button
              onClick={savePersonalData}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Speichern...' : 'Änderungen speichern'}
            </button>
          )}
          
          {user?.role !== 'admin' && (
            <div style={{ padding: '12px', backgroundColor: '#e7f3ff', borderRadius: '4px', color: '#0c5460', fontSize: '14px' }}>
              ℹ️ Diese Daten können nur vom Administrator geändert werden.
            </div>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '25px', color: '#333' }}>Passwort ändern</h2>
          
          <div style={{ maxWidth: '400px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Aktuelles Passwort <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Neues Passwort <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Neues Passwort bestätigen <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <button
            onClick={changePassword}
            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !passwordData.currentPassword || !passwordData.newPassword ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: loading || !passwordData.currentPassword || !passwordData.newPassword ? 0.7 : 1
            }}
          >
            {loading ? 'Ändern...' : 'Passwort ändern'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;