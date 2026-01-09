import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AngebotForm from './angebot/AngebotForm';
import RechnungForm from './rechnung/RechnungForm';
import { billingService } from '../../services/billing-service';
import { datevService } from '../../services/datev-service';

const EnhancedAdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    angebote: { total: 0, offen: 0 },
    rechnungen: { total: 0, offen: 0, ueberfaellig: 0 },
    umsatz: 0
  });
  const [angebote, setAngebote] = useState([]);
  const [rechnungen, setRechnungen] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Mock data - in real app would fetch from API
    const mockAngebote = [
      {
        id: '1',
        nummer: 'ANG-2024-0001',
        kunden_id: 'KUNDE_001',
        status: 'versendet',
        brutto: 1250.00,
        created_at: Date.now() - 86400000
      }
    ];
    
    const mockRechnungen = [
      {
        id: '1',
        nummer: 'RE-2024-0001',
        kunden_id: 'KUNDE_001',
        status: 'offen',
        brutto: 1250.00,
        faellig_am: '2024-02-15',
        created_at: Date.now() - 172800000
      }
    ];
    
    setAngebote(mockAngebote);
    setRechnungen(mockRechnungen);
    
    setStats({
      angebote: {
        total: mockAngebote.length,
        offen: mockAngebote.filter(a => a.status === 'versendet').length
      },
      rechnungen: {
        total: mockRechnungen.length,
        offen: mockRechnungen.filter(r => r.status === 'offen').length,
        ueberfaellig: mockRechnungen.filter(r => r.status === 'ueberfaellig').length
      },
      umsatz: mockRechnungen.reduce((sum, r) => sum + r.brutto, 0)
    });
  };

  const handleDatevExport = async () => {
    const selectedRechnungen = rechnungen.filter(r => selectedItems.includes(r.id));
    if (selectedRechnungen.length === 0) {
      alert('Bitte wählen Sie Rechnungen für den Export aus.');
      return;
    }
    
    try {
      await datevService.downloadCSV(selectedRechnungen, `datev-export-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('DATEV Export Fehler:', error);
      alert('Fehler beim DATEV Export');
    }
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Admin Dashboard</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Willkommen, {user?.name || 'Administrator'}</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { key: 'overview', label: 'Übersicht' },
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
              {angebote.slice(0, 3).map(angebot => (
                <div key={angebot.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontWeight: '500' }}>{angebot.nummer}</div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>{angebot.kunden_id}</div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: '15px' }}>Offene Rechnungen</h3>
              {rechnungen.filter(r => r.status === 'offen').slice(0, 3).map(rechnung => (
                <div key={rechnung.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontWeight: '500' }}>{rechnung.nummer}</div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>Fällig: {rechnung.faellig_am}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Angebote Tab */}
      {activeTab === 'angebote' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Angebote verwalten</h2>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              + Neues Angebot
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Kunde</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {angebote.map(angebot => (
                  <tr key={angebot.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{angebot.nummer}</td>
                    <td style={{ padding: '12px' }}>{angebot.kunden_id}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor: '#d4edda',
                        color: '#155724'
                      }}>
                        {angebot.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                      €{angebot.brutto.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button style={{
                        padding: '4px 8px',
                        border: '1px solid #007bff',
                        backgroundColor: 'transparent',
                        color: '#007bff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
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

      {/* Rechnungen Tab */}
      {activeTab === 'rechnungen' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Rechnungen verwalten</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDatevExport}
                disabled={selectedItems.length === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: selectedItems.length > 0 ? '#17a2b8' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                DATEV Export ({selectedItems.length})
              </button>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                + Neue Rechnung
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>
                    <input type="checkbox" onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(rechnungen.map(r => r.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }} />
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Kunde</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Fällig am</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {rechnungen.map(rechnung => (
                  <tr key={rechnung.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(rechnung.id)}
                        onChange={() => toggleItemSelection(rechnung.id)}
                      />
                    </td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{rechnung.nummer}</td>
                    <td style={{ padding: '12px' }}>{rechnung.kunden_id}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor: '#fff3cd',
                        color: '#856404'
                      }}>
                        {rechnung.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                      €{rechnung.brutto.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>{rechnung.faellig_am}</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{
                        padding: '4px 8px',
                        border: '1px solid #007bff',
                        backgroundColor: 'transparent',
                        color: '#007bff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
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
    </div>
  );
};

export default EnhancedAdminDashboard;