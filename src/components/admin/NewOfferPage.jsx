import React, { useState } from 'react';
import '../../styles/new-offer.css';

const NewOfferPage = () => {
  const [formData, setFormData] = useState({
    empfaenger: {
      kontakt: '',
      anschrift: '',
      plz: '',
      ort: '',
      land: 'Deutschland'
    },
    rechnungsinfo: {
      rechnungsdatum: new Date().toISOString().split('T')[0],
      lieferdatum: '',
      rechnungsnummer: 'RE-1000',
      zahlungsziel: '14'
    },
    betreff: 'Rechnung Nr. RE-1040',
    nachricht: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihren Auftrag und das damit verbundene Vertrauen!\nHiermit stelle ich Ihnen die folgenden Leistungen in Rechnung:',
    produkte: [
      {
        id: 1,
        beschreibung: 'Unternehmensberatung',
        menge: 1.00,
        einzelpreis: 1500.00,
        ust: 19,
        rabatt: 0,
        betrag: 1500.00
      }
    ]
  });

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      beschreibung: '',
      menge: 1.00,
      einzelpreis: 0.00,
      ust: 19,
      rabatt: 0,
      betrag: 0.00
    };
    setFormData(prev => ({
      ...prev,
      produkte: [...prev.produkte, newProduct]
    }));
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...formData.produkte];
    updatedProducts[index][field] = value;
    
    if (field === 'menge' || field === 'einzelpreis') {
      updatedProducts[index].betrag = updatedProducts[index].menge * updatedProducts[index].einzelpreis;
    }
    
    setFormData(prev => ({
      ...prev,
      produkte: updatedProducts
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      produkte: prev.produkte.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return formData.produkte.reduce((sum, product) => sum + product.betrag, 0);
  };

  return (
    <div className="new-offer-container">
      {/* Sidebar */}
      <div className="new-offer-sidebar">
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            sevDesk
          </div>
        </div>
        
        <nav>
          <div style={{ padding: '0 20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: '#95a5a6', marginBottom: '10px' }}>ÜBERSICHT</div>
          </div>
          
          <div style={{ padding: '0 20px' }}>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>📊 Kontakte</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>📋 Aufträge</div>
            </div>
            <div style={{ marginBottom: '8px', backgroundColor: '#34495e', margin: '0 -20px', padding: '8px 20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>📄 Rechnungen</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>📊 Belege</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>💰 Zahlungen</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>📈 Auswertungen</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>📦 Inventar</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>⚙️ Einstellungen</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '8px 0', fontSize: '14px', cursor: 'pointer' }}>📤 Exporte</div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="new-offer-main">
        {/* Header */}
        <div className="new-offer-header">
          <h1 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '400',
            color: '#2c3e50'
          }}>
            Neue Rechnung
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
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
            <button style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: '#2c3e50',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Fertigstellen
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="new-offer-content">
          <div className="new-offer-form">
            {/* Empfänger und Rechnungsinformationen */}
            <div className="new-offer-grid">
              {/* Empfänger */}
              <div className="new-offer-section">
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
                    value={formData.empfaenger.kontakt}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      empfaenger: { ...prev.empfaenger, kontakt: e.target.value }
                    }))}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px' 
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
                    value={formData.empfaenger.anschrift}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      empfaenger: { ...prev.empfaenger, anschrift: e.target.value }
                    }))}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      marginBottom: '10px'
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="PLZ"
                      value={formData.empfaenger.plz}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        empfaenger: { ...prev.empfaenger, plz: e.target.value }
                      }))}
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Ort"
                      value={formData.empfaenger.ort}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        empfaenger: { ...prev.empfaenger, ort: e.target.value }
                      }))}
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={formData.empfaenger.land}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      empfaenger: { ...prev.empfaenger, land: e.target.value }
                    }))}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px' 
                    }}
                  >
                    <option>Deutschland</option>
                  </select>
                </div>
              </div>

              {/* Rechnungsinformationen */}
              <div className="new-offer-section">
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  fontSize: '16px', 
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Rechnungsinformationen
                </h3>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '13px', 
                    color: '#666' 
                  }}>
                    Rechnungsdatum *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="date"
                      value={formData.rechnungsinfo.rechnungsdatum}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rechnungsinfo: { ...prev.rechnungsinfo, rechnungsdatum: e.target.value }
                      }))}
                      style={{ 
                        flex: 1,
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#666' }}>Zeitraum</span>
                    <span style={{ fontSize: '12px', color: '#007bff', cursor: 'pointer' }}>📅</span>
                  </div>
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
                      value={formData.rechnungsinfo.lieferdatum}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rechnungsinfo: { ...prev.rechnungsinfo, lieferdatum: e.target.value }
                      }))}
                      style={{ 
                        flex: 1,
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#666' }}>Referenznummer</span>
                    <span style={{ fontSize: '12px', color: '#007bff', cursor: 'pointer' }}>⚙️</span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '13px', 
                    color: '#666' 
                  }}>
                    Rechnungsnummer *
                  </label>
                  <input
                    type="text"
                    value={formData.rechnungsinfo.rechnungsnummer}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rechnungsinfo: { ...prev.rechnungsinfo, rechnungsnummer: e.target.value }
                    }))}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      fontSize: '14px' 
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="date"
                      style={{ 
                        flex: 1,
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        fontSize: '14px' 
                      }}
                    />
                    <span style={{ fontSize: '14px' }}>in</span>
                    <input
                      type="number"
                      value={formData.rechnungsinfo.zahlungsziel}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rechnungsinfo: { ...prev.rechnungsinfo, zahlungsziel: e.target.value }
                      }))}
                      style={{ 
                        width: '60px', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        fontSize: '14px',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{ fontSize: '14px' }}>Tagen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Betreff */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '13px', 
                color: '#666' 
              }}>
                Betreff
              </label>
              <input
                type="text"
                value={formData.betreff}
                onChange={(e) => setFormData(prev => ({ ...prev, betreff: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  fontSize: '14px',
                  marginBottom: '10px'
                }}
              />
              <textarea
                value={formData.nachricht}
                onChange={(e) => setFormData(prev => ({ ...prev, nachricht: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '100px',
                  resize: 'vertical',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Produkte */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '15px' 
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Produkte
                </h3>
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

              <div className="table-responsive">
                <table className="new-offer-table">
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ 
                      padding: '10px 8px', 
                      textAlign: 'left', 
                      fontSize: '13px', 
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
                      Preis (brutto)
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
                  {formData.produkte.map((product, index) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 8px', fontSize: '14px' }}>
                        {index + 1}.
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <input
                          type="text"
                          value={product.beschreibung}
                          onChange={(e) => updateProduct(index, 'beschreibung', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            fontSize: '14px' 
                          }}
                        />
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <input
                          type="number"
                          value={product.menge}
                          onChange={(e) => updateProduct(index, 'menge', parseFloat(e.target.value) || 0)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            textAlign: 'center', 
                            fontSize: '14px' 
                          }}
                          step="0.01"
                        />
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <input
                          type="number"
                          value={product.einzelpreis}
                          onChange={(e) => updateProduct(index, 'einzelpreis', parseFloat(e.target.value) || 0)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            textAlign: 'right', 
                            fontSize: '14px' 
                          }}
                          step="0.01"
                        />
                      </td>
                      <td style={{ 
                        padding: '10px 8px', 
                        textAlign: 'center', 
                        fontSize: '14px' 
                      }}>
                        {product.ust}%
                      </td>
                      <td style={{ 
                        padding: '10px 8px', 
                        textAlign: 'center', 
                        fontSize: '14px' 
                      }}>
                        {product.rabatt} %
                      </td>
                      <td style={{ 
                        padding: '10px 8px', 
                        textAlign: 'right', 
                        fontSize: '14px', 
                        fontWeight: '500' 
                      }}>
                        {product.betrag.toFixed(2)} €
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <button
                          onClick={() => removeProduct(index)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'transparent',
                            color: '#999',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                  onClick={addProduct}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#007bff'
                  }}
                >
                  + Position hinzufügen
                </button>
                <button style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  + Zwischensumme
                </button>
                <button style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  + Gesamtrabatt hinzufügen
                </button>
              </div>

              {/* Total */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                fontSize: '16px',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Gesamt: {calculateTotal().toFixed(2)} €
              </div>
            </div>

            {/* Zahlungsbedingungen */}
            <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Zahlungsbedingungen
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#666', 
                lineHeight: '1.6' 
              }}>
                Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungsnummer auf das unten angegebene Konto. Der Rechnungsbetrag
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOfferPage;