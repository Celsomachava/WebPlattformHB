import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const ClientManagement = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch('/api/kunden', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        localStorage.setItem('admin_clients', JSON.stringify(data));
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_clients');
      if (cached) setClients(JSON.parse(cached));
      
      const pending = JSON.parse(localStorage.getItem('pending_customers') || '[]');
      if (pending.length > 0) {
        setClients(prev => [...prev, ...pending]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.kundennummer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.firmenname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ansprechpartner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
        <p>Lade Kundendaten...</p>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Kundenverwaltung</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Übersicht aller registrierten Kunden</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Suche nach Kundennummer, Firma oder Ansprechpartner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Kundennummer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Firmenname</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Ansprechpartner</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>E-Mail</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Telefon</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Erstellt am</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  Keine Kunden gefunden
                </td>
              </tr>
            ) : (
              filteredClients.map(client => (
                <tr key={client.id || client.kundennummer} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{client.kundennummer}</td>
                  <td style={{ padding: '12px' }}>{client.firmenname}</td>
                  <td style={{ padding: '12px' }}>{client.ansprechpartner}</td>
                  <td style={{ padding: '12px' }}>{client.email}</td>
                  <td style={{ padding: '12px' }}>{client.telefon}</td>
                  <td style={{ padding: '12px' }}>
                    {client.created_at ? new Date(client.created_at).toLocaleDateString('de-DE') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#0c5460'
      }}>
        <strong>Gesamt:</strong> {filteredClients.length} Kunde(n) {searchTerm && `(gefiltert von ${clients.length})`}
      </div>
    </div>
  );
};

export default ClientManagement;
