import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const CustomerInvoiceView = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerInvoices();
  }, []);

  const loadCustomerInvoices = async () => {
    try {
      const response = await fetch(`/api/rechnungen?kunden_id=${user?.customer_id || user?.kunden_id}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_invoices');
      if (cached) {
        const allInvoices = JSON.parse(cached);
        setInvoices(allInvoices.filter(inv => inv.kunden_id === (user?.customer_id || user?.kunden_id)));
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (invoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rechnung ${invoice.nummer}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20mm; }
          h1 { color: #007bff; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; }
          .totals { text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Heduschka GmbH</h1>
        <h2>Rechnung ${invoice.nummer}</h2>
        <p><strong>Kunde:</strong> ${invoice.kunden_id}</p>
        <p><strong>Datum:</strong> ${new Date(invoice.created_at).toLocaleDateString('de-DE')}</p>
        <p><strong>Fällig am:</strong> ${invoice.faellig_am}</p>
        
        <table>
          <thead>
            <tr>
              <th>Typ</th>
              <th>Beschreibung</th>
              <th>Menge</th>
              <th>Einzelpreis</th>
              <th>Gesamt</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.positionen?.map(pos => `
              <tr>
                <td>${pos.type}</td>
                <td>${pos.beschreibung}</td>
                <td>${pos.menge}</td>
                <td>€${pos.einzelpreis?.toFixed(2)}</td>
                <td>€${pos.gesamtpreis?.toFixed(2)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Netto:</strong> €${invoice.netto?.toFixed(2)}</p>
          <p><strong>MwSt. (${invoice.mwst_prozent}%):</strong> €${invoice.mwst_betrag?.toFixed(2)}</p>
          <p><strong>Brutto:</strong> €${invoice.brutto?.toFixed(2)}</p>
        </div>
        
        <p><strong>Zahlungsbedingungen:</strong> ${invoice.zahlungsbedingungen}</p>
        ${invoice.bemerkungen ? `<p><strong>Bemerkungen:</strong> ${invoice.bemerkungen}</p>` : ''}
        
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusBadge = (status) => {
    const colors = {
      offen: '#ffc107',
      bezahlt: '#28a745',
      ueberfaellig: '#dc3545',
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

  if (loading) return <div style={{ padding: '20px' }}>Lade Rechnungen...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Meine Rechnungen</h2>
      
      {invoices.length === 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6c757d' }}>Noch keine Rechnungen vorhanden</p>
        </div>
      ) : (
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
              {invoices.map(invoice => (
                <tr key={invoice.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{invoice.nummer}</td>
                  <td style={{ padding: '12px' }}>
                    {new Date(invoice.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                    €{invoice.brutto?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '12px' }}>{invoice.faellig_am}</td>
                  <td style={{ padding: '12px' }}>
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => downloadPDF(invoice)}
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
      )}
    </div>
  );
};

export default CustomerInvoiceView;
