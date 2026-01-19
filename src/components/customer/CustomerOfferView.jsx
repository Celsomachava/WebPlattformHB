import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';
import { offerHistoryService } from '../../services/offerHistoryService';

const CustomerOfferView = ({ user }) => {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerOffers();
  }, []);

  const loadCustomerOffers = async () => {
    try {
      const response = await fetch(`/api/angebote?kunden_id=${user?.customer_id || user?.kunden_id}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_offers');
      if (cached) {
        const allOffers = JSON.parse(cached);
        setOffers(allOffers.filter(o => o.kunden_id === (user?.customer_id || user?.kunden_id)));
      }
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async (offerId) => {
    if (!window.confirm('Möchten Sie dieses Angebot wirklich annehmen?')) return;

    try {
      // Update localStorage first (offline-first)
      const cached = localStorage.getItem('admin_offers');
      if (cached) {
        const allOffers = JSON.parse(cached);
        const offerIndex = allOffers.findIndex(o => o.id === offerId);
        if (offerIndex !== -1) {
          allOffers[offerIndex].status = 'angenommen';
          allOffers[offerIndex].accepted_by = user?.customer_id || user?.kunden_id;
          allOffers[offerIndex].accepted_at = Date.now();
          localStorage.setItem('admin_offers', JSON.stringify(allOffers));
        }
      }

      // Try server update
      try {
        await fetch(`/api/angebote/${offerId}/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await authService.getValidToken()}`
          },
          body: JSON.stringify({
            accepted_by: user?.customer_id || user?.kunden_id,
            accepted_at: Date.now()
          })
        });
      } catch (e) {}

      await offerHistoryService.createVersion(offerId, {
        action: 'accepted',
        accepted_by: user?.customer_id || user?.kunden_id,
        timestamp: Date.now()
      }, user?.id);

      alert('Angebot wurde erfolgreich angenommen!');
      await loadCustomerOffers();
      setSelectedOffer(null);
    } catch (error) {
      alert('Fehler beim Annehmen des Angebots');
    }
  };

  const rejectOffer = async (offerId) => {
    const reason = prompt('Bitte geben Sie einen Grund für die Ablehnung an:');
    if (!reason) return;

    try {
      // Update localStorage first (offline-first)
      const cached = localStorage.getItem('admin_offers');
      if (cached) {
        const allOffers = JSON.parse(cached);
        const offerIndex = allOffers.findIndex(o => o.id === offerId);
        if (offerIndex !== -1) {
          allOffers[offerIndex].status = 'abgelehnt';
          allOffers[offerIndex].rejected_by = user?.customer_id || user?.kunden_id;
          allOffers[offerIndex].rejected_at = Date.now();
          allOffers[offerIndex].rejection_reason = reason;
          localStorage.setItem('admin_offers', JSON.stringify(allOffers));
        }
      }

      // Try server update
      try {
        await fetch(`/api/angebote/${offerId}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await authService.getValidToken()}`
          },
          body: JSON.stringify({
            rejected_by: user?.customer_id || user?.kunden_id,
            rejected_at: Date.now(),
            reason
          })
        });
      } catch (e) {}

      await offerHistoryService.createVersion(offerId, {
        action: 'rejected',
        rejected_by: user?.customer_id || user?.kunden_id,
        reason,
        timestamp: Date.now()
      }, user?.id);

      alert('Angebot wurde abgelehnt.');
      await loadCustomerOffers();
      setSelectedOffer(null);
    } catch (error) {
      alert('Fehler beim Ablehnen des Angebots');
    }
  };

  const downloadPDF = (offer) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Angebot ${offer.nummer}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
          th { background-color: #f8f9fa; }
          .total { font-weight: bold; font-size: 18px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <h1>Angebot ${offer.nummer}</h1>
        <p><strong>Datum:</strong> ${new Date(offer.created_at).toLocaleDateString('de-DE')}</p>
        <p><strong>Gültig bis:</strong> ${offer.gueltig_bis}</p>
        <p><strong>Kunde:</strong> ${offer.kunden_id}</p>
        <hr>
        <h2>Positionen</h2>
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
            ${offer.positionen?.map(pos => `
              <tr>
                <td>${pos.type}</td>
                <td>${pos.beschreibung}</td>
                <td>${pos.menge}</td>
                <td>€${pos.einzelpreis?.toFixed(2)}</td>
                <td>€${pos.gesamtpreis?.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="text-align: right; margin-top: 30px;">
          <p>Netto: €${offer.netto?.toFixed(2)}</p>
          <p>MwSt. (${offer.mwst_prozent}%): €${offer.mwst_betrag?.toFixed(2)}</p>
          <hr>
          <p class="total">Brutto: €${offer.brutto?.toFixed(2)}</p>
        </div>
        ${offer.bemerkungen ? `<div style="margin-top: 30px;"><strong>Bemerkungen:</strong><p>${offer.bemerkungen}</p></div>` : ''}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusBadge = (status) => {
    const colors = {
      entwurf: '#6c757d',
      versendet: '#17a2b8',
      angenommen: '#28a745',
      abgelehnt: '#dc3545',
      abgelaufen: '#ffc107'
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

  if (loading) return <div style={{ padding: '20px' }}>Lade Angebote...</div>;

  if (selectedOffer) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={() => setSelectedOffer(null)}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
            <div>
              <h2 style={{ margin: '0 0 10px 0' }}>Angebot {selectedOffer.nummer}</h2>
              <div style={{ color: '#6c757d', fontSize: '14px' }}>
                Erstellt am: {new Date(selectedOffer.created_at).toLocaleDateString('de-DE')}
              </div>
              <div style={{ color: '#6c757d', fontSize: '14px' }}>
                Gültig bis: {selectedOffer.gueltig_bis}
              </div>
            </div>
            {getStatusBadge(selectedOffer.status)}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3>Angebotspositionen</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Typ</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Beschreibung</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>Menge</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>Einzelpreis</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>Gesamt</th>
                </tr>
              </thead>
              <tbody>
                {selectedOffer.positionen?.map((pos, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textTransform: 'capitalize' }}>{pos.type}</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{pos.beschreibung}</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{pos.menge}</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>€{pos.einzelpreis?.toFixed(2)}</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '500' }}>€{pos.gesamtpreis?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
            <div style={{ minWidth: '300px', border: '1px solid #dee2e6', borderRadius: '4px', padding: '20px', backgroundColor: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Netto:</span>
                <span>€{selectedOffer.netto?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>MwSt. ({selectedOffer.mwst_prozent}%):</span>
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
            <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <strong>Bemerkungen:</strong>
              <div style={{ marginTop: '10px' }}>{selectedOffer.bemerkungen}</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => downloadPDF(selectedOffer)}
              style={{
                padding: '12px 24px',
                border: '1px solid #007bff',
                backgroundColor: 'transparent',
                color: '#007bff',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              PDF herunterladen
            </button>
            
            {selectedOffer.status === 'versendet' && (
              <>
                <button
                  onClick={() => rejectOffer(selectedOffer.id)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Ablehnen
                </button>
                <button
                  onClick={() => acceptOffer(selectedOffer.id)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Angebot annehmen
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Meine Angebote</h2>
      
      {offers.length === 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6c757d' }}>Noch keine Angebote vorhanden</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Gültig bis</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{offer.nummer}</td>
                  <td style={{ padding: '12px' }}>
                    {new Date(offer.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                    €{offer.brutto?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '12px' }}>{offer.gueltig_bis}</td>
                  <td style={{ padding: '12px' }}>
                    {getStatusBadge(offer.status)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => setSelectedOffer(offer)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerOfferView;
