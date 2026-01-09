import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = user?.role === 'admin';

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/service-requests', label: 'Serviceanfragen verwalten', icon: '🔧' },
    { path: '/admin/offers', label: 'Angebote erstellen', icon: '📋' },
    { path: '/admin/invoices', label: 'Rechnungen verwalten', icon: '💰' },
    { path: '/admin/datev', label: 'DATEV Export', icon: '📤' }
  ];

  const customerMenuItems = [
    { path: '/customer/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/customer/overview', label: 'Portal-Übersicht', icon: '🏠' },
    { path: '/customer/service-new', label: 'Neue Serviceanfrage', icon: '➕' },
    { path: '/customer/offers', label: 'Angebote einsehen', icon: '📋' },
    { path: '/customer/invoices', label: 'Rechnungen einsehen', icon: '💰' }
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '70px',
          left: '10px',
          zIndex: 1001,
          background: '#001f3f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px',
          cursor: 'pointer',
          '@media (max-width: 768px)': {
            display: 'block'
          }
        }}
        className="mobile-hamburger"
      >
        ☰
      </button>

      <div style={{
        width: isCollapsed ? '60px' : '250px',
        height: '100vh',
        background: '#001f3f',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: '60px',
        zIndex: 999,
        transition: 'width 0.3s ease',
        overflowY: 'auto',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          padding: '20px 0'
        }}>
          <div style={{
            padding: '0 20px 20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textAlign: isCollapsed ? 'center' : 'left'
          }}>
            {!isCollapsed && (
              <>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Heduschka</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                  {isAdmin ? 'Admin Panel' : 'Kundenportal'}
                </p>
              </>
            )}
            {isCollapsed && (
              <div style={{ fontSize: '20px' }}>H</div>
            )}
          </div>

          <nav style={{ padding: '20px 0' }}>
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  color: 'white',
                  textDecoration: 'none',
                  background: location.pathname === item.path ? 'rgba(0,123,255,0.2)' : 'transparent',
                  borderLeft: location.pathname === item.path ? '3px solid #007bff' : '3px solid transparent',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ 
                  marginRight: isCollapsed ? '0' : '12px', 
                  fontSize: '16px',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;