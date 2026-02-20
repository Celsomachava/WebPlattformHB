import React from 'react';

const OfferForm = ({ offerForm, setOfferForm, clients, generateOfferNumber, addPosition, updatePosition, removePosition, calculateTotals, saveOffer, updateOffer, setActiveView, activeView }) => {
  const { netto, mwstBetrag, brutto } = calculateTotals();
  const selectedClient = clients.find(c => c.kundennummer === offerForm.kunden_id);
  
  return (
    <div style={{ marginLeft: '260px', marginTop: '60px', padding: '40px', width: 'calc(100vw - 260px)', background: '#f5f7fa', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '400' }}>Neues Angebot</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setActiveView('list')} style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Vorschau
            </button>
            <button
              onClick={activeView === 'edit' ? updateOffer : saveOffer}
              style={{
                padding: '8px 16px',
                border: 'none',
                backgroundColor: '#2c3e50',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Fertigstellen
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '500' }}>Empfänger</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Kontakt</label>
              <input
                type="text"
                placeholder="Person oder Organisation"
                value={selectedClient?.firmenname || ''}
                readOnly
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: '#f9f9f9' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <select
                value={offerForm.kunden_id}
                onChange={(e) => setOfferForm(prev => ({ ...prev, kunden_id: e.target.value }))}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                required
              >
                <option value="">Kunde auswählen...</option>
                {clients.map(client => (
                  <option key={client.id || client.kundennummer} value={client.kundennummer}>
                    {client.firmenname || client.kundennummer}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Anschrift</label>
              <input
                type="text"
                placeholder="Straße und Hausnummer"
                value={selectedClient?.strasse || ''}
                readOnly
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="PLZ"
                  value={selectedClient?.plz || ''}
                  readOnly
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: '#f9f9f9' }}
                />
                <input
                  type="text"
                  placeholder="Ort"
                  value={selectedClient?.ort || ''}
                  readOnly
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: '#f9f9f9' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <select
                defaultValue="Deutschland"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              >
                <option>Deutschland</option>
              </select>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '500' }}>Angebotsinformationen</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Angebotsdatum *</label>
              <input
                type="date"
                value={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Lieferdatum *</label>
              <input
                type="date"
                value={offerForm.gueltig_bis}
                onChange={(e) => setOfferForm(prev => ({ ...prev, gueltig_bis: e.target.value }))}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Angebotsnummer *</label>
              <input
                type="text"
                value={offerForm.nummer || generateOfferNumber()}
                onChange={(e) => setOfferForm(prev => ({ ...prev, nummer: e.target.value }))}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Zahlungsziel</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="date"
                  style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
                <span style={{ fontSize: '14px' }}>in</span>
                <input
                  type="number"
                  defaultValue="14"
                  style={{ width: '60px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', textAlign: 'center' }}
                />
                <span style={{ fontSize: '14px' }}>Tagen</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Betreff</label>
          <input
            type="text"
            value={`Angebot Nr. ${offerForm.nummer || generateOfferNumber()}`}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '10px' }}
          />
          <textarea
            value={offerForm.bemerkungen}
            onChange={(e) => setOfferForm(prev => ({ ...prev, bemerkungen: e.target.value }))}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '100px',
              resize: 'vertical',
              fontSize: '14px'
            }}
            placeholder="Sehr geehrte Damen und Herren,&#10;&#10;vielen Dank für Ihren Auftrag und das damit verbundene Vertrauen!&#10;Hiermit stelle ich Ihnen die folgenden Leistungen in Rechnung:"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>Produkte</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}>
                Brutto
              </button>
              <button style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}>
                Netto
              </button>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#666' }}>ID</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#666' }}>Produkt oder Service</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#666' }}>Beschreibung</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: '#666', width: '80px' }}>Menge</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '500', color: '#666', width: '120px' }}>Preis</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: '#666', width: '60px' }}>MwSt.</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: '#666', width: '80px' }}>Rabatt</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '500', color: '#666', width: '120px' }}>Betrag</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {offerForm.positionen.map((position, index) => (
                <tr key={position.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 8px', fontSize: '14px' }}>{position.id || (index + 1)}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="text"
                      placeholder="Produktname"
                      value={position.name || position.beschreibung}
                      onChange={(e) => updatePosition(index, 'name', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="text"
                      placeholder="Beschreibung"
                      value={position.beschreibung}
                      onChange={(e) => updatePosition(index, 'beschreibung', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="number"
                      value={position.menge}
                      onChange={(e) => updatePosition(index, 'menge', Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', fontSize: '14px' }}
                      min="1"
                      step="1"
                    />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="number"
                      value={position.einzelpreis}
                      onChange={(e) => updatePosition(index, 'einzelpreis', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'right', fontSize: '14px' }}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '14px' }}>19%</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '14px' }}>0 %</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>
                    {position.gesamtpreis.toFixed(2)} €
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <button
                      onClick={() => removePosition(index)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'transparent',
                        color: '#999',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addPosition} style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#007bff'
            }}>
              + Position hinzufügen
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '500' }}>Zahlungsbedingungen</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungsnummer auf das unten angegebene Konto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferForm;
