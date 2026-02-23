import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';
import { offerHistoryService } from '../../services/offerHistoryService';
import InvoiceStyleForm from './InvoiceStyleForm';
import { API_BASE_URL } from '../../config/api';

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
    const initData = async () => {
      await loadOffers();
      await loadServiceRequests();
      await loadInstallations();
      await loadClients();
    };
    initData();
  }, []);

  const loadOffers = async () => {
    try {
      const token = await authService.getValidToken();
      const response = await fetch(`${API_BASE_URL}/offers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      console.log('Loaded offers from database:', data);
      setOffers(data);
      localStorage.setItem('admin_offers', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading offers:', error);
      const cached = localStorage.getItem('admin_offers');
      if (cached) setOffers(JSON.parse(cached));
    }
  };

  const createInvoiceFromOffer = async (offerId) => {
    if (!window.confirm('Möchten Sie eine Rechnung aus diesem Angebot erstellen?')) return;
    
    const offer = offers.find(o => o.id === offerId);
    if (!offer) {
      alert('Angebot nicht gefunden');
      return;
    }

    // Create invoice data and save to localStorage
    const invoiceData = {
      id: crypto.randomUUID(),
      nummer: `RE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      kunden_id: offer.kunden_id,
      angebot_id: offer.id,
      positionen: offer.positionen || [],
      netto: offer.netto,
      mwst_prozent: offer.mwst_prozent || 19,
      mwst_betrag: offer.mwst_betrag,
      brutto: offer.brutto,
      status: 'offen',
      zahlungsbedingungen: 'Zahlbar innerhalb 14 Tagen ohne Abzug',
      faellig_am: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bemerkungen: `Rechnung basierend auf Angebot ${offer.nummer}`,
      created_at: Date.now(),
      synced: false
    };

    const invoices = JSON.parse(localStorage.getItem('admin_invoices') || '[]');
    invoices.push(invoiceData);
    localStorage.setItem('admin_invoices', JSON.stringify(invoices));

    alert(`Rechnung ${invoiceData.nummer} wurde erstellt! Bitte wechseln Sie zum Rechnungsmodul.`);
    loadOffers();
  };

  const loadServiceRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/serviceanfragen`, {
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
      const response = await fetch(`${API_BASE_URL}/anlagen`, {
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
      const response = await fetch(`${API_BASE_URL}/customer`, {
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
    if (!offerForm.kunden_id) {
      alert('Bitte wählen Sie einen Kunden aus.');
      return;
    }

    try {
      const { netto, mwstBetrag, brutto } = calculateTotals();
      
      const offerData = {
        ...offerForm,
        nummer: offerForm.nummer || generateOfferNumber(),
        netto,
        mwst_betrag: mwstBetrag,
        brutto,
        status: 'entwurf',
        created_at: Date.now(),
        version: 1
      };

      const response = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getValidToken()}`
        },
        body: JSON.stringify(offerData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Create version history (optional)
        try {
          await offerHistoryService.createVersion(result.id, {
            action: 'created',
            data: offerData
          }, user?.id);
        } catch (historyError) {
          console.log('History tracking failed, continuing without history');
        }
        
        alert('Angebot wurde erfolgreich erstellt!');
        loadOffers();
        setActiveView('list');
        resetForm();
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('Save error:', error);
      
      // Offline fallback
      const { netto, mwstBetrag, brutto } = calculateTotals();
      const offlineOffer = {
        id: crypto.randomUUID(),
        ...offerForm,
        nummer: offerForm.nummer || generateOfferNumber(),
        netto,
        mwst_betrag: mwstBetrag,
        brutto,
        status: 'entwurf',
        created_at: Date.now(),
        synced: false
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_offers') || '[]');
      pending.push(offlineOffer);
      localStorage.setItem('pending_offers', JSON.stringify(pending));
      
      const cachedOffers = JSON.parse(localStorage.getItem('admin_offers') || '[]');
      cachedOffers.push(offlineOffer);
      localStorage.setItem('admin_offers', JSON.stringify(cachedOffers));
      
      alert('Angebot wurde offline gespeichert.');
      loadOffers();
      setActiveView('list');
      resetForm();
    }
  };

  const sendOffer = async (offerId) => {
    if (!window.confirm('Möchten Sie dieses Angebot wirklich an den Kunden versenden?')) return;

    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    const updatedOffer = { ...offer, status: 'versendet', sent_at: Date.now() };
    
    // Update local state
    const updatedOffers = offers.map(o => o.id === offerId ? updatedOffer : o);
    setOffers(updatedOffers);
    localStorage.setItem('admin_offers', JSON.stringify(updatedOffers));
    
    // Update database
    try {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getValidToken()}`
        },
        body: JSON.stringify(updatedOffer)
      });
      
      if (response.ok) {
        console.log('Offer sent to database successfully');
      }
    } catch (error) {
      console.log('Database update failed, saved locally:', error);
    }
    
    alert('Angebot wurde als versendet markiert!');
  };

  const editOffer = (offer) => {
    setOfferForm({ ...offer, positionen: offer.positionen || [] });
    setCurrentOffer(offer);
    setActiveView('edit');
  };

  const updateOffer = async () => {
    if (!offerForm.kunden_id) {
      alert('Bitte wählen Sie einen Kunden aus.');
      return;
    }

    const { netto, mwstBetrag, brutto } = calculateTotals();
    const updatedOffer = {
      ...currentOffer,
      ...offerForm,
      netto,
      mwst_betrag: mwstBetrag,
      brutto,
      updated_at: Date.now()
    };
    
    const updatedOffers = offers.map(o => o.id === currentOffer.id ? updatedOffer : o);
    setOffers(updatedOffers);
    localStorage.setItem('admin_offers', JSON.stringify(updatedOffers));
    
    alert('Angebot wurde aktualisiert!');
    setActiveView('list');
    setCurrentOffer(null);
    resetForm();
  };

  const cancelOffer = async (offerId) => {
    if (!window.confirm('Möchten Sie dieses Angebot wirklich stornieren?')) return;

    const updatedOffers = offers.map(o => 
      o.id === offerId ? { ...o, status: 'abgelehnt' } : o
    );
    setOffers(updatedOffers);
    localStorage.setItem('admin_offers', JSON.stringify(updatedOffers));
    
    alert('Angebot wurde storniert.');
  };

  const generatePDF = async (offer) => {
    const printWindow = window.open('', '_blank');
    const { netto, mwstBetrag, brutto } = {
      netto: offer.netto || 0,
      mwstBetrag: offer.mwst_betrag || 0,
      brutto: offer.brutto || 0
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Angebot ${offer.nummer}</title>
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
        <h2>Angebot ${offer.nummer}</h2>
        <p><strong>Kunde:</strong> ${offer.kunden_id}</p>
        <p><strong>Datum:</strong> ${new Date(offer.created_at).toLocaleDateString('de-DE')}</p>
        <p><strong>Gültig bis:</strong> ${offer.gueltig_bis}</p>
        
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
            `).join('') || ''}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Netto:</strong> €${netto.toFixed(2)}</p>
          <p><strong>MwSt. (${offer.mwst_prozent}%):</strong> €${mwstBetrag.toFixed(2)}</p>
          <p><strong>Brutto:</strong> €${brutto.toFixed(2)}</p>
        </div>
        
        ${offer.bemerkungen ? `<p><strong>Bemerkungen:</strong> ${offer.bemerkungen}</p>` : ''}
        
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const resetForm = () => {
    setCurrentOffer(null);
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

  if (activeView === 'create' || activeView === 'edit') {
    return (
      <InvoiceStyleForm
        title="Neues Angebot"
        formData={offerForm}
        setFormData={setOfferForm}
        clients={clients}
        generateNumber={generateOfferNumber}
        addPosition={addPosition}
        updatePosition={updatePosition}
        removePosition={removePosition}
        calculateTotals={calculateTotals}
        onSave={saveOffer}
        onUpdate={updateOffer}
        setActiveView={setActiveView}
        activeView={activeView}
      />
    );
  }

  return (
    <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
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
      {serviceRequests.filter(sr => !offers.some(o => o.service_anfrage_id === sr.id)).length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Serviceanfragen → Angebot erstellen</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {serviceRequests.filter(sr => !offers.some(o => o.service_anfrage_id === sr.id)).slice(0, 3).map(sr => (
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
                  €{(parseFloat(offer.brutto) || 0).toFixed(2)}
                </td>
                <td style={{ padding: '12px' }}>
                  {getStatusBadge(offer.status)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
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
                      <>
                        <button
                          onClick={() => editOffer(offer)}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #ffc107',
                            backgroundColor: 'transparent',
                            color: '#ffc107',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Bearbeiten
                        </button>
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
                        <button
                          onClick={() => cancelOffer(offer.id)}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Stornieren
                        </button>
                      </>
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