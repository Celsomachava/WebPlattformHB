import React, { useState, useEffect } from 'react';

const TopBar = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ' | ' + date.toLocaleTimeString('de-DE');
  };

  return (
    <div style={{
      background: '#007bff',
      color: 'white',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        margin: 0 
      }}>
        Heduschka Service
      </h1>
      
      <div style={{ fontSize: '14px', opacity: 0.9 }}>
        {formatDateTime(currentTime)}
      </div>
      
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.1)',
            transition: 'background 0.2s'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {user?.kunden_id?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              {user?.kunden_id}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {user?.role === 'admin' ? 'Administrator' : 'Kunde'}
            </div>
          </div>
          <span style={{ fontSize: '12px' }}>▼</span>
        </div>
        
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            color: '#333',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
              <div style={{ fontWeight: '500' }}>{user?.kunden_id}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {user?.role === 'admin' ? 'Administrator' : 'Kunde'}
              </div>
            </div>
            <button
              onClick={() => {
                setShowDropdown(false);
                onLogout();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#dc3545',
                fontSize: '14px'
              }}
            >
              Abmelden
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;