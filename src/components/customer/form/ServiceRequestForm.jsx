import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../../../services/simple-auth';

const ServiceRequestForm = ({ user }) => {
  const [formData, setFormData] = useState({
    kunden_id: '',
    anlagen_id: '',
    serviceart: '',
    dringlichkeit: 'normal',
    wunschtermin: '',
    zeitfenster: '',
    bemerkungen: '',
    datenschutz: false
  });
  const [customerData, setCustomerData] = useState({});
  const [clients, setClients] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadClients();
    loadInstallations();
    loadDraft();
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    saveDraft();
  }, [formData, attachments]);

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

  const loadCustomerData = async (kundenId) => {
    if (!kundenId) {
      setCustomerData({});
      return;
    }
    
    try {
      const response = await fetch(`/api/kunden/${kundenId}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        setCustomerData(await response.json());
      }
    } catch (error) {
      const client = clients.find(c => c.kundennummer === kundenId);
      if (client) setCustomerData(client);
    }
  };

  const loadInstallations = async () => {
    try {
      const response = await fetch('/api/anlagen', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInstallations(data);
        localStorage.setItem('customer_installations', JSON.stringify(data));
      }
    } catch (error) {
      const cached = localStorage.getItem('customer_installations');
      if (cached) setInstallations(JSON.parse(cached));
    }
  };

  const saveDraft = () => {
    const draft = {
      formData,
      attachments: attachments.map(att => ({ ...att, file: null })),
      timestamp: Date.now()
    };
    localStorage.setItem('service_request_draft', JSON.stringify(draft));
    setIsDraft(true);
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('service_request_draft');
    if (draft) {
      const parsed = JSON.parse(draft);
      setFormData(parsed.formData);
      setIsDraft(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png'].includes(file.type) && 
      attachments.length + files.length <= 5
    );

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachments(prev => [...prev, {
          id: crypto.randomUUID(),
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const validateForm = () => {
    return formData.kunden_id !== '' && formData.serviceart !== '' && formData.dringlichkeit !== '' && formData.datenschutz;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Bitte füllen Sie alle Pflichtfelder aus und stimmen Sie der Datenschutzerklärung zu.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        kunden_id: formData.kunden_id,
        anlagen_id: formData.anlagen_id,
        serviceart: formData.serviceart,
        dringlichkeit: formData.dringlichkeit,
        wunschtermin: formData.wunschtermin || null,
        zeitfenster: formData.zeitfenster || null,
        bemerkungen: formData.bemerkungen
      };

      if (isOffline) {
        const offlineRequest = {
          id: crypto.randomUUID(),
          ...payload,
          attachments,
          created_at: Date.now(),
          synced: false
        };
        
        const pending = JSON.parse(localStorage.getItem('pending_service_requests') || '[]');
        pending.push(offlineRequest);
        localStorage.setItem('pending_service_requests', JSON.stringify(pending));
        
        alert('Serviceanfrage wurde offline gespeichert und wird bei Internetverbindung übertragen.');
      } else {
        const response = await fetch('/api/serviceanfrage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await authService.getValidToken()}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          
          if (attachments.length > 0) {
            const formData = new FormData();
            attachments.forEach(att => {
              formData.append('files', att.file);
            });
            
            await fetch(`/api/serviceanfrage/${result.id}/attachments`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` },
              body: formData
            });
          }
          
          alert('Serviceanfrage wurde erfolgreich übermittelt!');
        } else {
          throw new Error('Übertragung fehlgeschlagen');
        }
      }
      
      localStorage.removeItem('service_request_draft');
      setFormData({
        kunden_id: user?.customer_id || '',
        anlagen_id: '',
        serviceart: '',
        dringlichkeit: 'normal',
        wunschtermin: '',
        zeitfenster: '',
        bemerkungen: '',
        datenschutz: false
      });
      setAttachments([]);
      
    } catch (error) {
      alert('Fehler beim Übertragen der Serviceanfrage');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Serviceanfrage - ${formData.kunden_id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Heduschka GmbH - Serviceanfrage</h1>
            <p>Datum: ${new Date().toLocaleDateString('de-DE')}</p>
          </div>
          
          <div class="section">
            <h2>Kundendaten</h2>
            <div class="field"><span class="label">Kunden-ID:</span> ${formData.kunden_id}</div>
            <div class="field"><span class="label">Firmenname:</span> ${customerData.firmenname || ''}</div>
            <div class="field"><span class="label">Ansprechpartner:</span> ${customerData.ansprechpartner || ''}</div>
            <div class="field"><span class="label">E-Mail:</span> ${customerData.email || ''}</div>
            <div class="field"><span class="label">Telefon:</span> ${customerData.telefon || ''}</div>
          </div>
          
          <div class="section">
            <h2>Anlagendaten</h2>
            <div class="field"><span class="label">Anlagen-ID:</span> ${formData.anlagen_id || 'Nicht ausgewählt'}</div>
          </div>
          
          <div class="section">
            <h2>Service-Details</h2>
            <div class="field"><span class="label">Serviceart:</span> ${formData.serviceart}</div>
            <div class="field"><span class="label">Dringlichkeit:</span> ${formData.dringlichkeit}</div>
            <div class="field"><span class="label">Wunschtermin:</span> ${formData.wunschtermin || 'Nicht angegeben'}</div>
            <div class="field"><span class="label">Zeitfenster:</span> ${formData.zeitfenster || 'Keine Präferenz'}</div>
          </div>
          
          <div class="section">
            <h2>Zusatzinformationen</h2>
            <div class="field"><span class="label">Bemerkungen:</span><br>${formData.bemerkungen || 'Keine Bemerkungen'}</div>
            <div class="field"><span class="label">Anhänge:</span> ${attachments.length} Datei(en)</div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToCSV = () => {
    const csvData = [
      ['Feld', 'Wert'],
      ['Kunden-ID', formData.kunden_id],
      ['Firmenname', customerData.firmenname || ''],
      ['Ansprechpartner', customerData.ansprechpartner || ''],
      ['E-Mail', customerData.email || ''],
      ['Telefon', customerData.telefon || ''],
      ['Anlagen-ID', formData.anlagen_id || 'Nicht ausgewählt'],
      ['Serviceart', formData.serviceart],
      ['Dringlichkeit', formData.dringlichkeit],
      ['Wunschtermin', formData.wunschtermin || 'Nicht angegeben'],
      ['Zeitfenster', formData.zeitfenster || 'Keine Präferenz'],
      ['Bemerkungen', formData.bemerkungen || 'Keine Bemerkungen'],
      ['Anhänge', `${attachments.length} Datei(en)`],
      ['Datum', new Date().toLocaleDateString('de-DE')]
    ];

    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(';')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Serviceanfrage_${formData.kunden_id}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Serviceanfrage</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px',
              backgroundColor: isOffline ? '#dc3545' : '#28a745',
              color: 'white'
            }}>
              {isOffline ? '🔴 Offline' : '🟢 Online'}
            </span>
            {isDraft && (
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                backgroundColor: '#ffc107',
                color: '#000'
              }}>
                💾 Entwurf gespeichert
              </span>
            )}
          </div>
        </div>

        {/* Single Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          {/* Kundendaten */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>1. Kundendaten</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kunden-ID auswählen *</label>
              <select
                value={formData.kunden_id}
                onChange={(e) => {
                  handleInputChange('kunden_id', e.target.value);
                  loadCustomerData(e.target.value);
                }}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
              >
                <option value="">Kunde auswählen...</option>
                {clients.map(client => (
                  <option key={client.id || client.kundennummer} value={client.kundennummer}>
                    {client.kundennummer} - {client.firmenname}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.kunden_id && (
              <>
                <small style={{ color: '#6c757d', fontSize: '12px', display: 'block', marginBottom: '15px' }}>Diese Daten können nur vom Administrator geändert werden</small>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Firmenname</label>
                    <input type="text" value={customerData.firmenname || ''} readOnly style={{ backgroundColor: '#f8f9fa', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Ansprechpartner</label>
                    <input type="text" value={customerData.ansprechpartner || ''} readOnly style={{ backgroundColor: '#f8f9fa', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>E-Mail</label>
                    <input type="email" value={customerData.email || ''} readOnly style={{ backgroundColor: '#f8f9fa', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Telefon</label>
                    <input type="tel" value={customerData.telefon || ''} readOnly style={{ backgroundColor: '#f8f9fa', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Anlagendaten */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>2. Anlagendaten</h3>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Anlage auswählen</label>
              <select 
                value={formData.anlagen_id} 
                onChange={(e) => handleInputChange('anlagen_id', e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
              >
                <option value="">Bitte wählen (optional)...</option>
                {installations.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.standort} - {inst.filtertyp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service-Details */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>3. Service-Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Serviceart *</label>
                <select 
                  value={formData.serviceart} 
                  onChange={(e) => handleInputChange('serviceart', e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                >
                  <option value="">Bitte wählen...</option>
                  <option value="Filterwechsel">Filterwechsel</option>
                  <option value="Wartung">Wartung</option>
                  <option value="Störung">Störung</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Dringlichkeit *</label>
                <select 
                  value={formData.dringlichkeit} 
                  onChange={(e) => handleInputChange('dringlichkeit', e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                >
                  <option value="normal">Normal</option>
                  <option value="dringend">Dringend</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Wunschtermin</label>
                <input 
                  type="date" 
                  value={formData.wunschtermin}
                  onChange={(e) => handleInputChange('wunschtermin', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Zeitfenster</label>
                <select 
                  value={formData.zeitfenster} 
                  onChange={(e) => handleInputChange('zeitfenster', e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                >
                  <option value="">Keine Präferenz</option>
                  <option value="08:00-12:00">08:00 - 12:00</option>
                  <option value="12:00-16:00">12:00 - 16:00</option>
                  <option value="16:00-18:00">16:00 - 18:00</option>
                </select>
              </div>
            </div>
          </div>

          {/* Zusatzinformationen */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>4. Zusatzinformationen</h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bemerkungen</label>
              <textarea 
                value={formData.bemerkungen}
                onChange={(e) => handleInputChange('bemerkungen', e.target.value)}
                rows="4"
                placeholder="Zusätzliche Informationen zur Serviceanfrage..."
                style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', resize: 'vertical' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Fotos ({attachments.length}/5)</label>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/jpeg,image/png"
                onChange={handleFileUpload}
                style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                {attachments.map(att => (
                  <div key={att.id} style={{ position: 'relative' }}>
                    <img 
                      src={att.preview} 
                      alt={att.name}
                      style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <button 
                      onClick={() => removeAttachment(att.id)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Datenschutz */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>5. Datenschutz & Bestätigung</h3>
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.datenschutz}
                  onChange={(e) => handleInputChange('datenschutz', e.target.checked)}
                  required
                  style={{ marginTop: '2px' }}
                />
                <span style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der 
                  Datenschutzerklärung zu und erteile meine Einwilligung zur Kontaktaufnahme 
                  bezüglich dieser Serviceanfrage. *
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={exportToPDF}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #17a2b8',
                  backgroundColor: 'transparent',
                  color: '#17a2b8',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📄 Als PDF drucken
              </button>
              
              <button
                onClick={exportToCSV}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #28a745',
                  backgroundColor: 'transparent',
                  color: '#28a745',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📊 Als CSV exportieren
              </button>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!validateForm() || isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: validateForm() && !isSubmitting ? '#007bff' : '#6c757d',
                color: 'white',
                borderRadius: '4px',
                cursor: validateForm() && !isSubmitting ? 'pointer' : 'not-allowed'
              }}
            >
              {isSubmitting ? 'Wird übertragen...' : 'Serviceanfrage senden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;