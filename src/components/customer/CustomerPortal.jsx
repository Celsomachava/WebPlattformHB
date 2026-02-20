import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const CustomerPortal = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [angebote, setAngebote] = useState([]);
  const [rechnungen, setRechnungen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      const kundenId = user?.customer_id || user?.kunden_id || user?.kundennummer || user?.id;
      console.log('Loading data for customer:', kundenId);
      
      // Load offers from localStorage
      const cachedOffers = localStorage.getItem('admin_offers');
      if (cachedOffers) {
        const allOffers = JSON.parse(cachedOffers);
        console.log('All offers:', allOffers);
        const customerOffers = allOffers.filter(o => o.kunden_id === kundenId);
        console.log('Customer offers:', customerOffers);
        setAngebote(customerOffers);
      }
      
      // Load invoices from localStorage
      const cachedInvoices = localStorage.getItem('admin_invoices');
      if (cachedInvoices) {
        const allInvoices = JSON.parse(cachedInvoices);
        const customerInvoices = allInvoices.filter(i => i.kunden_id === kundenId);
        setRechnungen(customerInvoices);
      }
      
      // Load service requests from localStorage
      const cachedRequests = localStorage.getItem('admin_service_requests');
      if (cachedRequests) {
        const allRequests = JSON.parse(cachedRequests);
        const customerRequests = allRequests.filter(r => r.kunden_id === kundenId);
        setServiceRequests(customerRequests);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Kundendaten:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (type, id) => {
    // Mock PDF download
    alert(`${type} PDF wird heruntergeladen...`);
  };

  const acceptAngebot = async (angebotId) => {
    try {
      // Mock API call
      setAngebote(prev => prev.map(a => 
        a.id === angebotId ? { ...a, status: 'angenommen' } : a
      ));
      alert('Angebot wurde angenommen!');
    } catch (error) {
      console.error('Fehler beim Annehmen des Angebots:', error);
    }
  };

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

  const getStatusBadge = (status) => {
    const colors = {
      offen: '#ffc107',
      versendet: '#17a2b8',
      angenommen: '#28a745',
      abgelehnt: '#dc3545',
      bezahlt: '#28a745',
      ueberfaellig: '#dc3545',
      bearbeitet: '#007bff',
      abgeschlossen: '#28a745'
    };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        color: 'white',
        backgroundColor: colors[status] || '#6c757d'
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Lade Kundenportal...
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Kundenportal</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Willkommen, {user?.customer_id || user?.kunden_id}</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { key: 'overview', label: 'Übersicht' },
            { key: 'service-requests', label: 'Serviceanfragen' },
            { key: 'angebote', label: 'Angebote' },
            { key: 'rechnungen', label: 'Rechnungen' }
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
                fontWeight: activeTab === tab.key ? '500' : 'normal'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <StatCard 
              title="Serviceanfragen" 
              value={serviceRequests.length} 
              subtitle="Gesamt eingereicht"
              color="#28a745"
            />
            <StatCard 
              title="Offene Angebote" 
              value={angebote.filter(a => a.status === 'versendet').length} 
              subtitle="Warten auf Annahme"
              color="#ffc107"
            />
            <StatCard 
              title="Offene Rechnungen" 
              value={rechnungen.filter(r => r.status === 'offen').length} 
              subtitle="Zu bezahlen"
              color="#dc3545"
            />
            <StatCard 
              title="Offener Betrag" 
              value={`€${rechnungen.filter(r => r.status === 'offen').reduce((sum, r) => sum + r.brutto, 0).toFixed(2)}`} 
              color="#007bff"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: '15px' }}>Letzte Aktivitäten</h3>
              {[...serviceRequests, ...angebote, ...rechnungen]
                .sort((a, b) => b.created_at - a.created_at)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontWeight: '500' }}>{item.nummer}</div>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                      {new Date(item.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: '15px' }}>Schnellaktionen</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={{
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}>
                  + Neue Serviceanfrage
                </button>
                <button style={{
                  padding: '12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}>
                  📄 Dokumente herunterladen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Requests Tab */}
      {activeTab === 'service-requests' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Meine Serviceanfragen</h2>
          
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Serviceart</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map(request => (
                  <tr key={request.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{request.nummer}</td>
                    <td style={{ padding: '12px' }}>{request.serviceart}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(request.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(request.status)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => downloadPDF('Serviceanfrage', request.id)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #007bff',
                          backgroundColor: 'transparent',
                          color: '#007bff',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Angebote Tab */}
      {activeTab === 'angebote' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Meine Angebote</h2>
          
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Gültig bis</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {angebote.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                      Keine Angebote verfügbar.
                    </td>
                  </tr>
                ) : (
                  angebote.map(angebot => (
                    <tr key={angebot.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{angebot.nummer}</td>
                      <td style={{ padding: '12px' }}>
                        {new Date(angebot.created_at).toLocaleDateString('de-DE')}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                        €{(parseFloat(angebot.brutto) || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px' }}>{angebot.gueltig_bis}</td>
                      <td style={{ padding: '12px' }}>
                        {getStatusBadge(angebot.status)}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => downloadPDF('Angebot', angebot.id)}
                            style={{
                              padding: '4px 8px',
                              border: '1px solid #007bff',
                              backgroundColor: 'transparent',
                              color: '#007bff',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            PDF
                          </button>
                          {angebot.status === 'versendet' && (
                            <button
                              onClick={() => acceptAngebot(angebot.id)}
                              style={{
                                padding: '4px 8px',
                                border: 'none',
                                backgroundColor: '#28a745',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Annehmen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rechnungen Tab */}
      {activeTab === 'rechnungen' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Meine Rechnungen</h2>
          
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Fällig am</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {rechnungen.map(rechnung => (
                  <tr key={rechnung.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{rechnung.nummer}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(rechnung.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                      €{rechnung.brutto.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>{rechnung.faellig_am}</td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(rechnung.status)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => downloadPDF('Rechnung', rechnung.id)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #007bff',
                          backgroundColor: 'transparent',
                          color: '#007bff',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;