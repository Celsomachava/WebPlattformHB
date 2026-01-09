import React, { useState, useEffect } from 'react';
import { exportCSV, exportASCII, validateDatevData } from '../../services/datevService';
import AngebotForm from './angebot/AngebotForm';
import RechnungForm from './rechnung/RechnungForm';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState([]);
  const [angebote, setAngebote] = useState([]);
  const [rechnungen, setRechnungen] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const request = indexedDB.open('heduschkaForms', 2);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('angebote')) {
          const angeboteStore = db.createObjectStore('angebote', { keyPath: 'id', autoIncrement: true });
          angeboteStore.createIndex('kunden_id', 'kunden_id', { unique: false });
          angeboteStore.createIndex('status', 'status', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('rechnungen')) {
          const rechnungenStore = db.createObjectStore('rechnungen', { keyPath: 'id', autoIncrement: true });
          rechnungenStore.createIndex('kunden_id', 'kunden_id', { unique: false });
          rechnungenStore.createIndex('status', 'status', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('drafts')) {
          const draftsStore = db.createObjectStore('drafts', { keyPath: 'id' });
          draftsStore.createIndex('type', 'type', { unique: false });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        
        // Load submissions
        const submissionsTransaction = db.transaction(['submissions'], 'readonly');
        const submissionsStore = submissionsTransaction.objectStore('submissions');
        submissionsStore.getAll().onsuccess = (e) => {
          setSubmissions(e.target.result || []);
        };
        
        // Load angebote
        if (db.objectStoreNames.contains('angebote')) {
          const angeboteTransaction = db.transaction(['angebote'], 'readonly');
          const angeboteStore = angeboteTransaction.objectStore('angebote');
          angeboteStore.getAll().onsuccess = (e) => {
            setAngebote(e.target.result || []);
          };
        }
        
        // Load rechnungen
        if (db.objectStoreNames.contains('rechnungen')) {
          const rechnungenTransaction = db.transaction(['rechnungen'], 'readonly');
          const rechnungenStore = rechnungenTransaction.objectStore('rechnungen');
          rechnungenStore.getAll().onsuccess = (e) => {
            setRechnungen(e.target.result || []);
          };
        }
        
        // Load drafts
        if (db.objectStoreNames.contains('drafts')) {
          const draftsTransaction = db.transaction(['drafts'], 'readonly');
          const draftsStore = draftsTransaction.objectStore('drafts');
          draftsStore.getAll().onsuccess = (e) => {
            setDrafts(e.target.result || []);
          };
        }
        
        setLoading(false);
      };
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const saveAngebot = async (angebotData) => {
    const request = indexedDB.open('heduschkaForms', 2);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['angebote'], 'readwrite');
      const store = transaction.objectStore('angebote');
      
      if (angebotData.id) {
        store.put(angebotData);
      } else {
        store.add(angebotData);
      }
      
      transaction.oncomplete = () => {
        loadAllData();
        setShowForm(null);
        setSelectedItem(null);
      };
    };
  };

  const saveRechnung = async (rechnungData) => {
    const request = indexedDB.open('heduschkaForms', 2);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['rechnungen'], 'readwrite');
      const store = transaction.objectStore('rechnungen');
      
      if (rechnungData.id) {
        store.put(rechnungData);
      } else {
        store.add(rechnungData);
      }
      
      transaction.oncomplete = () => {
        loadAllData();
        setShowForm(null);
        setSelectedItem(null);
      };
    };
  };

  const createAngebotFromServiceRequest = (serviceRequest) => {
    setSelectedItem(serviceRequest);
    setShowForm('angebot');
  };

  const createRechnungFromAngebot = (angebot) => {
    setSelectedItem(angebot);
    setShowForm('rechnung');
  };

  const handleDatevExport = (format) => {
    const bezahlteRechnungen = rechnungen.filter(r => r.status === 'bezahlt');
    
    if (bezahlteRechnungen.length === 0) {
      alert('Keine bezahlten Rechnungen für Export vorhanden.');
      return;
    }
    
    const errors = validateDatevData(bezahlteRechnungen);
    if (errors.length > 0) {
      alert(`Fehler beim Export:\n${errors.join('\n')}`);
      return;
    }
    
    if (format === 'csv') {
      exportCSV(bezahlteRechnungen);
    } else {
      exportASCII(bezahlteRechnungen);
    }
    
    alert(`DATEV ${format.toUpperCase()} Export erfolgreich erstellt!`);
  };

  const getStatusBadge = (status, type = 'default') => {
    const colors = {
      entwurf: '#6c757d',
      versendet: '#ffc107',
      angenommen: '#28a745',
      abgelehnt: '#dc3545',
      offen: '#ffc107',
      bezahlt: '#28a745',
      ueberfaellig: '#dc3545',
      storniert: '#6c757d',
      pending: '#ffc107',
      synced: '#28a745'
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
        Lade Dashboard...
      </div>
    );
  }

  if (showForm === 'angebot') {
    return (
      <AngebotForm
        angebot={selectedItem?.id ? selectedItem : null}
        serviceAnfrage={selectedItem?.formData ? selectedItem : null}
        onSave={saveAngebot}
        onCancel={() => {
          setShowForm(null);
          setSelectedItem(null);
        }}
      />
    );
  }

  if (showForm === 'rechnung') {
    return (
      <RechnungForm
        rechnung={selectedItem?.nummernkreis?.startsWith('RE-') ? selectedItem : null}
        angebot={selectedItem?.nummernkreis?.startsWith('ANG-') ? selectedItem : null}
        onSave={saveRechnung}
        onCancel={() => {
          setShowForm(null);
          setSelectedItem(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} style={{
          padding: '8px 16px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Abmelden
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #e9ecef', 
        marginBottom: '30px',
        gap: '20px'
      }}>
        {[
          { key: 'dashboard', label: 'Übersicht' },
          { key: 'service-requests', label: 'Serviceanfragen' },
          { key: 'angebote', label: 'Angebote' },
          { key: 'rechnungen', label: 'Rechnungen' },
          { key: 'datev', label: 'DATEV Export' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #007bff' : '2px solid transparent',
              color: activeTab === tab.key ? '#007bff' : '#6c757d',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ background: '#e7f3ff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Serviceanfragen</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{submissions.length}</div>
            </div>
            
            <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Angebote</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{angebote.length}</div>
            </div>
            
            <div style={{ background: '#d1ecf1', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>Rechnungen</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{rechnungen.length}</div>
            </div>
            
            <div style={{ background: '#d4edda', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Umsatz (Monat)</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {rechnungen
                  .filter(r => r.status === 'bezahlt')
                  .reduce((sum, r) => sum + r.brutto, 0)
                  .toFixed(2)} €
              </div>
            </div>
          </div>

          <h3>Letzte Aktivitäten</h3>
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Typ</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Kunde</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...submissions, ...angebote, ...rechnungen]
                  .sort((a, b) => new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at))
                  .slice(0, 10)
                  .map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                      <td style={{ padding: '12px' }}>
                        {new Date(item.timestamp || item.created_at).toLocaleDateString('de-DE')}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {item.formData ? 'Serviceanfrage' : 
                         item.nummernkreis?.startsWith('ANG-') ? 'Angebot' : 'Rechnung'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {item.formData?.kundendaten?.kunden_id || item.kunden_id}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Requests */}
      {activeTab === 'service-requests' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Serviceanfragen</h2>
          </div>
          
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Kunde</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Anlagentyp</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Service</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '12px' }}>
                      {new Date(submission.timestamp).toLocaleDateString('de-DE')}
                    </td>
                    <td style={{ padding: '12px' }}>{submission.formData?.kundendaten?.kunden_id}</td>
                    <td style={{ padding: '12px' }}>{submission.formData?.anlagendaten?.anlagentyp}</td>
                    <td style={{ padding: '12px' }}>{submission.formData?.serviceangaben?.serviceart}</td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(submission.status)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => createAngebotFromServiceRequest(submission)}
                        style={{
                          padding: '4px 8px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Angebot erstellen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Angebote */}
      {activeTab === 'angebote' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Angebote</h2>
            <button
              onClick={() => setShowForm('angebot')}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Neues Angebot
            </button>
          </div>
          
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Nummer</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Kunde</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Betrag</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {angebote.map((angebot, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '12px' }}>{angebot.nummernkreis}</td>
                    <td style={{ padding: '12px' }}>{angebot.kunden_id}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(angebot.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td style={{ padding: '12px' }}>{angebot.brutto.toFixed(2)} €</td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(angebot.status)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => {
                            setSelectedItem(angebot);
                            setShowForm('angebot');
                          }}
                          style={{
                            padding: '4px 8px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Bearbeiten
                        </button>
                        {angebot.status === 'angenommen' && (
                          <button
                            onClick={() => createRechnungFromAngebot(angebot)}
                            style={{
                              padding: '4px 8px',
                              background: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Rechnung erstellen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rechnungen */}
      {activeTab === 'rechnungen' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Rechnungen</h2>
            <button
              onClick={() => setShowForm('rechnung')}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Neue Rechnung
            </button>
          </div>
          
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Nummer</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Kunde</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Betrag</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Fällig</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {rechnungen.map((rechnung, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '12px' }}>{rechnung.nummernkreis}</td>
                    <td style={{ padding: '12px' }}>{rechnung.kunden_id}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(rechnung.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td style={{ padding: '12px' }}>{rechnung.brutto.toFixed(2)} €</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(rechnung.faellig_am).toLocaleDateString('de-DE')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(rechnung.status)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => {
                          setSelectedItem(rechnung);
                          setShowForm('rechnung');
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Bearbeiten
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DATEV Export */}
      {activeTab === 'datev' && (
        <div>
          <h2>DATEV Export</h2>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Export-Optionen</h3>
            <p>Exportiere bezahlte Rechnungen für die DATEV-Buchhaltung.</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => handleDatevExport('csv')}
                style={{
                  padding: '12px 24px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                CSV Export
              </button>
              
              <button
                onClick={() => handleDatevExport('ascii')}
                style={{
                  padding: '12px 24px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ASCII Export
              </button>
            </div>
          </div>
          
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <h3 style={{ padding: '20px', margin: 0, background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
              Exportierbare Rechnungen ({rechnungen.filter(r => r.status === 'bezahlt').length})
            </h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Rechnungsnummer</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Kunde</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Netto</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>MwSt</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Brutto</th>
                </tr>
              </thead>
              <tbody>
                {rechnungen
                  .filter(r => r.status === 'bezahlt')
                  .map((rechnung, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                      <td style={{ padding: '12px' }}>{rechnung.nummernkreis}</td>
                      <td style={{ padding: '12px' }}>{rechnung.kunden_id}</td>
                      <td style={{ padding: '12px' }}>
                        {new Date(rechnung.created_at).toLocaleDateString('de-DE')}
                      </td>
                      <td style={{ padding: '12px' }}>{rechnung.netto.toFixed(2)} €</td>
                      <td style={{ padding: '12px' }}>{rechnung.mwst_betrag.toFixed(2)} €</td>
                      <td style={{ padding: '12px' }}>{rechnung.brutto.toFixed(2)} €</td>
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

export default AdminDashboard;