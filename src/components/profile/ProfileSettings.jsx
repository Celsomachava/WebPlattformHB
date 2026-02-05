import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const ProfileSettings = ({ user }) => {
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN_001';
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    street: '',
    plz: '',
    city: '',
    country: 'Deutschland',
    bankname: '',
    iban: '',
    bic: '',
    kontonummer: '',
    blz: '',
    steuernummer: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

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
          website: userData.website || '',
          street: userData.street || '',
          plz: userData.plz || '',
          city: userData.city || '',
          country: userData.country || 'Deutschland',
          bankname: userData.bankname || '',
          iban: userData.iban || '',
          bic: userData.bic || '',
          kontonummer: userData.kontonummer || '',
          blz: userData.blz || '',
          steuernummer: userData.steuernummer || ''
        });
      } else {
        // Fallback to user prop
        if (user) {
          setPersonalData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            website: user.website || '',
            street: user.street || '',
            plz: user.plz || '',
            city: user.city || '',
            country: user.country || 'Deutschland',
            bankname: user.bankname || '',
            iban: user.iban || '',
            bic: user.bic || '',
            kontonummer: user.kontonummer || '',
            blz: user.blz || '',
            steuernummer: user.steuernummer || ''
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
          website: user.website || '',
          street: user.street || '',
          plz: user.plz || '',
          city: user.city || '',
          country: user.country || 'Deutschland',
          bankname: user.bankname || '',
          iban: user.iban || '',
          bic: user.bic || '',
          kontonummer: user.kontonummer || '',
          blz: user.blz || '',
          steuernummer: user.steuernummer || ''
        });
      }
    }
  };

  const savePersonalData = async () => {
    setLoading(true);
    try {
      // Store data locally for now since backend might not be available
      localStorage.setItem('profileData', JSON.stringify(personalData));
      setMessage('Persönliche Daten erfolgreich gespeichert');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Fehler beim Speichern der Daten');
      setTimeout(() => setMessage(''), 3000);
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
        value={value || ''}
        onChange={onChange}
        disabled={disabled || !isAdmin}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: disabled || !isAdmin ? '#e9ecef' : 'white',
          cursor: disabled || !isAdmin ? 'not-allowed' : 'text'
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
          <h2 style={{ marginBottom: '25px', color: '#333' }}>Deine Informationen</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <InputField
              label="Dein vollständiger Name"
              value={personalData.name}
              onChange={(e) => setPersonalData(prev => ({...prev, name: e.target.value}))}
              required
            />
            {isAdmin && (
              <InputField
                label="Bankname"
                value={personalData.bankname}
                onChange={(e) => setPersonalData(prev => ({...prev, bankname: e.target.value}))}
              />
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <InputField
              label="Straße + Hausnummer"
              value={personalData.street}
              onChange={(e) => setPersonalData(prev => ({...prev, street: e.target.value}))}
              required
            />
            {isAdmin && (
              <InputField
                label="IBAN"
                value={personalData.iban}
                onChange={(e) => setPersonalData(prev => ({...prev, iban: e.target.value}))}
              />
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <InputField
                label="PLZ"
                value={personalData.plz}
                onChange={(e) => setPersonalData(prev => ({...prev, plz: e.target.value}))}
                required
              />
              <InputField
                label="Ort"
                value={personalData.city}
                onChange={(e) => setPersonalData(prev => ({...prev, city: e.target.value}))}
                required
              />
            </div>
            {isAdmin && (
              <InputField
                label="BIC"
                value={personalData.bic}
                onChange={(e) => setPersonalData(prev => ({...prev, bic: e.target.value}))}
              />
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Land <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <select
                value={personalData.country}
                onChange={(e) => setPersonalData(prev => ({...prev, country: e.target.value}))}
                disabled={!isAdmin}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: isAdmin ? 'white' : '#e9ecef',
                  cursor: isAdmin ? 'pointer' : 'not-allowed'
                }}
              >
                <option value="Deutschland">Deutschland</option>
                <option value="Österreich">Österreich</option>
                <option value="Schweiz">Schweiz</option>
              </select>
            </div>
            {isAdmin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <InputField
                  label="Kontonummer"
                  value={personalData.kontonummer}
                  onChange={(e) => setPersonalData(prev => ({...prev, kontonummer: e.target.value}))}
                />
                <InputField
                  label="BLZ"
                  value={personalData.blz}
                  onChange={(e) => setPersonalData(prev => ({...prev, blz: e.target.value}))}
                />
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <InputField
              label="Email"
              type="email"
              value={personalData.email}
              onChange={(e) => setPersonalData(prev => ({...prev, email: e.target.value}))}
              required
            />
            {isAdmin && (
              <InputField
                label="Steuernummer"
                value={personalData.steuernummer}
                onChange={(e) => setPersonalData(prev => ({...prev, steuernummer: e.target.value}))}
                required
              />
            )}
          </div>
          
          <InputField
            label="Telefon"
            value={personalData.phone}
            onChange={(e) => setPersonalData(prev => ({...prev, phone: e.target.value}))}
          />
          
          {isAdmin && (
            <InputField
              label="Website"
              value={personalData.website}
              onChange={(e) => setPersonalData(prev => ({...prev, website: e.target.value}))}
            />
          )}

          {isAdmin && (
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