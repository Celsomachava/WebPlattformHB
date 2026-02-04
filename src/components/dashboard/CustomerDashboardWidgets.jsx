import React, { useState, useEffect } from 'react';

export const CustomerRecentRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('pending_service_requests') || '[]')
      .filter(r => r.kunden_id === user?.customer_id || r.kunden_id === user?.kunden_id)
      .slice(0, 4);
    setRequests(data);
  }, [user]);

  const getStatusColor = (status) => {
    const colors = { neu: '#28a745', bearbeitet: '#ffc107', abgeschlossen: '#6c757d' };
    return colors[status] || '#6c757d';
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Meine Serviceanfragen</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e9ecef' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Serviceart</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Dringlichkeit</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Datum</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                Keine Serviceanfragen vorhanden
              </td>
            </tr>
          ) : (
            requests.map((req, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={{ padding: '12px 8px', fontSize: '14px' }}>{req.serviceart}</td>
                <td style={{ padding: '12px 8px', fontSize: '14px' }}>{req.dringlichkeit}</td>
                <td style={{ padding: '12px 8px', fontSize: '14px', color: '#6c757d' }}>
                  {new Date(req.created_at).toLocaleDateString('de-DE')}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    backgroundColor: getStatusColor(req.status),
                    color: 'white'
                  }}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const CustomerQuickActions = ({ setActiveTab }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Schnellzugriff</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <button
        onClick={() => window.location.href = '/customer/portal/service-request'}
        style={{
          padding: '16px',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'left'
        }}
      >
        + Neue Serviceanfrage
      </button>
      <button
        onClick={() => setActiveTab('angebote')}
        style={{
          padding: '16px',
          backgroundColor: '#f093fb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'left'
        }}
      >
        Angebote ansehen
      </button>
      <button
        onClick={() => setActiveTab('rechnungen')}
        style={{
          padding: '16px',
          backgroundColor: '#4facfe',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'left'
        }}
      >
        Rechnungen ansehen
      </button>
      <button
        onClick={() => setActiveTab('anlage-anlegen')}
        style={{
          padding: '16px',
          backgroundColor: '#feca57',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'left'
        }}
      >
        Anlage anlegen
      </button>
    </div>
  </div>
);

export const CustomerRecentOffers = ({ user }) => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('admin_offers') || '[]')
      .filter(o => o.kunden_id === user?.customer_id || o.kunden_id === user?.kunden_id)
      .slice(0, 5);
    setOffers(data);
  }, [user]);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Meine Angebote</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e9ecef' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Nummer</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Datum</th>
            <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Betrag</th>
          </tr>
        </thead>
        <tbody>
          {offers.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                Keine Angebote vorhanden
              </td>
            </tr>
          ) : (
            offers.map((offer, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={{ padding: '12px 8px', fontSize: '14px' }}>{offer.nummer}</td>
                <td style={{ padding: '12px 8px', fontSize: '14px', color: '#6c757d' }}>
                  {new Date(offer.created_at).toLocaleDateString('de-DE')}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>
                  €{offer.brutto?.toFixed(2) || '0.00'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const CustomerRecentInvoices = ({ user }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('admin_invoices') || '[]')
      .filter(i => i.kunden_id === user?.customer_id || i.kunden_id === user?.kunden_id)
      .slice(0, 5);
    setInvoices(data);
  }, [user]);

  const getStatusColor = (status) => {
    const colors = { offen: '#ffc107', bezahlt: '#28a745', ueberfaellig: '#dc3545' };
    return colors[status] || '#6c757d';
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Meine Rechnungen</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e9ecef' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Nummer</th>
            <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Betrag</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                Keine Rechnungen vorhanden
              </td>
            </tr>
          ) : (
            invoices.map((invoice, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={{ padding: '12px 8px', fontSize: '14px' }}>{invoice.nummer}</td>
                <td style={{ padding: '12px 8px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>
                  €{invoice.brutto?.toFixed(2) || '0.00'}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    backgroundColor: getStatusColor(invoice.status),
                    color: 'white'
                  }}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
