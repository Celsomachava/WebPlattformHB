import React, { useState, useEffect } from 'react';

const CustomerDetailsPage = ({ customer, onBack }) => {
  const [assetsHistory, setAssetsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssetsHistory();
  }, [customer]);

  const loadAssetsHistory = () => {
    setLoading(true);
    try {
      // Load from localStorage
      const cached = localStorage.getItem('customer_installations');
      const pending = JSON.parse(localStorage.getItem('pending_anlagen') || '[]');
      
      let allAnlagen = [];
      if (cached) {
        allAnlagen = JSON.parse(cached);
      }
      if (pending.length > 0) {
        allAnlagen = [...allAnlagen, ...pending];
      }
      
      // Filter by customer
      const customerAssets = allAnlagen.filter(a => 
        a.kunden_id === customer.kundennummer || 
        a.kunden_id === customer.id
      );
      
      console.log('Customer:', customer);
      console.log('All Anlagen:', allAnlagen);
      console.log('Filtered Assets:', customerAssets);
      
      setAssetsHistory(customerAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
      setAssetsHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Kundendetails</h1>
        <button onClick={onBack} style={{
          padding: '10px 20px',
          border: '1px solid #007bff',
          backgroundColor: 'transparent',
          color: '#007bff',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          ← Zurück zur Übersicht
        </button>
      </div>

      {/* Personal Information */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          Persönliche Informationen
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Kundennummer</label>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>{customer.kundennummer}</div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Firmenname</label>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>{customer.firmenname}</div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Ansprechpartner</label>
            <div style={{ fontSize: '16px' }}>{customer.ansprechpartner || '-'}</div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>E-Mail</label>
            <div style={{ fontSize: '16px' }}>{customer.email || '-'}</div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Telefon</label>
            <div style={{ fontSize: '16px' }}>{customer.telefon || '-'}</div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Adresse</label>
            <div style={{ fontSize: '16px' }}>
              {customer.strasse && customer.plz && customer.ort 
                ? `${customer.strasse}, ${customer.plz} ${customer.ort}`
                : '-'}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Erstellt am</label>
            <div style={{ fontSize: '16px' }}>
              {customer.created_at ? new Date(customer.created_at).toLocaleDateString('de-DE') : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Assets History */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
          Anlagen Historie ({assetsHistory.length})
        </h2>
        
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6c757d' }}>
            Lade Anlagen...
          </div>
        ) : assetsHistory.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6c757d' }}>
            Keine Anlagen für diesen Kunden vorhanden
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              Kundennummer: {customer.kundennummer}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Anlagen-ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Standort</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Filtertyp</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>QR-Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Erstellt am</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {assetsHistory.map((asset, index) => (
                  <tr key={asset.id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', fontWeight: '500', color: '#007bff' }}>
                      {asset.anlagen_id || asset.id}
                    </td>
                    <td style={{ padding: '12px' }}>{asset.standort}</td>
                    <td style={{ padding: '12px' }}>{asset.filtertyp}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '14px' }}>
                      {asset.qr_code_id}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {asset.created_at ? new Date(asset.created_at).toLocaleDateString('de-DE') : '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: 'white',
                        backgroundColor: asset.synced === false ? '#ffc107' : '#28a745'
                      }}>
                        {asset.synced === false ? 'Ausstehend' : 'Aktiv'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
