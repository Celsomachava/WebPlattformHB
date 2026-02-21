import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../../../services/simple-auth';

const ServiceRequestForm = ({ user, preSelectedAsset }) => {
  const [formData, setFormData] = useState({
    kunden_id: user?.id || user?.kundennummer || user?.customer_id || user?.kunden_id || '',
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
  const isAdmin = user?.role === 'admin' || user?.id === 'ADMIN_001';

  useEffect(() => {
    const kundenId = user?.customer_id || user?.kunden_id || user?.kundennummer || user?.id;
    if (kundenId) {
      setFormData(prev => ({ ...prev, kunden_id: kundenId }));
      loadCustomerData(kundenId);
    }
    if (!isCustomer) {
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
          const response = await fetch('http://localhost:3002/api/serviceanfragen', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await authService.getValidToken()}`
            },
            body: JSON.stringify(requestData)
          });
          
          if (response.ok) {
            localStorage.removeItem('service_request_draft');
            alert('Serviceanfrage erfolgreich erstellt!');
            window.location.href = '/customer/dashboard';
            return;
          } else {
            throw new Error('Server error');
          }
        } catch (e) {
          console.error('API error, saving offline:', e);
          const pending = JSON.parse(localStorage.getItem('pending_service_requests') || '[]');
          pending.push(requestData);
          localStorage.setItem('pending_service_requests', JSON.stringify(pending));
          localStorage.removeItem('service_request_draft');
          alert('Serviceanfrage wurde offline gespeichert und wird synchronisiert, sobald Sie online sind.');
          window.location.href = '/customer/dashboard';
        }
      } else {
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
    <div style={{ marginLeft: '-280px', marginTop: '60px', padding: '30px', background: '#f8f9fa', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '28px', fontWeight: '600' }}>Serviceanfrage erstellen</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              padding: '4px 10px', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: '500',
              background: isOffline ? '#dc3545' : '#28a745',
              color: 'white'
            }}>
              {isOffline ? 'Offline' : 'Online'}
            </span>
            {isDraft && (
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '12px',
                fontWeight: '500',
                background: '#ffc107',
                color: '#000'
              }}>
                Entwurf gespeichert
              </span>
            )}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          {/* Customer Filter - Admin Only */}
          {isAdmin && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontSize: '18px', fontWeight: '600', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>Kundenauswahl</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kunde auswählen *</label>
                  <select 
                    value={formData.kunden_id} 
                    onChange={(e) => {
                      const kundenId = e.target.value;
                      setFormData(prev => ({ ...prev, kunden_id: kundenId }));
                      loadCustomerData(kundenId);
                    }}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                  >
                    <option value="">Bitte wählen...</option>
                    {clients.map(client => (
                      <option key={client.kundennummer} value={client.kundennummer}>
                        {client.kundennummer} - {client.firmenname}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Oder Kunden-ID eingeben</label>
                  <input 
                    type="text"
                    value={formData.kunden_id}
                    onChange={(e) => {
                      const kundenId = e.target.value;
                      setFormData(prev => ({ ...prev, kunden_id: kundenId }));
                      if (kundenId) loadCustomerData(kundenId);
                    }}
                    placeholder="z.B. KUNDE_001"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Kundendaten */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontSize: '18px', fontWeight: '600', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>1. Kundendaten</h3>
            
            {formData.kunden_id && customerData.firmenname && (
              <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '20px', border: '1px solid #dee2e6' }}>
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Kunden-ID</div>
                  <div style={{ fontSize: '16px', color: '#2c3e50', fontWeight: '600' }}>{formData.kunden_id}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Firmenname</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>{customerData.firmenname}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Ansprechpartner</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>{customerData.ansprechpartner}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>E-Mail</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>{customerData.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Telefon</div>
                    <div style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>{customerData.telefon}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Anlagendaten */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontSize: '18px', fontWeight: '600', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>2. Anlagendaten</h3>
            
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
            <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontSize: '18px', fontWeight: '600', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>3. Service-Details</h3>
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
            <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontSize: '18px', fontWeight: '600', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>4. Zusatzinformationen</h3>
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
            <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontSize: '18px', fontWeight: '600', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>5. Datenschutz & Bestätigung</h3>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', borderTop: '1px solid #e9ecef' }}>
            <button
              onClick={handleSubmit}
              disabled={!validateForm() || isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: validateForm() && !isSubmitting ? '#007bff' : '#6c757d',
                color: 'white',
                borderRadius: '4px',
                cursor: validateForm() && !isSubmitting ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500'
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
