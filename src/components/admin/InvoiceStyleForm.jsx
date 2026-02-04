import React, { useState } from 'react';

const InvoiceStyleForm = ({ 
  title = "Neues Angebot",
  formData, 
  setFormData, 
  clients, 
  generateNumber, 
  addPosition, 
  updatePosition, 
  removePosition, 
  calculateTotals, 
  onSave, 
  onUpdate, 
  setActiveView, 
  activeView 
}) => {
  const [priceMode, setPriceMode] = useState('brutto');
  const selectedClient = clients.find(c => c.kundennummer === formData.kunden_id);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        padding: '20px',
        flex: 1,
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '40px', 
            marginBottom: '30px'
          }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '16px', 
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Empfänger
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  color: '#666' 
                }}>
                  Kontakt
                </label>
                <input
                  type="text"
                  placeholder="Person oder Organisation"
                  value={selectedClient?.firmenname || ''}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    fontSize: '16px',
                    backgroundColor: '#f9f9f9',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '12px', 
                  color: '#007bff', 
                  cursor: 'pointer' 
                }}>
                  mehr Optionen
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <select
                  value={formData.kunden_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, kunden_id: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
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
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  color: '#666' 
                }}>
                  Anschrift
                </label>
                <input
                  type="text"
                  placeholder="Straße und Hausnummer"
                  value={selectedClient?.strasse || ''}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    backgroundColor: '#f9f9f9',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="PLZ"
                    value={selectedClient?.plz || ''}
                    readOnly
                    style={{ 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      backgroundColor: '#f9f9f9',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Ort"
                    value={selectedClient?.ort || ''}
                    readOnly
                    style={{ 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      backgroundColor: '#f9f9f9',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <select
                  defaultValue="Deutschland"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option>Deutschland</option>
                </select>
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Angebotsinformationen
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '15px', 
                  color: '#666' 
                }}>
                  Angebotsdatum *
                </label>
                <input
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  style={{ 
                    width: '100%',
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  color: '#666' 
                }}>
                  Lieferdatum *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="date"
                    value={formData.gueltig_bis}
                    onChange={(e) => setFormData(prev => ({ ...prev, gueltig_bis: e.target.value }))}
                    style={{ 
                      flex: 1,
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#666' }}>Referenznummer</span>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '15px', 
                  color: '#666' 
                }}>
                  Angebotsnummer *
                </label>
                <input
                  type="text"
                  value={formData.nummer || generateNumber()}
                  onChange={(e) => setFormData(prev => ({ ...prev, nummer: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  color: '#666' 
                }}>
                  Zahlungsziel
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="date"
                    style={{ 
                      flex: 1,
                      minWidth: '120px',
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>in</span>
                  <input
                    type="number"
                    defaultValue="14"
                    style={{ 
                      width: '60px', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>Tagen</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '15px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Produkte
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setPriceMode('brutto')}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    backgroundColor: priceMode === 'brutto' ? '#2c3e50' : 'white',
                    color: priceMode === 'brutto' ? 'white' : '#666',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '15px'
                  }}>
                  Brutto
                </button>
                <button 
                  onClick={() => setPriceMode('netto')}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    backgroundColor: priceMode === 'netto' ? '#2c3e50' : 'white',
                    color: priceMode === 'netto' ? 'white' : '#666',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '15px'
                  }}>
                  Netto
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '15px',
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'left', 
                      fontSize: '15px', 
                      fontWeight: '500', 
                      color: '#666',
                      width: '30px'
                    }}>
                      #
                    </th>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'left', 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#666'
                    }}>
                      Produkt oder Service
                    </th>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'center', 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#666',
                      width: '80px'
                    }}>
                      Menge
                    </th>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#666',
                      width: '120px'
                    }}>
                      Preis ({priceMode})
                    </th>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'center', 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#666',
                      width: '60px'
                    }}>
                      USt.
                    </th>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'center', 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#666',
                      width: '80px'
                    }}>
                      Rabatt
                    </th>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#666',
                      width: '120px'
                    }}>
                      Betrag
                    </th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.positionen.map((position, index) => (
                    <tr key={position.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 8px', fontSize: '14px' }}>
                        {index + 1}.
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <input
                          type="text"
                          value={position.beschreibung}
                          onChange={(e) => updatePosition(index, 'beschreibung', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <input
                          type="number"
                          value={position.menge}
                          onChange={(e) => updatePosition(index, 'menge', parseFloat(e.target.value) || 0)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            textAlign: 'center', 
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                          step="0.01"
                        />
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <input
                          type="number"
                          value={position.einzelpreis}
                          onChange={(e) => updatePosition(index, 'einzelpreis', parseFloat(e.target.value) || 0)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            textAlign: 'right', 
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                          step="0.01"
                        />
                      </td>
                      <td style={{ 
                        padding: '10px 8px', 
                        textAlign: 'center', 
                        fontSize: '14px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                          <input
                            type="number"
                            value={position.ust || 19}
                            onChange={(e) => updatePosition(index, 'ust', parseFloat(e.target.value) || 19)}
                            style={{ 
                              width: '40px', 
                              padding: '4px', 
                              border: '1px solid #ddd', 
                              borderRadius: '4px', 
                              textAlign: 'center', 
                              fontSize: '12px',
                              boxSizing: 'border-box'
                            }}
                            min="0"
                            max="100"
                          />
                          <span>%</span>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '10px 8px', 
                        textAlign: 'center', 
                        fontSize: '14px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                          <input
                            type="number"
                            value={position.rabatt || 0}
                            onChange={(e) => updatePosition(index, 'rabatt', parseFloat(e.target.value) || 0)}
                            style={{ 
                              width: '40px', 
                              padding: '4px', 
                              border: '1px solid #ddd', 
                              borderRadius: '4px', 
                              textAlign: 'center', 
                              fontSize: '12px',
                              boxSizing: 'border-box'
                            }}
                            min="0"
                            max="100"
                          />
                          <span>%</span>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '10px 8px', 
                        textAlign: 'right', 
                        fontSize: '14px', 
                        fontWeight: '500' 
                      }}>
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
                            fontSize: '16px'
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={addPosition}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  color: '#007bff'
                }}
              >
                + Position hinzufügen
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginBottom: '30px' }}>
            <h3 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '18px', 
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Zahlungsbedingungen
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '16px', 
              color: '#666', 
              lineHeight: '1.6' 
            }}>
              Bitte überweisen Sie den Angebotsbetrag unter Angabe der Angebotsnummer auf das unten angegebene Konto.
            </p>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <strong>Kontaktdaten:</strong><br/>
                  Max Mustermann<br/>
                  Musterstraße 123<br/>
                  12345 Musterstadt<br/>
                  Deutschland<br/>
                  Tel: +49 123 456789<br/>
                  Email: max@mustermann.de<br/>
                  Web: www.mustermann.de
                </div>
                <div>
                  <strong>Bankverbindung:</strong><br/>
                  Bank: Musterbank<br/>
                  IBAN: DE89 3704 0044 0532 0130 00<br/>
                  BIC: COBADEFFXXX<br/>
                  Kontonummer: 532013000<br/>
                  BLZ: 37040044<br/><br/>
                  <strong>Steuernummer:</strong> 123/456/78901
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
            <button
              onClick={() => setActiveView('list')}
              style={{
                padding: '12px 24px',
                border: '1px solid #6c757d',
                backgroundColor: 'transparent',
                color: '#6c757d',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Abbrechen
            </button>
            
            <button
              onClick={activeView === 'edit' ? onUpdate : onSave}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Angebot erstellen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStyleForm;