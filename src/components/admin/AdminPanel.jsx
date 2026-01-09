import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';

const AdminPanel = () => {
  const [template, setTemplate] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templateData, storageInfo] = await Promise.all([
        dbService.getTemplate('default'),
        dbService.getStorageInfo()
      ]);
      
      setTemplate(templateData);
      setSubmissions(storageInfo.submissions);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTemplate = async () => {
    const defaultTemplate = {
      id: 'default',
      version: '1.0',
      sections: {
        kundendaten: {
          kunden_id: '',
          name: '',
          ansprechpartner: '',
          telefon: '',
          email: ''
        },
        anlagendaten: {
          anlagen_id: '',
          standort: '',
          anlagentyp: ''
        },
        serviceangaben: {
          serviceart: 'wartung',
          dringlichkeit: 'normal',
          beschreibung: ''
        },
        zusatzinformationen: {
          bemerkungen: '',
          photos: []
        },
        rechtliches: {
          datenschutz_zustimmung: false,
          agb_akzeptiert: false
        }
      },
      created_at: new Date().toISOString()
    };

    try {
      await dbService.saveTemplate(defaultTemplate);
      setTemplate(defaultTemplate);
      alert('Standard-Vorlage erstellt');
    } catch (error) {
      console.error('Failed to create template:', error);
      alert('Fehler beim Erstellen der Vorlage');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Lade Admin-Daten...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Panel - Heduschka Service</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Formular-Vorlage</h2>
        {template ? (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            marginTop: '10px'
          }}>
            <p><strong>Version:</strong> {template.version}</p>
            <p><strong>Erstellt:</strong> {new Date(template.created_at).toLocaleDateString('de-DE')}</p>
            <p><strong>Sektionen:</strong> {Object.keys(template.sections).length}</p>
          </div>
        ) : (
          <div>
            <p>Keine Vorlage gefunden.</p>
            <button 
              onClick={createDefaultTemplate}
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Standard-Vorlage erstellen
            </button>
          </div>
        )}
      </div>

      <div>
        <h2>Statistiken</h2>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px',
          marginTop: '10px'
        }}>
          <p><strong>Gespeicherte Anfragen:</strong> {submissions}</p>
          <p><strong>Status:</strong> Offline-Speicher aktiv</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;