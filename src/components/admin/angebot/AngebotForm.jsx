import React, { useState, useEffect } from 'react';
import { Angebot, AngebotPosition } from '../../../models/vibe-types';
import { billingService } from '../../../services/billing-service';

const AngebotForm = ({ angebotId, onSave, onCancel }) => {
  const [angebot, setAngebot] = useState({
    kunden_id: '',
    positionen: [],
    rabatt_prozent: 0,
    mwst_prozent: 19,
    gueltig_bis: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const positionTypes = [
    { value: 'artikel', label: 'Artikel' },
    { value: 'leistung', label: 'Leistung' },
    { value: 'arbeitszeit', label: 'Arbeitszeit' },
    { value: 'anfahrt', label: 'Anfahrt' },
    { value: 'filter', label: 'Filter' },
    { value: 'pauschale', label: 'Pauschale' }
  ];

  const addPosition = () => {
    const newPosition = {
      id: crypto.randomUUID(),
      type: 'artikel',
      beschreibung: '',
      menge: 1,
      einzelpreis: 0,
      gesamtpreis: 0
    };
    setAngebot(prev => ({
      ...prev,
      positionen: [...prev.positionen, newPosition]
    }));
  };

  const updatePosition = (index, field, value) => {
    const updatedPositionen = [...angebot.positionen];
    updatedPositionen[index] = {
      ...updatedPositionen[index],
      [field]: value,
      gesamtpreis: field === 'menge' || field === 'einzelpreis' 
        ? (field === 'menge' ? value : updatedPositionen[index].menge) * 
          (field === 'einzelpreis' ? value : updatedPositionen[index].einzelpreis)
        : updatedPositionen[index].gesamtpreis
    };
    setAngebot(prev => ({ ...prev, positionen: updatedPositionen }));
  };

  const removePosition = (index) => {
    setAngebot(prev => ({
      ...prev,
      positionen: prev.positionen.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const positionenSumme = angebot.positionen.reduce((sum, pos) => sum + pos.gesamtpreis, 0);
    const nachRabatt = positionenSumme * (1 - angebot.rabatt_prozent / 100);
    const mwstBetrag = nachRabatt * (angebot.mwst_prozent / 100);
    const brutto = nachRabatt + mwstBetrag;
    
    return { netto: nachRabatt, mwstBetrag, brutto };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = angebotId 
        ? await billingService.updateAngebot(angebotId, angebot)
        : await billingService.createAngebot(angebot);
      
      onSave?.(result);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    } finally {
      setLoading(false);
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
          {angebotId ? 'Angebot bearbeiten' : 'Neues Angebot erstellen'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Grunddaten */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Kunden-ID *
              </label>
              <input
                type="text"
                value={angebot.kunden_id}
                onChange={(e) => setAngebot(prev => ({ ...prev, kunden_id: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Gültig bis
              </label>
              <input
                type="date"
                value={angebot.gueltig_bis}
                onChange={(e) => setAngebot(prev => ({ ...prev, gueltig_bis: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          {/* Positionen */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Positionen</h3>
              <button
                type="button"
                onClick={addPosition}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                + Position hinzufügen
              </button>
            </div>
            
            {angebot.positionen.map((position, index) => (
              <div key={position.id} style={{
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 100px 120px 120px 40px', gap: '10px', alignItems: 'end' }}>
                  <select
                    value={position.type}
                    onChange={(e) => updatePosition(index, 'type', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                  >
                    {positionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Beschreibung"
                    value={position.beschreibung}
                    onChange={(e) => updatePosition(index, 'beschreibung', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                  />
                  
                  <input
                    type="number"
                    placeholder="Menge"
                    value={position.menge}
                    onChange={(e) => updatePosition(index, 'menge', parseFloat(e.target.value) || 0)}
                    style={{ padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    min="0"
                    step="0.01"
                  />
                  
                  <input
                    type="number"
                    placeholder="Einzelpreis"
                    value={position.einzelpreis}
                    onChange={(e) => updatePosition(index, 'einzelpreis', parseFloat(e.target.value) || 0)}
                    style={{ padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    min="0"
                    step="0.01"
                  />
                  
                  <div style={{ padding: '8px', fontWeight: '500' }}>
                    €{position.gesamtpreis.toFixed(2)}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removePosition(index)}
                    style={{
                      padding: '8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Rabatt und Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Rabatt (%)
              </label>
              <input
                type="number"
                value={angebot.rabatt_prozent}
                onChange={(e) => setAngebot(prev => ({ ...prev, rabatt_prozent: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: '200px',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            
            <div style={{
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '20px',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Netto:</span>
                <span>€{netto.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>MwSt. ({angebot.mwst_prozent}%):</span>
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
            
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: loading ? '#6c757d' : '#007bff',
                color: 'white',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Speichern...' : 'Angebot speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AngebotForm;