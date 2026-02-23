import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = user?.role === 'admin';

  const adminMenuItems = [
    { 
      section: 'MAIN',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/service-requests', label: 'Serviceanfragen', icon: '🔧' },
        { path: '/admin/offers', label: 'Angebote', icon: '📋' },
        { path: '/admin/invoices', label: 'Rechnungen', icon: '💰' }
      ]
    },
    {
      section: 'VERWALTUNG',
      items: [
        { path: '/admin/customers', label: 'Kundenverwaltung', icon: '👥' },
        { path: '/admin/anlagen', label: 'Anlagen', icon: '🏭' },
        { path: '/admin/datev', label: 'DATEV Export', icon: '📤' }
      ]
    },
    {
      section: 'FORMULARE',
      items: [
        { path: '/admin/forms/arbeitsauftrag', label: 'Arbeitsauftrag', icon: '📝' },
        { path: '/admin/forms/wochenplan', label: 'Wochenplan', icon: '📅' },
        { path: '/admin/forms/pruefprotokoll', label: 'Prüfprotokoll', icon: '✓' },
        { path: '/admin/forms/gefaehrdung', label: 'Gefährdungsbeurteilung', icon: '⚠️' }
      ]
    }
  ];

  const customerMenuItems = [
    {
      section: 'MAIN',
      items: [
        { path: '/customer/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/customer/overview', label: 'Portal-Übersicht', icon: '🏠' },
        { path: '/customer/service-new', label: 'Neue Serviceanfrage', icon: '➕' }
      ]
    },
    {
      section: 'DOKUMENTE',
      items: [
        { path: '/customer/offers', label: 'Angebote', icon: '📋' },
        { path: '/customer/invoices', label: 'Rechnungen', icon: '💰' }
      ]
    }
  ];

  const menuSections = isAdmin ? adminMenuItems : customerMenuItems;

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
        width: isCollapsed ? '70px' : '260px',
        height: '100vh',
        background: 'linear-gradient(180deg, #1a1d29 0%, #0f1117 100%)',
        color: '#e4e7eb',
        position: 'fixed',
        left: 0,
        top: '60px',
        zIndex: 999,
        transition: 'width 0.3s ease',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ padding: '20px 0' }}>
          <div style={{
            padding: '0 20px 20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            textAlign: isCollapsed ? 'center' : 'left',
            marginBottom: '10px'
          }}>
            {!isCollapsed && (
              <>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>HEDUSCHKA</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#8b92a7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {isAdmin ? 'Admin Panel' : 'Kundenportal'}
                </p>
              </>
            )}
            {isCollapsed && (
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>H</div>
            )}
          </div>

          <nav>
            {menuSections.map((section, sectionIdx) => (
              <div key={sectionIdx} style={{ marginBottom: '25px' }}>
                {!isCollapsed && (
                  <div style={{
                    padding: '8px 20px',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    marginBottom: '5px'
                  }}>
                    {section.section}
                  </div>
                )}
                {section.items.map(item => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: isCollapsed ? '14px 0' : '12px 20px',
                        color: isActive ? '#fff' : '#9ca3af',
                        textDecoration: 'none',
                        background: isActive ? 'linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)' : 'transparent',
                        borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                        transition: 'all 0.2s ease',
                        fontSize: '13px',
                        fontWeight: isActive ? '600' : '500',
                        position: 'relative',
                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.color = '#e4e7eb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#9ca3af';
                        }
                      }}
                    >
                      <span style={{ 
                        marginRight: isCollapsed ? '0' : '14px', 
                        fontSize: '18px',
                        minWidth: '24px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <span style={{
                          marginLeft: 'auto',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#3b82f6'
                        }} />
                      )}
                    </Link>
                  );
                })}
              </div>
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