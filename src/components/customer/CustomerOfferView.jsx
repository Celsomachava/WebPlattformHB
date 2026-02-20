import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const CustomerOfferView = ({ user }) => {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await fetch('/api/angebote', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = data.map(o => ({
          ...o,
          positionen: typeof o.positionen === 'string' ? JSON.parse(o.positionen) : o.positionen,
          netto: parseFloat(o.netto) || 0,
          mwst_betrag: parseFloat(o.mwst) || 0,
          brutto: parseFloat(o.brutto) || 0,
          gueltig_bis: o.gueltig_bis ? new Date(o.gueltig_bis).toLocaleDateString('de-DE') : ''
        }));
        setOffers(parsed);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (!confirm('Angebot annehmen?')) return;
    try {
      await fetch(`/api/angebote/${id}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      alert('Angebot angenommen!');
      loadOffers();
      setSelectedOffer(null);
    } catch (error) {
      alert('Fehler beim Annehmen');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Grund für Ablehnung:');
    if (!reason) return;
    try {
      await fetch(`/api/angebote/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      alert('Angebot abgelehnt');
      loadOffers();
      setSelectedOffer(null);
    } catch (error) {
      alert('Fehler beim Ablehnen');
    }
  };

  const statusColor = {
    entwurf: '#6c757d',
    versendet: '#17a2b8',
    angenommen: '#28a745',
    abgelehnt: '#dc3545'
  };

  if (loading) return <div style={{ padding: '20px' }}>Lade...</div>;

  if (selectedOffer) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => setSelectedOffer(null)} style={{ padding: '8px 16px', marginBottom: '20px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          ← Zurück
        </button>

        <div style={{ background: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Angebot {selectedOffer.nummer}</h2>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                Erstellt: {new Date(selectedOffer.created_at).toLocaleDateString('de-DE')}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                Gültig bis: {selectedOffer.gueltig_bis}
              </div>
            </div>
            <span style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '13px', color: 'white', background: statusColor[selectedOffer.status], height: 'fit-content' }}>
              {selectedOffer.status}
            </span>
          </div>

          <h3>Positionen</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Beschreibung</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>Menge</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>Einzelpreis</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {selectedOffer.positionen?.map((pos, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{pos.beschreibung}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{pos.menge}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>€{pos.einzelpreis?.toFixed(2)}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '500' }}>€{pos.gesamtpreis?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <div style={{ minWidth: '280px', border: '1px solid #dee2e6', borderRadius: '4px', padding: '20px', background: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Netto:</span>
                <span>€{selectedOffer.netto?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>MwSt. (19%):</span>
                <span>€{selectedOffer.mwst_betrag?.toFixed(2)}</span>
              </div>
              <hr style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                <span>Brutto:</span>
                <span>€{selectedOffer.brutto?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {selectedOffer.bemerkungen && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
              <strong>Bemerkungen:</strong>
              <div style={{ marginTop: '8px' }}>{selectedOffer.bemerkungen}</div>
            </div>
          )}

          {selectedOffer.status === 'versendet' && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button onClick={() => handleReject(selectedOffer.id)} style={{ padding: '12px 24px', border: 'none', background: '#dc3545', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                Ablehnen
              </button>
              <button onClick={() => handleAccept(selectedOffer.id)} style={{ padding: '12px 24px', border: 'none', background: '#28a745', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                Annehmen
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Meine Angebote</h2>
      
      {offers.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6c757d' }}>Keine Angebote vorhanden</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Gültig bis</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{offer.nummer}</td>
                  <td style={{ padding: '12px' }}>{new Date(offer.created_at).toLocaleDateString('de-DE')}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>€{offer.brutto?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: '12px' }}>{offer.gueltig_bis}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: 'white', background: statusColor[offer.status] }}>
                      {offer.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => setSelectedOffer(offer)} style={{ padding: '6px 12px', border: '1px solid #007bff', background: 'white', color: '#007bff', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                      Details
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

export default CustomerOfferView;
