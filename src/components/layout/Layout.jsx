import React from 'react';

const Layout = ({ children, onLogout, userRole }) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container">
          <h1 className="logo">Heduschka Service</h1>
          {onLogout && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                {userRole === 'admin' ? 'Administrator' : 'Kunde'}
              </span>
              <button 
                onClick={onLogout}
                style={{
                  padding: '6px 12px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Abmelden
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="app-main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Heduschka GmbH</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;