import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';

const OfferModule = ({ user }) => {
  const [activeView, setActiveView] = useState('list');
  const [offers, setOffers] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterKundenId, setFilterKundenId] = useState('');

  const [offerForm, setOfferForm] = useState({
    nummer: '',
    kunden_id: '',
    service_anfrage_id: '',
    anlagen_id: '',
    positionen: [],
    rabatt_prozent: 0,
    mwst_prozent: 19,
    gueltig_bis: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bemerkungen: ''
  });

  const positionTypes = [
    { value: 'artikel', label: 'Artikel' },
    { value: 'leistung', label: 'Leistung' },
    { value: 'arbeitszeit', label: 'Arbeitszeit' },
    { value: 'anfahrt', label: 'Anfahrt' },
    { value: 'filter', label: 'Filter' },
    { value: 'pauschale', label: 'Pauschale' }
  ];

  useEffect(() => {
    loadOffers();
    loadServiceRequests();
    loadInstallations();
    loadClients();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await fetch('/api/angebote', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
        localStorage.setItem('admin_offers', JSON.stringify(data));
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_offers');
      if (cached) setOffers(JSON.parse(cached));
    }
  };

  const createInvoiceFromOffer = async (offerId) => {
    try {
      const response = await fetch(`/api/angebote/${offerId}/create-invoice`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const invoice = await response.json();
        alert(`Rechnung ${invoice.nummer} wurde automatisch erstellt!`);
        loadOffers();
      }
    } catch (error) {
      alert('Fehler beim Erstellen der Rechnung');
    }
  };

  const loadServiceRequests = async () => {
    try {
      const response = await fetch('/api/serviceanfragen', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setServiceRequests(data.filter(sr => sr.status === 'neu' || sr.status === 'bearbeitet'));
      }
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const loadInstallations = async () => {
    try {
      const response = await fetch('/api/anlagen', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        setInstallations(await response.json());
      }
    } catch (error) {
      console.error('Error loading installations:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await fetch('/api/kunden', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_clients');
      if (cached) setClients(JSON.parse(cached));
      
      const pending = JSON.parse(localStorage.getItem('pending_customers') || '[]');
      if (pending.length > 0) {
        setClients(prev => [...prev, ...pending]);
      }
    }
  };

  const generateOfferNumber = () => {
    const year = new Date().getFullYear();
    const count = offers.length + 1;
    return `ANG-${year}-${String(count).padStart(4, '0')}`;
  };

  const addPosition = () => {
    const newPosition = {
      id: crypto.randomUUID(),
      type: 'artikel',
      beschreibung: '',
      menge: 1,
      einzelpreis: 0,
      gesamtpreis: 0
    };
    setOfferForm(prev => ({
      ...prev,
      positionen: [...prev.positionen, newPosition]
    }));
  };

  const updatePosition = (index, field, value) => {
    const updatedPositionen = [...offerForm.positionen];
    updatedPositionen[index] = {
      ...updatedPositionen[index],
      [field]: value
    };

    if (field === 'menge' || field === 'einzelpreis') {
      const menge = field === 'menge' ? value : updatedPositionen[index].menge;
      const einzelpreis = field === 'einzelpreis' ? value : updatedPositionen[index].einzelpreis;
      updatedPositionen[index].gesamtpreis = menge * einzelpreis;
    }

    setOfferForm(prev => ({ ...prev, positionen: updatedPositionen }));
  };

  const removePosition = (index) => {
    setOfferForm(prev => ({
      ...prev,
      positionen: prev.positionen.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const positionenSumme = offerForm.positionen.reduce((sum, pos) => sum + pos.gesamtpreis, 0);
    const nachRabatt = positionenSumme * (1 - offerForm.rabatt_prozent / 100);
    const mwstBetrag = nachRabatt * (offerForm.mwst_prozent / 100);
    const brutto = nachRabatt + mwstBetrag;
    
    return { netto: nachRabatt, mwstBetrag, brutto };
  };

  const createOfferFromServiceRequest = (serviceRequest) => {
    setOfferForm({
      nummer: generateOfferNumber(),
      kunden_id: serviceRequest.kunden_id,
      service_anfrage_id: serviceRequest.id,
      anlagen_id: serviceRequest.anlagen_id,
      positionen: [{
        id: crypto.randomUUID(),
        type: serviceRequest.serviceart === 'Filterwechsel' ? 'filter' : 'leistung',
        beschreibung: `${serviceRequest.serviceart} - ${serviceRequest.bemerkungen || 'Standard Service'}`,
        menge: 1,
        einzelpreis: serviceRequest.serviceart === 'Filterwechsel' ? 150 : 200,
        gesamtpreis: serviceRequest.serviceart === 'Filterwechsel' ? 150 : 200
      }],
      rabatt_prozent: 0,
      mwst_prozent: 19,
      gueltig_bis: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bemerkungen: `Angebot basierend auf Serviceanfrage ${serviceRequest.nummer}`
    });
    setActiveView('create');
  };

  const saveOffer = async () => {
    try {
      const { netto, mwstBetrag, brutto } = calculateTotals();
      
      const offerData = {
        ...offerForm,
        netto,
        mwst_betrag: mwstBetrag,
        brutto,
        status: 'entwurf',
        created_at: Date.now(),
        version: 1
      };

      const response = await fetch('/api/angebote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getValidToken()}`
        },
        body: JSON.stringify(offerData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Generate PDF after saving
        try {
          const pdfResponse = await fetch(`/api/angebote/${result.id}/pdf`, {
            headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
          });
          
          if (pdfResponse.ok) {
            const blob = await pdfResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Angebot_${offerData.nummer}.pdf`;
            a.click();
          }
        } catch (pdfError) {
          console.log('PDF generation failed, continuing without PDF');
        }
        
        alert('Angebot wurde erfolgreich erstellt und als PDF gespeichert!');
        loadOffers();
        setActiveView('list');
        resetForm();
      }
    } catch (error) {
      // Offline fallback
      const offlineOffer = {
        id: crypto.randomUUID(),
        ...offerForm,
        ...calculateTotals(),
        status: 'entwurf',
        created_at: Date.now(),
        synced: false
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_offers') || '[]');
      pending.push(offlineOffer);
      localStorage.setItem('pending_offers', JSON.stringify(pending));
      
      alert('Angebot wurde offline gespeichert und wird bei Internetverbindung übertragen.');
      setActiveView('list');
      resetForm();
    }
  };

  const sendOffer = async (offerId) => {
    try {
      const response = await fetch(`/api/angebote/${offerId}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        alert('Angebot wurde an den Kunden versendet!');
        loadOffers();
      }
    } catch (error) {
      alert('Fehler beim Versenden des Angebots');
    }
  };

  const generatePDF = async (offer) => {
    try {
      const response = await fetch(`/api/angebote/${offer.id}/pdf`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Angebot_${offer.nummer}.pdf`;
        a.click();
      }
    } catch (error) {
      alert('PDF-Generierung nicht verfügbar (Offline)');
    }
  };

  const resetForm = () => {
    setOfferForm({
      nummer: '',
      kunden_id: '',
      service_anfrage_id: '',
      anlagen_id: '',
      positionen: [],
      rabatt_prozent: 0,
      mwst_prozent: 19,
      gueltig_bis: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bemerkungen: ''
    });
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

  if (activeView === 'create') {
    const { netto, mwstBetrag, brutto } = calculateTotals();
    
    return (
      <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1>Neues Angebot erstellen</h1>
            <button onClick={() => setActiveView('list')} style={{
              padding: '8px 16px',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              color: '#6c757d',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Zurück zur Liste
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            {/* Grunddaten */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Angebotsnummer</label>
                <input
                  type="text"
                  value={offerForm.nummer || generateOfferNumber()}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, nummer: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kunden-ID *</label>
                <select
                  value={offerForm.kunden_id}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, kunden_id: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                  required
                >
                  <option value="">Kunde auswählen...</option>
                  {clients.map(client => (
                    <option key={client.id || client.kundennummer} value={client.kundennummer}>
                      {client.kundennummer} - {client.firmenname}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Gültig bis</label>
                <input
                  type="date"
                  value={offerForm.gueltig_bis}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, gueltig_bis: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
              </div>
            </div>

            {/* Positionen */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Angebotspositionen</h3>
                <button onClick={addPosition} style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  + Position hinzufügen
                </button>
              </div>
              
              {offerForm.positionen.map((position, index) => (
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Rabatt (%)</label>
                <input
                  type="number"
                  value={offerForm.rabatt_prozent}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, rabatt_prozent: parseFloat(e.target.value) || 0 }))}
                  style={{ width: '200px', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
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
                  <span>MwSt. ({offerForm.mwst_prozent}%):</span>
                  <span>€{mwstBetrag.toFixed(2)}</span>
                </div>
                <hr style={{ margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                  <span>Brutto:</span>
                  <span>€{brutto.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bemerkungen */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bemerkungen</label>
              <textarea
                value={offerForm.bemerkungen}
                onChange={(e) => setOfferForm(prev => ({ ...prev, bemerkungen: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Zusätzliche Bemerkungen zum Angebot..."
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setActiveView('list')}
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
                onClick={saveOffer}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Angebot speichern
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Angebotsmodul</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Angebote erstellen, verwalten und versenden</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <button
          onClick={() => setActiveView('create')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Neues Angebot
        </button>
        
        <select
          value={filterKundenId}
          onChange={(e) => setFilterKundenId(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            minWidth: '250px'
          }}
        >
          <option value="">Alle Kunden anzeigen</option>
          {clients.map(client => (
            <option key={client.id || client.kundennummer} value={client.kundennummer}>
              {client.kundennummer} - {client.firmenname}
            </option>
          ))}
        </select>
      </div>

      {/* Service Requests für Angebotserstellung */}
      {serviceRequests.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Serviceanfragen → Angebot erstellen</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {serviceRequests.slice(0, 3).map(sr => (
              <div key={sr.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}>
                <div>
                  <strong>{sr.nummer}</strong> - {sr.kunden_id} - {sr.serviceart}
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {sr.dringlichkeit} | {new Date(sr.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
                <button
                  onClick={() => createOfferFromServiceRequest(sr)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Angebot erstellen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Angebotsliste */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Kunde</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {offers.filter(offer => !filterKundenId || offer.kunden_id === filterKundenId).map(offer => (
              <tr key={offer.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{offer.nummer}</td>
                <td style={{ padding: '12px' }}>{offer.kunden_id}</td>
                <td style={{ padding: '12px' }}>
                  {new Date(offer.created_at).toLocaleDateString('de-DE')}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                  €{offer.brutto?.toFixed(2) || '0.00'}
                </td>
                <td style={{ padding: '12px' }}>
                  {getStatusBadge(offer.status)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => generatePDF(offer)}
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
                    {offer.status === 'entwurf' && (
                      <button
                        onClick={() => sendOffer(offer.id)}
                        style={{
                          padding: '4px 8px',
                          border: 'none',
                          backgroundColor: '#28a745',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Versenden
                      </button>
                    )}
                    {offer.status === 'angenommen' && (
                      <button
                        onClick={() => createInvoiceFromOffer(offer.id)}
                        style={{
                          padding: '4px 8px',
                          border: 'none',
                          backgroundColor: '#ffc107',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Rechnung erstellen
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferModule;