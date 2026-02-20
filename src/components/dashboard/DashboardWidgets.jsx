import React, { useState, useEffect } from 'react';

export const RecentRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('admin_service_requests') || '[]');
    setRequests(data.slice(0, 4));
  }, []);

  const getStatusColor = (status) => {
    const colors = { neu: '#28a745', bearbeitet: '#ffc107', abgeschlossen: '#6c757d' };
    return colors[status] || '#6c757d';
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Aktuelle Serviceanfragen</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e9ecef' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Kunde</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Serviceart</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Dringlichkeit</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Datum</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>{req.kunden_id}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const QuickStats = ({ stats }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Schnellübersicht</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[
        { label: 'Offene Angebote', value: stats.angebote.offen, color: '#667eea' },
        { label: 'Offene Rechnungen', value: stats.rechnungen.offen, color: '#f093fb' },
        { label: 'Neue Anfragen', value: stats.anfragen.neu, color: '#4facfe' },
        { label: 'Überfällige Rechnungen', value: stats.rechnungen.ueberfaellig, color: '#dc3545' }
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <span style={{ fontSize: '14px' }}>{item.label}</span>
          <span style={{ fontSize: '20px', fontWeight: '700', color: item.color }}>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const RecentOffers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('admin_offers') || '[]');
    setOffers(data.slice(0, 5));
  }, []);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Aktuelle Angebote</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e9ecef' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Nummer</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Kunde</th>
            <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Betrag</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>{offer.nummer}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>{offer.kunden_id}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>
                €{(parseFloat(offer.brutto) || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const RecentInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('admin_invoices') || '[]');
    setInvoices(data.slice(0, 5));
  }, []);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Aktuelle Rechnungen</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e9ecef' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Nummer</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Kunde</th>
            <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Betrag</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>{invoice.nummer}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>{invoice.kunden_id}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>
                €{(parseFloat(invoice.brutto) || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
