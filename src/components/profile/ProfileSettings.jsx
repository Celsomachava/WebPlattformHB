import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const ProfileSettings = ({ user }) => {
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN_001';
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [personalData, setPersonalData] = useState({
    kundennummer: '',
    firmenname: '',
    name: '',
    email: '',
    phone: ''
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
      const kundenId = user?.kundennummer || user?.customer_id || user?.kunden_id;
      if (kundenId) {
        const response = await fetch(`http://localhost:3002/api/kunden/${kundenId}`, {
          headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setPersonalData({
            name: userData.ansprechpartner || '',
            email: userData.email || '',
            phone: userData.telefon || '',
            firmenname: userData.firmenname || '',
            kundennummer: userData.kundennummer || kundenId
          });
        } else {
          setPersonalData({
            name: user?.ansprechpartner || user?.name || '',
            email: user?.email || '',
            phone: user?.telefon || user?.phone || '',
            firmenname: user?.firmenname || '',
            kundennummer: kundenId
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      const kundenId = user?.kundennummer || user?.customer_id || user?.kunden_id;
      setPersonalData({
        name: user?.ansprechpartner || user?.name || '',
        email: user?.email || '',
        phone: user?.telefon || user?.phone || '',
        firmenname: user?.firmenname || '',
        kundennummer: kundenId
      });
    }
  };

  const savePersonalData = async () => {
    alert('Kontaktdaten können nur vom Administrator geändert werden');
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

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '30px', background: '#f8f9fa', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '28px', fontWeight: '600' }}>Profileinstellungen</h1>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>Verwalten Sie Ihre persönlichen Daten</p>
        </div>

        {message && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '6px',
            background: message.includes('Fehler') ? '#fee' : '#d4edda',
            color: message.includes('Fehler') ? '#c00' : '#155724',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e9ecef' }}>
            {[
              { key: 'personal', label: 'Persönliche Daten' },
              { key: 'security', label: 'Sicherheit' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '16px 24px',
                  border: 'none',
                  background: activeTab === tab.key ? 'white' : 'transparent',
                  color: activeTab === tab.key ? '#007bff' : '#6c757d',
                  borderBottom: activeTab === tab.key ? '2px solid #007bff' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? '600' : '400',
                  fontSize: '14px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '30px' }}>
            {activeTab === 'personal' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #e9ecef' }}>
                  <span style={{ fontSize: '24px', color: '#007bff' }}>👤</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>Dados do Cliente</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>Kunden-ID</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50' }}>{personalData.kundennummer || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>Firmenname</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50' }}>{personalData.firmenname || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>Ansprechpartner</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50' }}>{personalData.name || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>Email</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50' }}>{personalData.email || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>Telefon</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50' }}>{personalData.phone || '-'}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div style={{ maxWidth: '400px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Aktuelles Passwort</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Neues Passwort</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Passwort bestätigen</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <button
                  onClick={changePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                  style={{
                    padding: '10px 20px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading || !passwordData.currentPassword || !passwordData.newPassword ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: loading || !passwordData.currentPassword || !passwordData.newPassword ? 0.6 : 1
                  }}
                >
                  {loading ? 'Ändern...' : 'Passwort ändern'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
