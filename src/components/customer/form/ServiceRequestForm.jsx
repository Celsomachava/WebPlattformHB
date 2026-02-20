import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../../../services/simple-auth';

const ServiceRequestForm = ({ user, preSelectedAsset }) => {
  const [formData, setFormData] = useState({
    kunden_id: user?.customer_id || user?.kunden_id || '',
    anlagen_id: preSelectedAsset?.id || '',
    standort: preSelectedAsset?.standort || '',
    filtertyp: preSelectedAsset?.filtertyp || '',
    qr_code: preSelectedAsset?.qr_code_id || '',
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
  const [filteredInstallations, setFilteredInstallations] = useState([]);
  const [selectedAnlage, setSelectedAnlage] = useState(preSelectedAsset || null);
  const [qrError, setQrError] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const isCustomer = user?.role === 'KUNDE_XXX';

  useEffect(() => {
    if (isCustomer) {
      const kundenId = user?.customer_id || user?.kunden_id;
      setFormData(prev => ({ ...prev, kunden_id: kundenId }));
      loadCustomerData(kundenId);
    } else {
      loadClients();
    }
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
      setFilteredInstallations([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/kunden/${kundenId}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
        
        const filtered = installations.filter(inst => inst.kunden_id === kundenId);
        setFilteredInstallations(filtered);
      }
    } catch (error) {
      const client = clients.find(c => c.kundennummer === kundenId);
      if (client) {
        setCustomerData(client);
      } else {
        const cached = localStorage.getItem('admin_clients');
        if (cached) {
          const allClients = JSON.parse(cached);
          const foundClient = allClients.find(c => c.kundennummer === kundenId);
          if (foundClient) {
            setCustomerData(foundClient);
          }
        }
      }
      const filtered = installations.filter(inst => inst.kunden_id === kundenId);
      setFilteredInstallations(filtered);
    }
  };

  const loadInstallations = async () => {
    try {
      const response = await fetch('/api/anlagen', {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        const filtered = isCustomer 
          ? data.filter(a => a.kunden_id === (user?.customer_id || user?.kunden_id))
          : data;
        setInstallations(filtered);
        if (isCustomer) {
          setFilteredInstallations(filtered);
        }
        localStorage.setItem('customer_installations', JSON.stringify(data));
      }
    } catch (error) {
      const cached = localStorage.getItem('customer_installations');
      const pending = JSON.parse(localStorage.getItem('pending_anlagen') || '[]');
      
      let allAnlagen = [];
      if (cached) allAnlagen = JSON.parse(cached);
      if (pending.length > 0) allAnlagen = [...allAnlagen, ...pending];
      
      const filtered = isCustomer 
        ? allAnlagen.filter(a => a.kunden_id === (user?.customer_id || user?.kunden_id))
        : allAnlagen;
      setInstallations(filtered);
      if (isCustomer) {
        setFilteredInstallations(filtered);
      }
    }
  };

  const handleAnlageSelect = (anlageId) => {
    const anlage = filteredInstallations.find(a => a.id === anlageId);
    if (anlage) {
      setSelectedAnlage(anlage);
      setFormData(prev => ({
        ...prev,
        anlagen_id: anlage.id,
        standort: anlage.standort || '',
        filtertyp: anlage.filtertyp || ''
      }));
    } else {
      setSelectedAnlage(null);
      setFormData(prev => ({
        ...prev,
        anlagen_id: '',
        standort: '',
        filtertyp: ''
      }));
    }
  };

  const handleQRCodeScan = async () => {
    const qrCode = formData.qr_code.trim();
    if (!qrCode) return;
    
    setQrError('');
    
    try {
      const response = await fetch(`/api/anlagen/qr/${qrCode}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const anlage = await response.json();
        
        if (anlage.kunden_id !== formData.kunden_id) {
          setQrError('QR-Code gehört nicht zu diesem Kunden');
          return;
        }
        
        setSelectedAnlage(anlage);
        setFormData(prev => ({
          ...prev,
          anlagen_id: anlage.id,
          standort: anlage.standort || '',
          filtertyp: anlage.filtertyp || ''
        }));
        alert('Anlage erfolgreich über QR-Code geladen!');
      } else {
        setQrError('QR-Code ungültig oder nicht gefunden');
      }
    } catch (error) {
      const anlage = installations.find(a => a.qr_code_id === qrCode);
      if (anlage && anlage.kunden_id === formData.kunden_id) {
        setSelectedAnlage(anlage);
        setFormData(prev => ({
          ...prev,
          anlagen_id: anlage.id,
          standort: anlage.standort || '',
          filtertyp: anlage.filtertyp || ''
        }));
        alert('Anlage erfolgreich über QR-Code geladen!');
      } else {
        setQrError('QR-Code ungültig oder nicht diesem Kunden zugeordnet');
      }
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
    if (!formData.kunden_id || !formData.serviceart || !formData.dringlichkeit || !formData.datenschutz) {
      return false;
    }
    
    if (formData.wunschtermin) {
      const selectedDate = new Date(formData.wunschtermin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        alert('Wunschtermin darf nicht in der Vergangenheit liegen');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Bitte füllen Sie alle Pflichtfelder aus und stimmen Sie der Datenschutzerklärung zu.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        id: crypto.randomUUID(),
        nummer: `SR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        kunden_id: formData.kunden_id,
        anlagen_id: formData.anlagen_id || null,
        serviceart: formData.serviceart,
        dringlichkeit: formData.dringlichkeit,
        wunschtermin: formData.wunschtermin || null,
        zeitfenster: formData.zeitfenster || null,
        bemerkungen: formData.bemerkungen,
        status: 'neu',
        created_at: Date.now(),
        synced: false,
        ...customerData
      };

      if (!isOffline) {
        try {
          const response = await fetch('/api/serviceanfrage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await authService.getValidToken()}`
            },
            body: JSON.stringify(requestData)
          });
          
          if (response.ok) {
            // Successfully sent to server
            localStorage.removeItem('service_request_draft');
            window.location.href = '/customer/dashboard';
            return;
          } else {
            throw new Error('Server error');
          }
        } catch (e) {
          console.log('Server update failed, saving offline');
          // Only save to pending if server fails
          const pending = JSON.parse(localStorage.getItem('pending_service_requests') || '[]');
          pending.push(requestData);
          localStorage.setItem('pending_service_requests', JSON.stringify(pending));
          localStorage.removeItem('service_request_draft');
          window.location.href = '/customer/dashboard';
        }
      } else {
        // Offline mode - save to pending
        const pending = JSON.parse(localStorage.getItem('pending_service_requests') || '[]');
        pending.push(requestData);
        localStorage.setItem('pending_service_requests', JSON.stringify(pending));
        localStorage.removeItem('service_request_draft');
        window.location.href = '/customer/dashboard';
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      alert('Fehler beim Senden der Serviceanfrage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              {isOffline ? 'Offline' : 'Online'}
            </span>
            {isDraft && (
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                backgroundColor: '#ffc107',
                color: '#000'
              }}>
                Entwurf gespeichert
              </span>
            )}
          </div>
        </div>

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
            
            {!isCustomer && (
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
            )}
            
            {formData.kunden_id && (
              <>
                <small style={{ color: '#6c757d', fontSize: '12px', display: 'block', marginBottom: '15px' }}>Diese Daten sind schreibgeschützt und können nur vom Administrator geändert werden</small>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kundennummer</label>
                    <input type="text" value={formData.kunden_id} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Firmenname</label>
                    <input type="text" value={customerData.firmenname || ''} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Ansprechpartner</label>
                    <input type="text" value={customerData.ansprechpartner || ''} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>E-Mail</label>
                    <input type="email" value={customerData.email || ''} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Telefon</label>
                    <input type="tel" value={customerData.telefon || ''} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Anlagendaten */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>2. Anlagendaten</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>QR-Code scannen (optional)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text"
                  value={formData.qr_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, qr_code: e.target.value }))}
                  placeholder="QR-Code eingeben oder scannen"
                  style={{ flex: 1, padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
                <button
                  type="button"
                  onClick={handleQRCodeScan}
                  disabled={!formData.kunden_id || !formData.qr_code}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: formData.kunden_id && formData.qr_code ? '#17a2b8' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: formData.kunden_id && formData.qr_code ? 'pointer' : 'not-allowed'
                  }}
                >
                  Scannen
                </button>
              </div>
              {qrError && (
                <div style={{ marginTop: '5px', color: '#dc3545', fontSize: '14px' }}>
                  {qrError}
                </div>
              )}
              {selectedAnlage && selectedAnlage.qr_code_id && (
                <div style={{ marginTop: '5px', color: '#28a745', fontSize: '14px' }}>
                  ✓ QR-Code: {selectedAnlage.qr_code_id}
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Anlage auswählen (optional)</label>
              <select 
                value={formData.anlagen_id} 
                onChange={(e) => handleAnlageSelect(e.target.value)}
                disabled={!formData.kunden_id}
                style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
              >
                <option value="">Bitte wählen...</option>
                {filteredInstallations.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.anlagen_id || inst.id} - {inst.standort}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedAnlage && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Anlagen-ID</label>
                  <input type="text" value={selectedAnlage.anlagen_id || selectedAnlage.id} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Standort</label>
                  <input type="text" value={formData.standort} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Aktueller Filtertyp</label>
                  <input type="text" value={formData.filtertyp} readOnly style={{ backgroundColor: '#e9ecef', width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed' }} />
                </div>
              </div>
            )}
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
