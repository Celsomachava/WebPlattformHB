import React, { useState, useEffect } from 'react';

const CustomerServiceRequestsList = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      // Try API first
      const response = await fetch('http://localhost:3001/api/service/requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('heduschka_token')}`
        }
      });
      
      if (response.ok) {
        const apiRequests = await response.json();
        const customerRequests = apiRequests.filter(r => 
          r.kunden_id === (user?.customer_id || user?.kunden_id)
        );
        setRequests(customerRequests);
        return;
      }
    } catch (error) {
      console.error('API error, using fallback:', error);
    }
    
    // Fallback to localStorage
    try {
      const pending = JSON.parse(localStorage.getItem('pending_service_requests') || '[]');
      const cached = JSON.parse(localStorage.getItem('admin_service_requests') || '[]');
      
      const allRequests = [...pending, ...cached];
      const customerRequests = allRequests.filter(r => 
        r.kunden_id === (user?.customer_id || user?.kunden_id)
      );
      
      setRequests(customerRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

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
    return <div style={{ padding: '20px' }}>Lade Serviceanfragen...</div>;
  }

  if (selectedRequest) {
    return (
      <div>
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
          ← Zurück zur Liste
        </button>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Serviceanfrage Details</h2>
            {getStatusBadge(selectedRequest.status || 'neu')}
          </div>

          <div style={{ display: 'grid', gap: '30px' }}>
            <div>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Anfrage-Informationen</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div><strong>Nummer:</strong> {selectedRequest.nummer}</div>
                <div><strong>Serviceart:</strong> {selectedRequest.serviceart}</div>
                <div><strong>Dringlichkeit:</strong> {selectedRequest.dringlichkeit}</div>
                <div><strong>Erstellt am:</strong> {new Date(selectedRequest.created_at).toLocaleDateString('de-DE')}</div>
                {selectedRequest.wunschtermin && (
                  <div><strong>Wunschtermin:</strong> {selectedRequest.wunschtermin}</div>
                )}
                {selectedRequest.zeitfenster && (
                  <div><strong>Zeitfenster:</strong> {selectedRequest.zeitfenster}</div>
                )}
              </div>
            </div>

            {selectedRequest.anlagen_id && (
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Anlagendaten</h3>
                <div><strong>Anlagen-ID:</strong> {selectedRequest.anlagen_id}</div>
              </div>
            )}

            {selectedRequest.bemerkungen && (
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Bemerkungen</h3>
                <p style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {selectedRequest.bemerkungen}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Meine Serviceanfragen</h2>
      
      {requests.length === 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6c757d' }}>Noch keine Serviceanfragen vorhanden</p>
          <button
            onClick={() => window.location.href = '/customer/portal/service-request'}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Neue Serviceanfrage erstellen
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Serviceart</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Dringlichkeit</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Erstellt am</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{request.nummer}</td>
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
                      Details anzeigen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerServiceRequestsList;
