import React, { useState } from 'react';
import { authService } from '../../services/simple-auth';

const KundenAnlegen = ({ user }) => {
  const [customerForm, setCustomerForm] = useState({
    kundennummer: '',
    firmenname: '',
    ansprechpartner: '',
    email: '',
    telefon: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateKundennummer = () => {
    const existingClients = JSON.parse(localStorage.getItem('admin_clients') || '[]');
    const existingNumbers = existingClients
      .map(c => {
        const match = c.kundennummer?.match(/KUNDE_(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `KUNDE_${String(nextNumber).padStart(4, '0')}`;
  };

  const handleInputChange = (field, value) => {
    setCustomerForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return customerForm.kundennummer && 
           customerForm.firmenname && 
           customerForm.ansprechpartner && 
           customerForm.email && 
           customerForm.telefon &&
           customerForm.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('Bitte füllen Sie alle Felder aus.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/kunden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getValidToken()}`
        },
        body: JSON.stringify({
          ...customerForm,
          created_at: Date.now(),
          created_by: user?.id
        })
      });

      if (response.ok) {
        const newCustomer = await response.json();
        alert('Kunde erfolgreich angelegt.');
        setCustomerForm({
          kundennummer: '',
          firmenname: '',
          ansprechpartner: '',
          email: '',
          telefon: '',
          password: ''
        });
        
        // Update cached clients list with transformed data
        const cachedClients = JSON.parse(localStorage.getItem('admin_clients') || '[]');
        const transformedCustomer = {
          id: newCustomer.id,
          kundennummer: newCustomer.id,
          firmenname: newCustomer.company,
          ansprechpartner: newCustomer.name,
          email: newCustomer.email,
          telefon: newCustomer.phone,
          created_at: newCustomer.registeredSince
        };
        cachedClients.push(transformedCustomer);
        localStorage.setItem('admin_clients', JSON.stringify(cachedClients));
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
      } else {
        throw new Error('Fehler beim Anlegen des Kunden');
      }
    } catch (error) {
      // Offline fallback
      const offlineCustomer = {
        id: crypto.randomUUID(),
        ...customerForm,
        created_at: Date.now(),
        created_by: user?.id,
        synced: false
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_customers') || '[]');
      pending.push(offlineCustomer);
      localStorage.setItem('pending_customers', JSON.stringify(pending));
      
      alert('Kunde wurde offline gespeichert und wird bei Internetverbindung übertragen.');
      setCustomerForm({
        kundennummer: '',
        firmenname: '',
        ansprechpartner: '',
        email: '',
        telefon: '',
        password: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Neuen Kunden anlegen</h1>
        <p style={{ color: '#6c757d', margin: 0 }}>Erfassen Sie die Grunddaten für einen neuen Kunden</p>
      </div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Kundennummer *
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={customerForm.kundennummer}
                  onChange={(e) => handleInputChange('kundennummer', e.target.value)}
                  placeholder="z.B. KUNDE_001"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleInputChange('kundennummer', generateKundennummer())}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Generieren
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Firmenname / Name *
              </label>
              <input
                type="text"
                value={customerForm.firmenname}
                onChange={(e) => handleInputChange('firmenname', e.target.value)}
                placeholder="Firmenname oder Privatperson"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Ansprechpartner *
              </label>
              <input
                type="text"
                value={customerForm.ansprechpartner}
                onChange={(e) => handleInputChange('ansprechpartner', e.target.value)}
                placeholder="Name des Ansprechpartners"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                E-Mail-Adresse *
              </label>
              <input
                type="email"
                value={customerForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="kunde@beispiel.de"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Telefonnummer *
              </label>
              <input
                type="tel"
                value={customerForm.telefon}
                onChange={(e) => handleInputChange('telefon', e.target.value)}
                placeholder="+49 123 456789"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Passwort *
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={customerForm.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Passwort für Kundenanmeldung"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleInputChange('password', generatePassword())}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Generieren
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
              onClick={() => {
                setCustomerForm({
                  kundennummer: '',
                  firmenname: '',
                  ansprechpartner: '',
                  email: '',
                  telefon: '',
                  password: ''
                });
                setMessage('');
              }}
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
              disabled={!validateForm() || isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: validateForm() && !isSubmitting ? '#28a745' : '#6c757d',
                color: 'white',
                borderRadius: '4px',
                cursor: validateForm() && !isSubmitting ? 'pointer' : 'not-allowed'
              }}
            >
              {isSubmitting ? 'Wird gespeichert...' : 'Kunde anlegen'}
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
        <strong>Hinweis:</strong> Nach dem Anlegen kann der Kunde sich mit seiner Kundennummer 
        im System anmelden und Serviceanfragen erstellen.
      </div>
    </div>
  );
};

export default KundenAnlegen;