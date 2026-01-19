import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const ServiceRequestsOverview = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/serviceanfragen', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        localStorage.setItem('admin_service_requests', JSON.stringify(data));
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_service_requests');
      if (cached) setRequests(JSON.parse(cached));
      
      const pending = JSON.parse(localStorage.getItem('pending_service_requests') || '[]');
      if (pending.length > 0) {
        setRequests(prev => [...prev, ...pending]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(`/api/serviceanfragen/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getValidToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadRequests();
        alert(`Status wurde auf "${newStatus}" geändert.`);
      }
    } catch (error) {
      alert('Fehler beim Aktualisieren des Status');
    }
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const getStatusBadge = (status) => {
    const colors = {
      neu: '#007bff',
      bearbeitet: '#ffc107',
      abgeschlossen: '#28a745',
      storniert: '#6c757d'
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
      <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
        <p>Lade Serviceanfragen...</p>
      </div>
    );
  }

  if (selectedRequest) {
    return (
      <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
        <button
          onClick={() => setSelectedRequest(null)}
          style={{
            padding: '8px 16px',
            marginBottom: '20px',
            border: '1px solid #6c757d',
            backgroundColor: 'transparent',
            color: '#6c757d',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Zurück zur Übersicht
        </button>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Serviceanfrage Details</h2>
            {getStatusBadge(selectedRequest.status || 'neu')}
          </div>

          <div style={{ display: 'grid', gap: '30px' }}>
            <div>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Kundendaten</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div><strong>Kunden-ID:</strong> {selectedRequest.kunden_id}</div>
                <div><strong>Firmenname:</strong> {selectedRequest.firmenname || '-'}</div>
                <div><strong>Ansprechpartner:</strong> {selectedRequest.ansprechpartner || '-'}</div>
                <div><strong>E-Mail:</strong> {selectedRequest.email || '-'}</div>
                <div><strong>Telefon:</strong> {selectedRequest.telefon || '-'}</div>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Anlagendaten</h3>
              <div><strong>Anlagen-ID:</strong> {selectedRequest.anlagen_id || 'Nicht angegeben'}</div>
            </div>

            <div>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Service-Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div><strong>Serviceart:</strong> {selectedRequest.serviceart}</div>
                <div><strong>Dringlichkeit:</strong> {selectedRequest.dringlichkeit}</div>
                <div><strong>Wunschtermin:</strong> {selectedRequest.wunschtermin || 'Nicht angegeben'}</div>
                <div><strong>Zeitfenster:</strong> {selectedRequest.zeitfenster || 'Keine Präferenz'}</div>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Zusatzinformationen</h3>
              <div><strong>Bemerkungen:</strong></div>
              <p style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                {selectedRequest.bemerkungen || 'Keine Bemerkungen'}
              </p>
              <div style={{ marginTop: '15px' }}>
                <strong>Anhänge:</strong> {selectedRequest.attachments?.length || 0} Datei(en)
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Status ändern</h3>
              <select
                value={selectedRequest.status || 'neu'}
                onChange={(e) => updateStatus(selectedRequest.id, e.target.value)}
                style={{ padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', width: '300px' }}
              >
                <option value="neu">Neu</option>
                <option value="bearbeitet">Bearbeitet</option>
                <option value="abgeschlossen">Abgeschlossen</option>
                <option value="storniert">Storniert</option>
              </select>
            </div>

            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              <strong>Erstellt am:</strong> {new Date(selectedRequest.created_at).toLocaleString('de-DE')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Serviceanfragen Übersicht</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Alle Serviceanfragen von Kunden</p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setFilterStatus('all')}
          style={{
            padding: '8px 16px',
            border: '1px solid #007bff',
            backgroundColor: filterStatus === 'all' ? '#007bff' : 'transparent',
            color: filterStatus === 'all' ? 'white' : '#007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Alle ({requests.length})
        </button>
        <button
          onClick={() => setFilterStatus('neu')}
          style={{
            padding: '8px 16px',
            border: '1px solid #007bff',
            backgroundColor: filterStatus === 'neu' ? '#007bff' : 'transparent',
            color: filterStatus === 'neu' ? 'white' : '#007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Neu ({requests.filter(r => r.status === 'neu').length})
        </button>
        <button
          onClick={() => setFilterStatus('bearbeitet')}
          style={{
            padding: '8px 16px',
            border: '1px solid #ffc107',
            backgroundColor: filterStatus === 'bearbeitet' ? '#ffc107' : 'transparent',
            color: filterStatus === 'bearbeitet' ? 'white' : '#ffc107',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Bearbeitet ({requests.filter(r => r.status === 'bearbeitet').length})
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Kunden-ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Firmenname</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Serviceart</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Dringlichkeit</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Erstellt am</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  Keine Serviceanfragen gefunden
                </td>
              </tr>
            ) : (
              filteredRequests.map(request => (
                <tr key={request.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{request.kunden_id}</td>
                  <td style={{ padding: '12px' }}>{request.firmenname || '-'}</td>
                  <td style={{ padding: '12px' }}>{request.serviceart}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: request.dringlichkeit === 'dringend' ? '#dc3545' : '#28a745',
                      color: 'white'
                    }}>
                      {request.dringlichkeit}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(request.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getStatusBadge(request.status || 'neu')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => setSelectedRequest(request)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRequestsOverview;
