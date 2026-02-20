import React, { useState, useEffect } from 'react';
import { authService } from '../../services/simple-auth';
import { apiService } from '../../services/api';
import { API_BASE_URL } from '../../config/api';

const AnlageAnlegen = ({ user }) => {
  const [anlageForm, setAnlageForm] = useState({
    anlagen_id: '',
    kunden_id: '',
    standort: '',
    filtertyp: '',
    qr_code_id: ''
  });
  const [clients, setClients] = useState([]);
  const [anlagen, setAnlagen] = useState([]);
  const [filteredAnlagen, setFilteredAnlagen] = useState([]);
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingAnlage, setEditingAnlage] = useState(null);
  const isCustomer = user?.role !== 'admin' && user?.role !== 'ADMIN_001' && user?.id !== 'ADMIN_001';

  useEffect(() => {
    const initData = async () => {
      if (isCustomer) {
        const userId = user?.id || user?.kundennummer || user?.customer_id || user?.kunden_id;
        setAnlageForm(prev => ({ ...prev, kunden_id: userId }));
      } else {
        await loadClients();
      }
      await loadAnlagen();
      await generateAnlagenId();
    };
    
    initData();
  }, []);

  const loadClients = async () => {
    // Only load clients if user is admin
    if (user?.role !== 'admin') {
      return;
    }
    
    try {
      const data = await apiService.getCustomers();
      setClients(data);
      return;
    } catch (error) {
      console.error('Error loading clients:', error);
    }
    
    // Fallback to localStorage
    const cached = localStorage.getItem('admin_clients');
    const pending = JSON.parse(localStorage.getItem('pending_customers') || '[]');
    
    let allClients = [];
    if (cached) allClients = JSON.parse(cached);
    
    // Remove duplicates by kundennummer
    const uniqueClients = [...allClients, ...pending].reduce((acc, client) => {
      if (!acc.find(c => c.kundennummer === client.kundennummer)) {
        acc.push(client);
      }
      return acc;
    }, []);
    
    setClients(uniqueClients);
  };

  const loadAnlagen = async () => {
    try {
      const token = await authService.getValidToken();
      const response = await fetch(`${API_BASE_URL}/anlagen`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Loaded anlagen from database:', data);
      
      setAnlagen(data);
      setFilteredAnlagen(data);
      localStorage.setItem('customer_installations', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading anlagen from database:', error);
      
      // Fallback to localStorage
      const cached = localStorage.getItem('customer_installations');
      const pending = JSON.parse(localStorage.getItem('pending_anlagen') || '[]');
      
      let allAnlagen = [];
      if (cached) allAnlagen = JSON.parse(cached);
      if (pending.length > 0) allAnlagen = [...allAnlagen, ...pending];
      
      setAnlagen(allAnlagen);
      setFilteredAnlagen(allAnlagen);
    }
  };

  const generateAnlagenId = async () => {
    try {
      const token = await authService.getValidToken();
      const response = await fetch(`${API_BASE_URL}/anlagen`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let allAnlagen = [];
      if (response.ok) {
        allAnlagen = await response.json();
      }
      
      const pending = JSON.parse(localStorage.getItem('pending_anlagen') || '[]');
      const combined = [...allAnlagen, ...pending];
      
      const maxId = combined.reduce((max, anlage) => {
        const match = anlage.anlagen_id?.match(/^ANL-(\d+)$/);
        if (match) {
          const num = parseInt(match[1]);
          return num > max ? num : max;
        }
        return max;
      }, 0);
      
      const nextId = maxId + 1;
      const anlagenId = `ANL-${nextId}`;
      setAnlageForm(prev => ({ ...prev, anlagen_id: anlagenId }));
    } catch (error) {
      console.error('Error generating Anlagen ID:', error);
      setAnlageForm(prev => ({ ...prev, anlagen_id: 'ANL-1' }));
    }
  };

  const handleInputChange = (field, value) => {
    setAnlageForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!anlageForm.kunden_id) {
      setMessage('Bitte wählen Sie einen Kunden aus.');
      return false;
    }
    if (!anlageForm.standort.trim()) {
      setMessage('Standort der Anlage ist erforderlich.');
      return false;
    }
    if (!anlageForm.filtertyp.trim()) {
      setMessage('Filtertyp ist erforderlich.');
      return false;
    }
    if (!anlageForm.qr_code_id.trim()) {
      setMessage('QR-Code-ID ist erforderlich.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const newAnlage = await apiService.request('/anlagen', {
        method: 'POST',
        body: JSON.stringify({
          ...anlageForm,
          created_at: Date.now(),
          created_by: user?.id
        })
      });

      setMessage('Anlage wurde erfolgreich angelegt!');
      
      await loadAnlagen();
      
      setAnlageForm({
        anlagen_id: '',
        kunden_id: isCustomer ? (user?.id || user?.kundennummer || user?.customer_id || user?.kunden_id) : '',
        standort: '',
        filtertyp: '',
        qr_code_id: ''
      });
      await generateAnlagenId();
    } catch (error) {
      if (error.message.includes('qr_code_id')) {
        setMessage('QR-Code-ID existiert bereits. Bitte verwenden Sie eine andere ID.');
        setIsSubmitting(false);
        return;
      } else if (error.message.includes('duplicate')) {
        setMessage('Eine Anlage mit diesem Standort existiert bereits für diesen Kunden.');
        setIsSubmitting(false);
        return;
      }
      const offlineAnlage = {
        id: crypto.randomUUID(),
        ...anlageForm,
        created_at: Date.now(),
        created_by: user?.id,
        synced: false
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_anlagen') || '[]');
      pending.push(offlineAnlage);
      localStorage.setItem('pending_anlagen', JSON.stringify(pending));
      
      setMessage('Anlage erfolgreich angelegt.');
      
      await loadAnlagen();
      
      setAnlageForm({
        anlagen_id: '',
        kunden_id: isCustomer ? (user?.id || user?.kundennummer || user?.customer_id || user?.kunden_id) : '',
        standort: '',
        filtertyp: '',
        qr_code_id: ''
      });
      await generateAnlagenId();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEditingAnlage(null);
    setAnlageForm({
      anlagen_id: '',
      kunden_id: isCustomer ? (user?.customer_id || user?.kunden_id) : '',
      standort: '',
      filtertyp: '',
      qr_code_id: ''
    });
    setMessage('');
    generateAnlagenId();
  };

  const filterAssets = () => {
    let filtered = anlagen;
    
    if (assetSearchTerm) {
      filtered = filtered.filter(a => 
        a.anlagen_id?.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
        a.standort?.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
        a.filtertyp?.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
        a.qr_code_id?.toLowerCase().includes(assetSearchTerm.toLowerCase())
      );
    }
    
    setFilteredAnlagen(filtered);
  };

  useEffect(() => {
    filterAssets();
  }, [assetSearchTerm, anlagen]);

  const editAnlage = (anlage) => {
    setEditingAnlage(anlage);
    setAnlageForm({ ...anlage });
  };

  const updateAnlage = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const updatedAnlagen = anlagen.map(a => 
      a.id === editingAnlage.id ? { ...editingAnlage, ...anlageForm, updated_at: Date.now() } : a
    );
    setAnlagen(updatedAnlagen);
    
    const allAnlagen = JSON.parse(localStorage.getItem('customer_installations') || '[]');
    const updatedAll = allAnlagen.map(a => 
      a.id === editingAnlage.id ? { ...editingAnlage, ...anlageForm, updated_at: Date.now() } : a
    );
    localStorage.setItem('customer_installations', JSON.stringify(updatedAll));
    
    setMessage('Anlage wurde erfolgreich aktualisiert!');
    setIsSubmitting(false);
    handleReset();
  };

  const deleteAnlage = async (anlageId) => {
    if (!window.confirm('Möchten Sie diese Anlage wirklich löschen?')) return;

    const updatedAnlagen = anlagen.filter(a => a.id !== anlageId);
    setAnlagen(updatedAnlagen);
    
    const allAnlagen = JSON.parse(localStorage.getItem('customer_installations') || '[]');
    const updatedAll = allAnlagen.filter(a => a.id !== anlageId);
    localStorage.setItem('customer_installations', JSON.stringify(updatedAll));
    
    alert('Anlage wurde gelöscht!');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '1200px', width: '100%' }}>
      {/* Left side - Form */}
      <div>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Anlage anlegen</h1>
          <p style={{ color: '#6c757d', margin: 0 }}>Erfassen Sie die Anlagendaten für einen Kunden</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <form onSubmit={editingAnlage ? updateAnlage : handleSubmit}>
            <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Anlagen-ID (systemgeführt)
                </label>
                <input
                  type="text"
                  value={anlageForm.anlagen_id}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: '#e9ecef',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              {!isCustomer && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Kunde auswählen *
                  </label>
                  <select
                    value={anlageForm.kunden_id}
                    onChange={(e) => handleInputChange('kunden_id', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Bitte wählen...</option>
                    {clients.map(client => (
                      <option key={client.id || client.kundennummer} value={client.kundennummer}>
                        {client.kundennummer} - {client.firmenname}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {isCustomer && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Kunde
                  </label>
                  <input
                    type="text"
                    value={user?.firmenname || user?.name || anlageForm.kunden_id}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#e9ecef',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Standort der Anlage *
                </label>
                <input
                  type="text"
                  value={anlageForm.standort}
                  onChange={(e) => handleInputChange('standort', e.target.value)}
                  placeholder="z.B. Halle 1, Produktionslinie A"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Filtertyp *
                </label>
                <input
                  type="text"
                  value={anlageForm.filtertyp}
                  onChange={(e) => handleInputChange('filtertyp', e.target.value)}
                  placeholder="z.B. HEPA H13, Aktivkohlefilter"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  QR-Code-ID *
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={anlageForm.qr_code_id}
                    onChange={(e) => handleInputChange('qr_code_id', e.target.value)}
                    placeholder="QR-Code scannen oder manuell eingeben"
                    required
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const qr = prompt('QR-Code scannen oder eingeben:');
                      if (qr) handleInputChange('qr_code_id', qr);
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Scannen
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <div style={{
                padding: '12px',
                marginBottom: '20px',
                borderRadius: '4px',
                backgroundColor: message.includes('erfolgreich') ? '#d4edda' : '#f8d7da',
                color: message.includes('erfolgreich') ? '#155724' : '#721c24',
                border: `1px solid ${message.includes('erfolgreich') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {message}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #6c757d',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Zurücksetzen
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Wird gespeichert...' : editingAnlage ? 'Anlage aktualisieren' : 'Anlage anlegen'}
              </button>
            </div>
          </form>
        </div>

        <div style={{
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
          padding: '15px',
          fontSize: '14px',
          color: '#0c5460'
        }}>
          <strong>Hinweis:</strong> Die Anlage wird sofort nach dem Speichern für Serviceanfragen verfügbar sein.
        </div>
      </div>

      {/* Right side - Anlagen List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Vorhandene Anlagen</h2>
            <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>Übersicht aller angelegten Anlagen ({filteredAnlagen.length})</p>
          </div>
          <button
            onClick={loadAnlagen}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Aktualisieren
          </button>
        </div>

        {/* Asset Filter Section */}
        {!isCustomer && clients.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Anlagen durchsuchen
            </label>
            <input
              type="text"
              placeholder="Suche nach Anlagen-ID, Standort, Filtertyp oder QR-Code..."
              value={assetSearchTerm}
              onChange={(e) => setAssetSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            {assetSearchTerm && (
              <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
                {filteredAnlagen.length} von {anlagen.length} Anlagen angezeigt
              </div>
            )}
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          {filteredAnlagen.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#6c757d' }}>
              {anlagen.length === 0 ? 'Noch keine Anlagen vorhanden' : 'Keine Anlagen gefunden'}
            </div>
          ) : (
            filteredAnlagen.map(anlage => (
              <div key={anlage.id} style={{
                padding: '20px',
                borderBottom: '1px solid #dee2e6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#007bff', fontSize: '16px' }}>{anlage.anlagen_id}</strong>
                    </div>
                    <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                      {!isCustomer && (
                        <div>
                          <span style={{ color: '#6c757d' }}>Kunde:</span> {anlage.kunden_id}
                        </div>
                      )}
                      <div>
                        <span style={{ color: '#6c757d' }}>Standort:</span> {anlage.standort}
                      </div>
                      <div>
                        <span style={{ color: '#6c757d' }}>Filtertyp:</span> {anlage.filtertyp}
                      </div>
                      <div>
                        <span style={{ color: '#6c757d' }}>QR-Code:</span> {anlage.qr_code_id}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                    <button
                      onClick={() => editAnlage(anlage)}
                      style={{
                        padding: '6px 12px',
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
                      onClick={() => deleteAnlage(anlage.id)}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnlageAnlegen;
