import React, { useState, useEffect } from 'react';
import { Rechnung, Angebot } from '../../../models/vibe-types';
import { billingService } from '../../../services/billing-service';

const RechnungForm = ({ rechnungId, angebot, onSave, onCancel }) => {
  const [rechnung, setRechnung] = useState({
    kunden_id: angebot?.kunden_id || '',
    angebot_id: angebot?.id,
    positionen: angebot?.positionen || [],
    mwst_prozent: 19,
    zahlungsbedingungen: 'Zahlbar innerhalb 14 Tagen ohne Abzug',
    faellig_am: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'offen', label: 'Offen' },
    { value: 'bezahlt', label: 'Bezahlt' },
    { value: 'ueberfaellig', label: 'Überfällig' },
    { value: 'storniert', label: 'Storniert' }
  ];

  const calculateTotals = () => {
    const netto = rechnung.positionen.reduce((sum, pos) => sum + pos.gesamtpreis, 0);
    const mwstBetrag = netto * (rechnung.mwst_prozent / 100);
    const brutto = netto + mwstBetrag;
    
    return { netto, mwstBetrag, brutto };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await billingService.createRechnung(angebot);
      onSave?.(result);
    } catch (error) {
      console.error('Fehler beim Erstellen der Rechnung:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!rechnungId) return;
    
    try {
      const result = await billingService.updateRechnungStatus(rechnungId, newStatus);
      setRechnung(prev => ({ ...prev, status: newStatus }));
      onSave?.(result);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
    }
  };

  const { netto, mwstBetrag, brutto } = calculateTotals();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>
          {rechnungId ? 'Rechnung bearbeiten' : 'Neue Rechnung erstellen'}
          {angebot && (
            <span style={{ fontSize: '16px', color: '#6c757d', marginLeft: '10px' }}>
              (aus Angebot {angebot.nummer})
            </span>
          )}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Grunddaten */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Kunden-ID *
              </label>
              <input
                type="text"
                value={rechnung.kunden_id}
                onChange={(e) => setRechnung(prev => ({ ...prev, kunden_id: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
                required
                readOnly={!!angebot}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Fällig am
              </label>
              <input
                type="date"
                value={rechnung.faellig_am}
                onChange={(e) => setRechnung(prev => ({ ...prev, faellig_am: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            {rechnungId && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Status
                </label>
                <select
                  value={rechnung.status || 'offen'}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Zahlungsbedingungen */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Zahlungsbedingungen
            </label>
            <textarea
              value={rechnung.zahlungsbedingungen}
              onChange={(e) => setRechnung(prev => ({ ...prev, zahlungsbedingungen: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Positionen (Read-only wenn aus Angebot) */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Rechnungspositionen</h3>
            
            {rechnung.positionen.map((position, index) => (
              <div key={position.id || index} style={{
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 100px 120px 120px', gap: '10px', alignItems: 'center' }}>
                  <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                    {position.type}
                  </div>
                  <div>{position.beschreibung}</div>
                  <div style={{ textAlign: 'right' }}>{position.menge}</div>
                  <div style={{ textAlign: 'right' }}>€{position.einzelpreis.toFixed(2)}</div>
                  <div style={{ textAlign: 'right', fontWeight: '500' }}>€{position.gesamtpreis.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              minWidth: '300px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Netto:</span>
                <span>€{netto.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>MwSt. ({rechnung.mwst_prozent}%):</span>
                <span>€{mwstBetrag.toFixed(2)}</span>
              </div>
              <hr style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                <span>Brutto:</span>
                <span>€{brutto.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                border: '1px solid #6c757d',
                backgroundColor: 'transparent',
                color: '#6c757d',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Abbrechen
            </button>
            
            {!rechnungId && (
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: loading ? '#6c757d' : '#28a745',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Erstellen...' : 'Rechnung erstellen'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RechnungForm;