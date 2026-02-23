import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';
import { invoiceHistoryService } from '../../services/offerHistoryService';
import { API_BASE_URL } from '../../config/api';

const InvoiceModule = ({ user }) => {
  const [activeView, setActiveView] = useState('list');
  const [invoices, setInvoices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientOffers, setClientOffers] = useState([]);
  const [filterKundenId, setFilterKundenId] = useState('');

  const [invoiceForm, setInvoiceForm] = useState({
    nummer: '',
    kunden_id: '',
    angebot_id: '',
    positionen: [],
    mwst_prozent: 19,
    zahlungsbedingungen: 'Zahlbar innerhalb 14 Tagen ohne Abzug',
    faellig_am: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bemerkungen: ''
  });

  const statusOptions = [
    { value: 'offen', label: 'Offen' },
    { value: 'bezahlt', label: 'Bezahlt' },
    { value: 'ueberfaellig', label: 'Überfällig' },
    { value: 'storniert', label: 'Storniert' }
  ];

  const mwstOptions = [
    { value: 19, label: '19%' },
    { value: 7, label: '7%' },
    { value: 0, label: '0%' }
  ];

  useEffect(() => {
    let timeoutId;
    const loadInvoices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/invoices`, {
          headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
        });
        if (response.ok) {
          const data = await response.json();
          const parsed = data.map(inv => ({
            ...inv,
            positionen: typeof inv.positionen === 'string' ? JSON.parse(inv.positionen) : inv.positionen,
            netto: parseFloat(inv.netto) || 0,
            mwst_betrag: parseFloat(inv.mwst) || 0,
            brutto: parseFloat(inv.brutto) || 0,
            faellig_am: inv.faellig_am ? new Date(inv.faellig_am).toLocaleDateString('de-DE') : ''
          }));
          setInvoices(parsed);
          localStorage.setItem('admin_invoices', JSON.stringify(parsed));
        }
      } catch (error) {
        const cached = localStorage.getItem('admin_invoices');
        const pending = JSON.parse(localStorage.getItem('pending_invoices') || '[]');
        
        let allInvoices = [];
        if (cached) allInvoices = JSON.parse(cached);
        if (pending.length > 0) {
          const uniquePending = pending.filter(p => 
            !allInvoices.some(inv => inv.id === p.id)
          );
          allInvoices = [...allInvoices, ...uniquePending];
        }
        
        const parsed = allInvoices.map(inv => ({
          ...inv,
          positionen: typeof inv.positionen === 'string' ? JSON.parse(inv.positionen) : inv.positionen,
          netto: parseFloat(inv.netto) || 0,
          mwst_betrag: parseFloat(inv.mwst) || 0,
          brutto: parseFloat(inv.brutto) || 0,
          faellig_am: inv.faellig_am ? new Date(inv.faellig_am).toLocaleDateString('de-DE') : ''
        }));
        setInvoices(parsed);
      }
    };

    const loadAcceptedOffers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/offers?status=angenommen`, {
          headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
        });
        if (response.ok) {
          const data = await response.json();
          const parsed = data.map(o => ({
            ...o,
            positionen: typeof o.positionen === 'string' ? JSON.parse(o.positionen) : o.positionen,
            netto: parseFloat(o.netto) || 0,
            mwst_betrag: parseFloat(o.mwst) || 0,
            brutto: parseFloat(o.brutto) || 0
          }));
          const uninvoiced = parsed.filter(offer => 
            !offer.invoiced && !invoices.some(inv => inv.angebot_id === offer.id)
          );
          setOffers(uninvoiced);
        }
      } catch (error) {
        const cached = localStorage.getItem('admin_offers');
        if (cached) {
          const allOffers = JSON.parse(cached);
          const acceptedOffers = allOffers.map(o => ({
            ...o,
            positionen: typeof o.positionen === 'string' ? JSON.parse(o.positionen) : o.positionen,
            netto: parseFloat(o.netto) || 0,
            mwst_betrag: parseFloat(o.mwst) || 0,
            brutto: parseFloat(o.brutto) || 0
          })).filter(o => 
            o.status === 'angenommen' && 
            !o.invoiced && 
            !invoices.some(inv => inv.angebot_id === o.id)
          );
          setOffers(acceptedOffers);
        }
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

    const loadAll = async () => {
      await loadInvoices();
      await loadAcceptedOffers();
      await loadClients();
    };

    timeoutId = setTimeout(loadAll, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = data.map(inv => ({
          ...inv,
          positionen: typeof inv.positionen === 'string' ? JSON.parse(inv.positionen) : inv.positionen,
          netto: parseFloat(inv.netto) || 0,
          mwst_betrag: parseFloat(inv.mwst) || 0,
          brutto: parseFloat(inv.brutto) || 0,
          faellig_am: inv.faellig_am ? new Date(inv.faellig_am).toLocaleDateString('de-DE') : ''
        }));
        setInvoices(parsed);
        localStorage.setItem('admin_invoices', JSON.stringify(parsed));
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_invoices');
      if (cached) {
        const parsed = JSON.parse(cached).map(inv => ({
          ...inv,
          positionen: typeof inv.positionen === 'string' ? JSON.parse(inv.positionen) : inv.positionen,
          netto: parseFloat(inv.netto) || 0,
          mwst_betrag: parseFloat(inv.mwst) || 0,
          brutto: parseFloat(inv.brutto) || 0,
          faellig_am: inv.faellig_am ? new Date(inv.faellig_am).toLocaleDateString('de-DE') : ''
        }));
        setInvoices(parsed);
      }
    }
  };

  const loadAcceptedOffers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/offers?status=angenommen`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = data.map(o => ({
          ...o,
          positionen: typeof o.positionen === 'string' ? JSON.parse(o.positionen) : o.positionen,
          netto: parseFloat(o.netto) || 0,
          mwst_betrag: parseFloat(o.mwst) || 0,
          brutto: parseFloat(o.brutto) || 0
        }));
        const uninvoiced = parsed.filter(offer => 
          !offer.invoiced && !invoices.some(inv => inv.angebot_id === offer.id)
        );
        setOffers(uninvoiced);
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_offers');
      if (cached) {
        const allOffers = JSON.parse(cached);
        const acceptedOffers = allOffers.map(o => ({
          ...o,
          positionen: typeof o.positionen === 'string' ? JSON.parse(o.positionen) : o.positionen,
          netto: parseFloat(o.netto) || 0,
          mwst_betrag: parseFloat(o.mwst) || 0,
          brutto: parseFloat(o.brutto) || 0
        })).filter(o => 
          o.status === 'angenommen' && 
          !o.invoiced && 
          !invoices.some(inv => inv.angebot_id === o.id)
        );
        setOffers(acceptedOffers);
      }
    }
  };

  const loadOffersByClient = async (kundenId) => {
    if (!kundenId) {
      setClientOffers([]);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/offers?kunden_id=${kundenId}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = data.map(o => ({
          ...o,
          positionen: typeof o.positionen === 'string' ? JSON.parse(o.positionen) : o.positionen,
          netto: parseFloat(o.netto) || 0,
          mwst_betrag: parseFloat(o.mwst) || 0,
          brutto: parseFloat(o.brutto) || 0
        }));
        const validOffers = parsed.filter(offer => 
          (offer.status === 'angenommen' || offer.status === 'versendet') &&
          !invoices.some(inv => inv.angebot_id === offer.id)
        );
        setClientOffers(validOffers);
      }
    } catch (error) {
      const cached = localStorage.getItem('admin_offers');
      if (cached) {
        const allOffers = JSON.parse(cached);
        const clientValidOffers = allOffers.map(o => ({
          ...o,
          positionen: typeof o.positionen === 'string' ? JSON.parse(o.positionen) : o.positionen,
          netto: parseFloat(o.netto) || 0,
          mwst_betrag: parseFloat(o.mwst) || 0,
          brutto: parseFloat(o.brutto) || 0
        })).filter(o => 
          o.kunden_id === kundenId && 
          (o.status === 'angenommen' || o.status === 'versendet') && 
          !invoices.some(inv => inv.angebot_id === o.id)
        );
        setClientOffers(clientValidOffers);
      }
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const existingNumbers = invoices
      .filter(inv => inv.nummer?.startsWith(`RE-${year}-`))
      .map(inv => {
        const match = inv.nummer.match(/RE-\d{4}-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    return `RE-${year}-${String(maxNumber + 1).padStart(4, '0')}`;
  };

  const createInvoiceFromOffer = (offer) => {
    const client = clients.find(c => c.kundennummer === offer.kunden_id);
    setInvoiceForm({
      nummer: generateInvoiceNumber(),
      kunden_id: offer.kunden_id,
      angebot_id: offer.id,
      positionen: offer.positionen || [],
      mwst_prozent: offer.mwst_prozent || 19,
      zahlungsbedingungen: 'Zahlbar innerhalb 14 Tagen ohne Abzug',
      faellig_am: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bemerkungen: `Rechnung basierend auf Angebot ${offer.nummer}`,
      customerData: client || {}
    });
    
    setActiveView('create');
  };

  const calculateTotals = () => {
    const positionenSumme = invoiceForm.positionen.reduce((sum, pos) => sum + pos.gesamtpreis, 0);
    const mwstBetrag = positionenSumme * (invoiceForm.mwst_prozent / 100);
    const brutto = positionenSumme + mwstBetrag;
    
    return { netto: positionenSumme, mwstBetrag, brutto };
  };

  const saveInvoice = async () => {
    if (!invoiceForm.kunden_id) {
      alert('Bitte wählen Sie einen Kunden aus.');
      return;
    }
    
    if (!invoiceForm.positionen || invoiceForm.positionen.length === 0) {
      alert('Bitte fügen Sie mindestens eine Position hinzu.');
      return;
    }

    try {
      const { netto, mwstBetrag, brutto } = calculateTotals();
      
      const invoiceData = {
        id: crypto.randomUUID(),
        ...invoiceForm,
        netto,
        mwst_betrag: mwstBetrag,
        brutto,
        status: 'offen',
        created_at: Date.now()
      };

      const cached = JSON.parse(localStorage.getItem('admin_invoices') || '[]');
      cached.push(invoiceData);
      localStorage.setItem('admin_invoices', JSON.stringify(cached));
      
      const pending = JSON.parse(localStorage.getItem('pending_invoices') || '[]');
      pending.push(invoiceData);
      localStorage.setItem('pending_invoices', JSON.stringify(pending));

      // Remove the offer from the list if invoice was created from an offer
      if (invoiceForm.angebot_id) {
        const updatedOffers = offers.filter(o => o.id !== invoiceForm.angebot_id);
        setOffers(updatedOffers);
        
        // Update cached offers to mark as invoiced
        const cachedOffers = JSON.parse(localStorage.getItem('admin_offers') || '[]');
        const updatedCachedOffers = cachedOffers.map(o => 
          o.id === invoiceForm.angebot_id ? { ...o, invoiced: true } : o
        );
        localStorage.setItem('admin_offers', JSON.stringify(updatedCachedOffers));
      }

      try {
        const response = await fetch(`${API_BASE_URL}/invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await authService.getValidToken()}`
          },
          body: JSON.stringify(invoiceData)
        });

        if (response.ok) {
          const result = await response.json();
          
          await invoiceHistoryService.createVersion(result.id, {
            action: 'created',
            data: invoiceData
          }, user?.id);
        }
      } catch (e) {
        console.log('Server update failed, saved offline');
      }
      
      alert('Rechnung wurde erfolgreich erstellt!');
      await loadInvoices();
      await loadAcceptedOffers();
      setActiveView('list');
      resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Fehler beim Erstellen der Rechnung: ' + error.message);
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      );
      setInvoices(updatedInvoices);
      localStorage.setItem('admin_invoices', JSON.stringify(updatedInvoices));
      
      const pending = JSON.parse(localStorage.getItem('pending_invoices') || '[]');
      const updatedPending = pending.map(inv => 
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      );
      localStorage.setItem('pending_invoices', JSON.stringify(updatedPending));

      try {
        const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await authService.getValidToken()}`
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
          await invoiceHistoryService.createVersion(invoiceId, {
            action: 'status_changed',
            old_status: invoices.find(i => i.id === invoiceId)?.status,
            new_status: newStatus,
            timestamp: Date.now()
          }, user?.id);
        }
      } catch (e) {
        console.log('Server update failed, saved offline');
      }
      
      alert(`Rechnungsstatus wurde auf "${newStatus}" geändert.`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Fehler beim Aktualisieren des Status');
    }
  };

  const generatePDF = async (invoice) => {
    try {
      // Check if PDF service is available
      const response = await fetch(`${API_BASE_URL}/invoices/${invoice.id}/pdf`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rechnung_${invoice.nummer}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('PDF generation failed on server');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      
      // Fallback: Open print dialog with invoice data
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const client = clients.find(c => c.kundennummer === invoice.kunden_id);
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Rechnung ${invoice.nummer}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f8f9fa; }
              .totals { text-align: right; margin-top: 20px; }
              .totals div { margin: 5px 0; }
              .brutto { font-size: 18px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Rechnung ${invoice.nummer}</h1>
            <p><strong>Kunde:</strong> ${client?.firmenname || invoice.kunden_id}</p>
            <p><strong>Datum:</strong> ${new Date(invoice.created_at).toLocaleDateString('de-DE')}</p>
            <p><strong>Fällig am:</strong> ${invoice.faellig_am}</p>
            
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Beschreibung</th>
                  <th>Menge</th>
                  <th>Einzelpreis</th>
                  <th>Gesamtpreis</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.positionen.map((pos, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${pos.beschreibung}</td>
                    <td>${pos.menge}</td>
                    <td>€${pos.einzelpreis?.toFixed(2) || '0.00'}</td>
                    <td>€${pos.gesamtpreis?.toFixed(2) || '0.00'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div>Netto: €${invoice.netto?.toFixed(2) || '0.00'}</div>
              <div>MwSt. (${invoice.mwst_prozent}%): €${invoice.mwst_betrag?.toFixed(2) || '0.00'}</div>
              <div class="brutto">Brutto: €${invoice.brutto?.toFixed(2) || '0.00'}</div>
            </div>
            
            <p><strong>Zahlungsbedingungen:</strong> ${invoice.zahlungsbedingungen}</p>
            ${invoice.bemerkungen ? `<p><strong>Bemerkungen:</strong> ${invoice.bemerkungen}</p>` : ''}
            
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        alert('PDF-Generierung nicht verfügbar. Bitte erlauben Sie Pop-ups für diese Seite.');
      }
    }
  };

  const resetForm = () => {
    setInvoiceForm({
      nummer: '',
      kunden_id: '',
      angebot_id: '',
      positionen: [],
      mwst_prozent: 19,
      zahlungsbedingungen: 'Zahlbar innerhalb 14 Tagen ohne Abzug',
      faellig_am: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bemerkungen: ''
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      offen: '#ffc107',
      bezahlt: '#28a745',
      ueberfaellig: '#dc3545',
      storniert: '#6c757d'
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
      <div style={{ 
        padding: '20px',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1>Neue Rechnung erstellen</h1>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Rechnungsnummer</label>
                <input
                  type="text"
                  value={invoiceForm.nummer || generateInvoiceNumber()}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, nummer: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kunden-ID *</label>
                <select
                  value={invoiceForm.kunden_id}
                  onChange={(e) => {
                    setInvoiceForm(prev => ({ ...prev, kunden_id: e.target.value, angebot_id: '' }));
                    loadOffersByClient(e.target.value);
                  }}
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Fällig am</label>
                <input
                  type="date"
                  value={invoiceForm.faellig_am}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, faellig_am: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
              </div>
            </div>

            {/* Angebot auswählen */}
            {invoiceForm.kunden_id && clientOffers.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Angebot auswählen (optional)</label>
                <select
                  value={invoiceForm.angebot_id}
                  onChange={(e) => {
                    const selectedOffer = clientOffers.find(o => o.id === e.target.value);
                    if (selectedOffer) {
                      setInvoiceForm(prev => ({
                        ...prev,
                        angebot_id: selectedOffer.id,
                        positionen: selectedOffer.positionen || [],
                        mwst_prozent: selectedOffer.mwst_prozent || 19
                      }));
                    } else {
                      setInvoiceForm(prev => ({ ...prev, angebot_id: '', positionen: [] }));
                    }
                  }}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                >
                  <option value="">Ohne Angebot erstellen</option>
                  {clientOffers.map(offer => (
                    <option key={offer.id} value={offer.id}>
                      {offer.nummer} - €{offer.brutto?.toFixed(2) || '0.00'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* MwSt und Zahlungsbedingungen */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>MwSt.-Satz</label>
                <select
                  value={invoiceForm.mwst_prozent}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, mwst_prozent: parseInt(e.target.value) }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                >
                  {mwstOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Zahlungsbedingungen</label>
                <input
                  type="text"
                  value={invoiceForm.zahlungsbedingungen}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, zahlungsbedingungen: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
              </div>
            </div>

            {/* Positionen (Read-only wenn aus Angebot) */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>Rechnungspositionen</h3>
              
              {invoiceForm.positionen.map((position, index) => (
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
                    <div style={{ textAlign: 'right' }}>€{position.einzelpreis?.toFixed(2) || '0.00'}</div>
                    <div style={{ textAlign: 'right', fontWeight: '500' }}>€{position.gesamtpreis?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
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
                  <span>MwSt. ({invoiceForm.mwst_prozent}%):</span>
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
                value={invoiceForm.bemerkungen}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, bemerkungen: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Zusätzliche Bemerkungen zur Rechnung..."
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
                onClick={saveInvoice}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Rechnung erstellen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Rechnungsmodul</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Rechnungen erstellen, verwalten und versenden</p>
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
          + Neue Rechnung
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

      {/* Angenommene Angebote für Rechnungserstellung */}
      {offers.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Angenommene Angebote → Rechnung erstellen</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {offers.slice(0, 3).map(offer => (
              <div key={offer.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}>
                <div>
                  <strong>{offer.nummer}</strong> - {offer.kunden_id} - €{offer.brutto?.toFixed(2)}
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    Angenommen | {new Date(offer.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
                <button
                  onClick={() => createInvoiceFromOffer(offer)}
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
                  Rechnung erstellen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rechnungsliste */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nummer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Kunde</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Betrag</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fällig am</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {invoices.filter(invoice => !filterKundenId || invoice.kunden_id === filterKundenId).map(invoice => (
              <tr key={invoice.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{invoice.nummer}</td>
                <td style={{ padding: '12px' }}>{invoice.kunden_id}</td>
                <td style={{ padding: '12px' }}>
                  {new Date(invoice.created_at).toLocaleDateString('de-DE')}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                  €{invoice.brutto?.toFixed(2) || '0.00'}
                </td>
                <td style={{ padding: '12px' }}>{invoice.faellig_am}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={invoice.status}
                    onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                    style={{ padding: '4px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '12px' }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => generatePDF(invoice)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceModule;