import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import ProfileSettings from './components/profile/ProfileSettings.jsx';
import { RecentRequests, QuickStats, RecentOffers, RecentInvoices } from './components/dashboard/DashboardWidgets';
import { CustomerRecentRequests, CustomerQuickActions, CustomerRecentOffers, CustomerRecentInvoices } from './components/dashboard/CustomerDashboardWidgets';

const AdminDashboard = ({ user, activeTab, setActiveTab }) => {
  const [stats, setStats] = useState({
    angebote: { total: 0, offen: 0 },
    rechnungen: { total: 0, offen: 0, ueberfaellig: 0 },
    anfragen: { total: 0, neu: 0 },
    umsatz: 0
  });

  useEffect(() => {
    let timeoutId;
    const loadStats = async () => {
      try {
        const token = localStorage.getItem('heduschka_token');
        
        // Load service requests
        const reqRes = await fetch('http://localhost:3002/api/serviceanfragen', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const requests = reqRes.ok ? await reqRes.json() : [];
        
        // Load offers
        const offRes = await fetch('http://localhost:3002/api/angebote', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const offers = offRes.ok ? await offRes.json() : [];
        
        // Load invoices
        const invRes = await fetch('http://localhost:3002/api/rechnungen', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const invoices = invRes.ok ? await invRes.json() : [];
        
        setStats({
          angebote: { 
            total: offers.length, 
            offen: offers.filter(o => o.status === 'offen').length 
          },
          rechnungen: { 
            total: invoices.length, 
            offen: invoices.filter(i => i.status === 'offen').length,
            ueberfaellig: invoices.filter(i => i.status === 'ueberfaellig').length
          },
          anfragen: { 
            total: requests.length, 
            neu: requests.filter(r => r.status === 'neu').length 
          },
          umsatz: invoices.filter(i => i.status === 'bezahlt').reduce((sum, i) => sum + (parseFloat(i.gesamtbetrag) || 0), 0)
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    
    timeoutId = setTimeout(loadStats, 200);
    const interval = setInterval(loadStats, 30000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [activeTab]);

  const StatCard = ({ title, value, subtitle, color = '#007bff', trend }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontWeight: '500' }}>
          {title}
        </h3>
        {trend && (
          <span style={{ 
            color: trend.startsWith('+') ? '#28a745' : '#dc3545',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '700', color, marginBottom: '8px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '13px', color: '#6c757d' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginLeft: '260px', marginTop: '60px', padding: '30px', maxWidth: 'calc(100vw - 260px)', background: '#f5f7fa', minHeight: 'calc(100vh - 60px)' }}>

      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <StatCard 
              title="Angebote gesamt" 
              value={stats.angebote.total} 
              subtitle={`${stats.angebote.offen} offen`}
              color="#667eea"
            />
            <StatCard 
              title="Rechnungen gesamt" 
              value={stats.rechnungen.total} 
              subtitle={`${stats.rechnungen.offen} offen`}
              color="#f093fb"
            />
            <StatCard 
              title="Serviceanfragen" 
              value={stats.anfragen.total}
              subtitle={`${stats.anfragen.neu} neu`}
              color="#4facfe"
            />
            <StatCard 
              title="Gesamtumsatz" 
              value={`€${stats.umsatz.toFixed(2)}`} 
              color="#feca57"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <RecentRequests />
            <QuickStats stats={stats} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <RecentOffers />
            <RecentInvoices />
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
  const [stats, setStats] = useState({
    anfragen: { total: 0, neu: 0, bearbeitet: 0 },
    angebote: { total: 0, offen: 0 },
    rechnungen: { total: 0, offen: 0, bezahlt: 0 },
    gesamtkosten: 0
  });

  useEffect(() => {
    let timeoutId;
    const loadStats = async () => {
      const userId = user?.id || user?.kundennummer || user?.customer_id || user?.kunden_id;
      if (!userId) return;
      
      try {
        const token = localStorage.getItem('heduschka_token');
        
        // Load service requests
        const reqRes = await fetch('http://localhost:3002/api/serviceanfragen', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const allRequests = reqRes.ok ? await reqRes.json() : [];
        const requests = allRequests.filter(r => r.kunden_id === userId || r.kundennummer === userId);
        
        // Load offers
        const offRes = await fetch('http://localhost:3002/api/angebote', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const allOffers = offRes.ok ? await offRes.json() : [];
        const offers = allOffers.filter(o => o.kunden_id === userId || o.kundennummer === userId);
        
        // Load invoices
        const invRes = await fetch('http://localhost:3002/api/rechnungen', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const allInvoices = invRes.ok ? await invRes.json() : [];
        const invoices = allInvoices.filter(i => i.kunden_id === userId || i.kundennummer === userId);
        
        setStats({
          anfragen: { 
            total: requests.length, 
            neu: requests.filter(r => r.status === 'neu').length,
            bearbeitet: requests.filter(r => r.status === 'bearbeitet').length
          },
          angebote: { 
            total: offers.length, 
            offen: offers.filter(o => o.status === 'offen').length 
          },
          rechnungen: { 
            total: invoices.length, 
            offen: invoices.filter(i => i.status === 'offen').length,
            bezahlt: invoices.filter(i => i.status === 'bezahlt').length
          },
          gesamtkosten: invoices.reduce((sum, i) => sum + (parseFloat(i.gesamtbetrag) || 0), 0)
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    
    timeoutId = setTimeout(loadStats, 300);
    const interval = setInterval(loadStats, 30000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [user, activeTab]);

  const StatCard = ({ title, value, subtitle, color = '#007bff' }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontWeight: '500' }}>
          {title}
        </h3>
      </div>
      <div style={{ fontSize: '32px', fontWeight: '700', color, marginBottom: '8px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '13px', color: '#6c757d' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginLeft: '260px', marginTop: '60px', padding: '30px', maxWidth: 'calc(100vw - 260px)', background: '#f5f7fa', minHeight: 'calc(100vh - 60px)' }}>

      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <StatCard 
              title="Serviceanfragen" 
              value={stats.anfragen.total} 
              subtitle={`${stats.anfragen.neu} neu, ${stats.anfragen.bearbeitet} in Bearbeitung`}
              color="#667eea"
            />
            <StatCard 
              title="Angebote" 
              value={stats.angebote.total} 
              subtitle={`${stats.angebote.offen} offen`}
              color="#f093fb"
            />
            <StatCard 
              title="Rechnungen" 
              value={stats.rechnungen.total}
              subtitle={`${stats.rechnungen.offen} offen, ${stats.rechnungen.bezahlt} bezahlt`}
              color="#4facfe"
            />
            <StatCard 
              title="Gesamtkosten" 
              value={`€${stats.gesamtkosten.toFixed(2)}`} 
              color="#feca57"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <CustomerRecentRequests user={user} />
            <CustomerQuickActions setActiveTab={setActiveTab} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <CustomerRecentOffers user={user} />
            <CustomerRecentInvoices user={user} />
          </div>
        </div>
      )}

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
      {activeTab === 'anlage-anlegen' && <AnlageAnlegen user={user} />}
      {activeTab === 'angebote' && <CustomerOfferView user={user} />}
      {activeTab === 'rechnungen' && <CustomerInvoiceView user={user} />}
    </div>
  );
};

const TopBar = ({ user, onLogout, onShowProfile }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      setDropdownOpen(false);
    };
    
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);
  
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
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
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
          {user?.name || 'Benutzer'} ({user?.role === 'admin' || user?.id === 'ADMIN_001' ? 'Admin' : 'Kunde'})
          <span style={{ fontSize: '12px' }}>▼</span>
        </button>
        
        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '280px',
            zIndex: 1001,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #eee',
              background: '#f8f9fa'
            }}>
              <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                {user?.name || 'Benutzer'}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '2px' }}>
                {user?.email || 'Keine E-Mail'}
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                {user?.company || 'Kein Unternehmen'}
              </div>
            </div>
            <button
              onClick={() => {
                window.location.href = '/profile';
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
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⚙️</span>
              Profileinstellungen
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
                color: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🚪</span>
              Abmelden
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  const isAdmin = user?.role === 'admin' || user?.id === 'ADMIN_001';
  
  const Icon = ({ d }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '18px' }}>
      <path d={d} />
    </svg>
  );
  
  const adminMenuItems = [
    { key: 'overview', label: 'Übersicht', path: '/admin/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
    { key: 'angebote', label: 'Angebote', path: '/admin/dashboard', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
    { key: 'rechnungen', label: 'Rechnungen', path: '/admin/dashboard', icon: 'M18 20V10 M12 20V4 M6 20v-6' },
    { key: 'anfragen', label: 'Anfrage Übersicht', path: '/admin/dashboard', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
    { key: 'kundenverwaltung', label: 'Kundenverwaltung', path: '/admin/dashboard', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
    { key: 'anlage-anlegen', label: 'Anlage anlegen', path: '/admin/dashboard', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
    { key: 'wochenplan', label: 'Wochenplan', path: '/admin/dashboard', icon: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
    { key: 'pruefprotokoll', label: 'Prüfprotokoll DGUV', path: '/admin/dashboard', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11 M14 2v6h6' },
    { key: 'arbeitsauftrag', label: 'Arbeitsauftrag', path: '/admin/dashboard', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
    { key: 'gefaehrdungsbeurteilung', label: 'Gefährdungsbeurteilung', path: '/admin/dashboard', icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01' }
  ];
  
  const customerMenuItems = [
    { key: 'overview', label: 'Übersicht', path: '/customer/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
    { key: 'service-requests', label: 'Serviceanfragen', path: '/customer/dashboard', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
    { key: 'anlage-anlegen', label: 'Anlage anlegen', path: '/customer/dashboard', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
    { key: 'angebote', label: 'Angebote', path: '/customer/dashboard', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
    { key: 'rechnungen', label: 'Rechnungen', path: '/customer/dashboard', icon: 'M18 20V10 M12 20V4 M6 20v-6' }
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
      padding: '20px 0',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>HEDUSCHKA</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#95a5a6' }}>MENU</p>
      </div>
      
      <nav>
        {menuItems.map(item => (
          <Link
            key={item.key}
            to={item.path}
            onClick={() => setActiveTab(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 20px',
              color: activeTab === item.key ? '#fff' : '#95a5a6',
              textDecoration: 'none',
              backgroundColor: activeTab === item.key ? 'rgba(52, 152, 219, 0.15)' : 'transparent',
              borderLeft: activeTab === item.key ? '3px solid #3498db' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <Icon d={item.icon} />
            <span>{item.label}</span>
          </Link>
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!customerId || !password) {
      setError('Bitte geben Sie Benutzername und Passwort ein');
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await onLogin(customerId, password);
      if (!success) {
        setError('Ungültige Anmeldedaten');
      }
    } catch (error) {
      setError('Anmeldung fehlgeschlagen: ' + error.message);
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
              placeholder="Kundennummer (z.B. KUNDE_001)"
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              style={{
                width: '100%',
                padding: '15px 50px 15px 50px',
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#667eea',
                padding: '0',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
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
    let mounted = true;
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted && currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid token
        localStorage.removeItem('heduschka_token');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    initAuth();
    return () => { mounted = false; };
  }, []);

  const login = async (customerId, password) => {
    try {
      await authService.login(customerId, password);
      const user = await authService.getCurrentUser();
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('overview');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', margin: 0 }}>Heduschka Service</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', marginTop: '10px' }}>Loading...</p>
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
            <Navigate to={user?.role === 'admin' || user?.id === 'ADMIN_001' ? '/admin/dashboard' : '/customer/dashboard'} replace />
          } />
          
          <Route path="/admin/dashboard" element={
            user?.role === 'admin' || user?.id === 'ADMIN_001' ? 
            <AdminDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} /> : 
            <Navigate to="/customer/dashboard" replace />
          } />
          
          <Route path="/customer/dashboard" element={
            <CustomerPortal user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
          } />
          
          <Route path="/profile" element={<ProfileSettings user={user} />} />
          
          <Route path="/customer/portal/service-request" element={
            <ServiceRequestForm user={user} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;