import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';
import CustomerDetailsPage from './CustomerDetailsPage';
import KundenAnlegen from './KundenAnlegen';
import { API_BASE_URL } from '../../config/api';

const ClientManagement = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewingDetails, setViewingDetails] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadClients();
    
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(loadClients, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadClients = async () => {
    try {
      console.log('Loading clients from database...');
      const token = await authService.getValidToken();
      
      const response = await fetch(`${API_BASE_URL}/customer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received data from database:', data);
        
        const formattedData = data.map(client => ({
          ...client,
          created_at: client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : null
        }));
        
        setClients(formattedData);
      } else {
        console.error('API call failed:', response.status, response.statusText);
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('Error loading clients from database:', error);
      setClients([]);
      alert('Fehler beim Laden der Kundendaten. Bitte stellen Sie sicher, dass die Datenbank verfügbar ist.');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients
    .filter(client => client.role !== 'admin') // Hide admin users
    .filter(client =>
      client.kundennummer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.firmenname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ansprechpartner?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const numA = a.kundennummer?.toLowerCase() || '';
      const numB = b.kundennummer?.toLowerCase() || '';
      return numA.localeCompare(numB);
    });

  const editClient = (client) => {
    setEditingClient(client);
    setEditForm({ ...client });
  };

  const updateClient = async () => {
    try {
      const token = await authService.getValidToken();
      
      const response = await fetch(`${API_BASE_URL}/customer/${editingClient.kundennummer}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firmenname: editForm.firmenname,
          ansprechpartner: editForm.ansprechpartner,
          email: editForm.email,
          telefon: editForm.telefon
        })
      });
      
      if (response.ok) {
        // Reload data immediately after update
        await loadClients();
        alert('Kunde wurde erfolgreich aktualisiert!');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Fehler beim Aktualisieren des Kunden. Bitte versuchen Sie es erneut.');
    }
    
    setEditingClient(null);
    setEditForm({});
  };

  const deleteClient = async (kundennummer) => {
    if (!window.confirm('Möchten Sie diesen Kunden wirklich löschen?')) return;

    try {
      const token = await authService.getValidToken();
      
      const response = await fetch(`${API_BASE_URL}/customer/${kundennummer}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Reload data immediately after delete
        await loadClients();
        alert('Kunde wurde erfolgreich gelöscht!');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Fehler beim Löschen des Kunden. Bitte versuchen Sie es erneut.');
    }
  };

  const viewDetails = (client) => {
    setViewingDetails(client);
  };

  if (viewingDetails) {
    return <CustomerDetailsPage customer={viewingDetails} onBack={() => setViewingDetails(null)} />;
  }

  if (showCreateForm) {
    return <KundenAnlegen onBack={() => { setShowCreateForm(false); loadClients(); }} />;
  }

  if (editingClient) {
    return (
      <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1>Kunde bearbeiten</h1>
            <button onClick={() => { setEditingClient(null); setEditForm({}); }} style={{
              padding: '8px 16px',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              color: '#6c757d',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Abbrechen
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kundennummer</label>
                <input type="text" value={editForm.kundennummer} readOnly style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#e9ecef' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Firmenname *</label>
                <input type="text" value={editForm.firmenname} onChange={(e) => setEditForm({...editForm, firmenname: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ansprechpartner</label>
                <input type="text" value={editForm.ansprechpartner} onChange={(e) => setEditForm({...editForm, ansprechpartner: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>E-Mail</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Telefon</label>
                <input type="tel" value={editForm.telefon} onChange={(e) => setEditForm({...editForm, telefon: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Straße</label>
                <input type="text" value={editForm.strasse} onChange={(e) => setEditForm({...editForm, strasse: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>PLZ</label>
                <input type="text" value={editForm.plz} onChange={(e) => setEditForm({...editForm, plz: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ort</label>
                <input type="text" value={editForm.ort} onChange={(e) => setEditForm({...editForm, ort: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
              <button onClick={() => { setEditingClient(null); setEditForm({}); }} style={{
                padding: '12px 24px',
                border: '1px solid #6c757d',
                backgroundColor: 'transparent',
                color: '#6c757d',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Abbrechen
              </button>
              <button onClick={updateClient} style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Änderungen speichern
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
        <p>Lade Kundendaten...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Kundenverwaltung</h1>
          <p style={{ color: '#6c757d', margin: 0 }}>Übersicht aller registrierten Kunden</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>+</span>
          Neuen Kunden anlegen
        </button>
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
              <th style={{ padding: '12px', textAlign: 'left' }}>Rolle</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Erstellt am</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  Keine Kunden gefunden
                </td>
              </tr>
            ) : (
              filteredClients.map(client => (
                <tr 
                  key={client.id || client.kundennummer} 
                  style={{ borderBottom: '1px solid #dee2e6', cursor: 'pointer' }}
                  onDoubleClick={() => viewDetails(client)}
                >
                  <td style={{ padding: '12px', fontWeight: '500' }}>{client.kundennummer}</td>
                  <td style={{ padding: '12px' }}>{client.firmenname}</td>
                  <td style={{ padding: '12px' }}>{client.ansprechpartner}</td>
                  <td style={{ padding: '12px' }}>{client.email}</td>
                  <td style={{ padding: '12px' }}>{client.telefon}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: client.role === 'admin' ? '#dc3545' : '#28a745',
                      color: 'white'
                    }}>
                      {client.role === 'admin' ? 'Admin' : 'Kunde'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {client.created_at ? new Date(client.created_at).toLocaleDateString('de-DE') : '-'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); viewDetails(client); }}
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
                        Details
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); editClient(client); }}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #ffc107',
                          backgroundColor: 'transparent',
                          color: '#ffc107',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteClient(client.kundennummer); }}
                        style={{
                          padding: '4px 8px',
                          border: 'none',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Löschen
                      </button>
                    </div>
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
