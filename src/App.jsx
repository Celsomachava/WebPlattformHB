import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import { authService } from './services/simple-auth';
import ServiceRequestForm from './components/customer/form/ServiceRequestForm';
import OfferModule from './components/admin/OfferModule';
import InvoiceModule from './components/admin/InvoiceModule';
import KundenAnlegen from './components/admin/KundenAnlegen';
import ClientManagement from './components/admin/ClientManagement';
import ServiceRequestsOverview from './components/admin/ServiceRequestsOverview';
import WochenplanList from './components/admin/WochenplanList';
import PruefprotokollList from './components/admin/PruefprotokollList';
import ArbeitsauftragList from './components/admin/ArbeitsauftragList';
import AnlageAnlegen from './components/admin/AnlageAnlegen';
import GefaehrdungsbeurteilungList from './components/admin/GefaehrdungsbeurteilungList';
import CustomerOfferView from './components/customer/CustomerOfferView';
import CustomerInvoiceView from './components/customer/CustomerInvoiceView';
import CustomerServiceRequestsList from './components/customer/CustomerServiceRequestsList';

// Working Admin Dashboard without problematic imports
const AdminDashboard = ({ user, activeTab, setActiveTab }) => {
  const [stats] = useState({
    angebote: { total: 5, offen: 2 },
    rechnungen: { total: 8, offen: 3, ueberfaellig: 1 },
    umsatz: 12500.00
  });

  const StatCard = ({ title, value, subtitle, color = '#007bff' }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px', fontWeight: '500' }}>
        {title}
      </h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color, marginBottom: '5px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px', maxWidth: 'calc(100vw - 270px)' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Admin Dashboard</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Willkommen, Administrator</p>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <StatCard 
              title="Angebote gesamt" 
              value={stats.angebote.total} 
              subtitle={`${stats.angebote.offen} offen`}
              color="#28a745"
            />
            <StatCard 
              title="Rechnungen gesamt" 
              value={stats.rechnungen.total} 
              subtitle={`${stats.rechnungen.offen} offen`}
              color="#ffc107"
            />
            <StatCard 
              title="Überfällige Rechnungen" 
              value={stats.rechnungen.ueberfaellig} 
              color="#dc3545"
            />
            <StatCard 
              title="Gesamtumsatz" 
              value={`€${stats.umsatz.toFixed(2)}`} 
              color="#007bff"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: '15px' }}>Aktuelle Angebote</h3>
              <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: '500' }}>ANG-2024-0001</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>KUNDE_001</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: '15px' }}>Offene Rechnungen</h3>
              <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: '500' }}>RE-2024-0001</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>Fällig: 2024-02-15</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Angebote Tab */}
      {activeTab === 'angebote' && (
        <OfferModule user={user} />
      )}

      {/* Rechnungen Tab */}
      {activeTab === 'rechnungen' && (
        <InvoiceModule user={user} />
      )}
      
      {/* Anfragen Tab */}
      {activeTab === 'anfragen' && (
        <ServiceRequestsOverview user={user} />
      )}
      
      {/* Kunden Anlegen Tab */}
      {activeTab === 'kunden-anlegen' && (
        <KundenAnlegen user={user} />
      )}
      
      {/* Kundenverwaltung Tab */}
      {activeTab === 'kundenverwaltung' && (
        <ClientManagement user={user} />
      )}
      
      {/* Anlage anlegen Tab */}
      {activeTab === 'anlage-anlegen' && (
        <AnlageAnlegen user={user} />
      )}
      
      {/* Wochenplan Tab */}
      {activeTab === 'wochenplan' && (
        <WochenplanList />
      )}
      
      {/* Prüfprotokoll Tab */}
      {activeTab === 'pruefprotokoll' && (
        <PruefprotokollList />
      )}
      
      {/* Arbeitsauftrag Tab */}
      {activeTab === 'arbeitsauftrag' && (
        <ArbeitsauftragList />
      )}
      
      {/* Gefährdungsbeurteilung Tab */}
      {activeTab === 'gefaehrdungsbeurteilung' && (
        <GefaehrdungsbeurteilungList />
      )}
    </div>
  );
};

// Working Customer Portal without problematic imports
const CustomerPortal = ({ user, activeTab, setActiveTab }) => {

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px', maxWidth: 'calc(100vw - 270px)' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Kundenportal</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Willkommen, {user?.customer_id || user?.kunden_id}</p>
      </div>

      {/* Content */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>{activeTab === 'overview' ? 'Übersicht' : 
             activeTab === 'service-requests' ? 'Serviceanfragen' :
             activeTab === 'anlage-anlegen' ? 'Anlage anlegen' :
             activeTab === 'angebote' ? 'Angebote' : 'Rechnungen'}</h3>
        {activeTab === 'service-requests' && (
          <div>
            <CustomerServiceRequestsList user={user} />
            <button onClick={() => {
              window.location.href = '/customer/portal/service-request';
            }} style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginTop: '20px',
              cursor: 'pointer'
            }}>
              + Neue Serviceanfrage
            </button>
          </div>
        )}
        {activeTab === 'anlage-anlegen' && (
          <AnlageAnlegen user={user} />
        )}
        {activeTab === 'angebote' && (
          <CustomerOfferView user={user} />
        )}
        {activeTab === 'rechnungen' && (
          <CustomerInvoiceView user={user} />
        )}
        {activeTab !== 'service-requests' && activeTab !== 'anlage-anlegen' && activeTab !== 'angebote' && activeTab !== 'rechnungen' && <p>Inhalte werden geladen...</p>}
      </div>
    </div>
  );
};

const TopBar = ({ user, onLogout, onShowProfile }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <div style={{
      background: '#007bff',
      color: 'white',
      padding: '12px 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, fontSize: '20px' }}>Heduschka Service</h1>
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Abmelden ({user?.role})
          <span style={{ fontSize: '12px' }}>▼</span>
        </button>
        
        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            minWidth: '200px',
            zIndex: 1001
          }}>
            <button
              onClick={() => {
                onShowProfile();
                setDropdownOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#333',
                borderBottom: '1px solid #eee'
              }}
            >
              Profil anzeigen
            </button>
            <button
              onClick={() => {
                onLogout();
                setDropdownOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#dc3545'
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

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  const isAdmin = user?.role === 'ADMIN_001';
  
  const adminMenuItems = [
    { key: 'overview', label: 'Übersicht' },
    { key: 'angebote', label: 'Angebote' },
    { key: 'rechnungen', label: 'Rechnungen' },
    { key: 'anfragen', label: 'Anfrage Übersicht' },
    { key: 'kunden-anlegen', label: 'Kunden Anlegen' },
    { key: 'kundenverwaltung', label: 'Kundenverwaltung' },
    { key: 'anlage-anlegen', label: 'Anlage anlegen' },
    { key: 'wochenplan', label: 'Wochenplan' },
    { key: 'pruefprotokoll', label: 'Prüfprotokoll DGUV' },
    { key: 'arbeitsauftrag', label: 'Arbeitsauftrag' },
    { key: 'gefaehrdungsbeurteilung', label: 'Gefährdungsbeurteilung' }
  ];
  
  const customerMenuItems = [
    { key: 'overview', label: 'Übersicht' },
    { key: 'service-requests', label: 'Serviceanfragen' },
    { key: 'anlage-anlegen', label: 'Anlage anlegen' },
    { key: 'angebote', label: 'Angebote' },
    { key: 'rechnungen', label: 'Rechnungen' }
  ];
  
  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;
  
  return (
    <div style={{
      width: '250px',
      background: '#2c3e50',
      color: 'white',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: '60px',
      padding: '20px 0'
    }}>
      <h3 style={{ padding: '0 20px', margin: '0 0 20px 0' }}>
        {isAdmin ? 'Heduschka' : 'Heduschka'}
      </h3>
      <p style={{ padding: '0 20px', margin: '0 0 20px 0', fontSize: '14px', color: '#bdc3c7' }}>
        {isAdmin ? 'Adminportal' : 'Willkommen bei Kundenportal'}
      </p>
      
      <nav>
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '12px 20px',
              color: 'white',
              backgroundColor: activeTab === item.key ? 'rgba(0,123,255,0.2)' : 'transparent',
              border: 'none',
              borderLeft: activeTab === item.key ? '3px solid #007bff' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left'
            }}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const ProfileModal = ({ user, onClose }) => {
  const customerData = {
    id: user?.role || 'KUNDE_001',
    name: 'Max Mustermann',
    company: 'Mustermann GmbH',
    email: 'max@mustermann.de',
    phone: '+49 123 456789',
    address: 'Musterstraße 1, 12345 Musterstadt',
    registeredSince: '2023-01-15'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Kundenprofil</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}>×</button>
        </div>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Kunden-ID:</label>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>{customerData.id}</div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Name:</label>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>{customerData.name}</div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Unternehmen:</label>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>{customerData.company}</div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>E-Mail:</label>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>{customerData.email}</div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Telefon:</label>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>{customerData.phone}</div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Adresse:</label>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>{customerData.address}</div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Registriert seit:</label>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>{customerData.registeredSince}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginComponent = ({ onLogin }) => {
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await onLogin(customerId);
      if (!success) {
        setError('Anmeldung fehlgeschlagen');
      }
    } catch (error) {
      setError('Verbindungsfehler - Offline-Modus aktiv');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '50px 40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 30px',
          background: '#667eea',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        
        <h1 style={{ margin: '0 0 30px 0', fontSize: '28px', color: '#333' }}>Heduschka Service</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#667eea'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Zugangs-Token"
              style={{
                width: '100%',
                padding: '15px 15px 15px 50px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
              disabled={isLoading}
            />
          </div>
          
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#667eea'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              style={{
                width: '100%',
                padding: '15px 15px 15px 50px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              marginBottom: '20px',
              fontSize: '14px',
              padding: '10px',
              background: '#f8d7da',
              borderRadius: '8px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              background: isLoading ? '#9ca3af' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.background = '#5568d3')}
            onMouseLeave={(e) => !isLoading && (e.target.style.background = '#667eea')}
          >
            {isLoading ? 'Anmeldung läuft...' : 'LOGIN'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#f0f4ff',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#667eea',
          textAlign: 'left'
        }}>
          <strong>Demo-Anmeldung:</strong><br />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => {
                setCustomerId('KUNDE_001');
                setPassword('demo123');
              }}
              style={{
                padding: '8px 12px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Kunde Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomerId('ADMIN_001');
                setPassword('admin123');
              }}
              style={{
                padding: '8px 12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (customerId) => {
    try {
      await authService.login(customerId);
      const user = await authService.getCurrentUser();
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Lade VIBE Plattform...
      </div>
    );
  }

  if (!user) {
    return <LoginComponent onLogin={login} />;
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <TopBar user={user} onLogout={logout} onShowProfile={() => setShowProfile(true)} />
        {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <Routes>
          <Route path="/" element={
            user?.role === 'ADMIN_001' ? 
            <Navigate to="/admin/dashboard" replace /> : 
            <Navigate to="/customer/dashboard" replace />
          } />
          
          <Route path="/admin/dashboard" element={
            user?.role === 'ADMIN_001' ? 
            <AdminDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} /> : 
            <Navigate to="/customer/dashboard" replace />
          } />
          
          <Route path="/customer/dashboard" element={
            user?.role === 'KUNDE_XXX' ? 
            <CustomerPortal user={user} activeTab={activeTab} setActiveTab={setActiveTab} /> : 
            <Navigate to="/admin/dashboard" replace />
          } />
          
          <Route path="/customer/portal/service-request" element={
            user?.role === 'KUNDE_XXX' ? 
            <ServiceRequestForm user={user} /> : 
            <Navigate to="/admin/dashboard" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;