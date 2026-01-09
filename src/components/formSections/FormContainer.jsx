import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import KundendatenSection from './KundendatenSection';
import AnlagendatenSection from './AnlagendatenSection';
import ServiceangabenSection from './ServiceangabenSection';
import ZusatzinformationenSection from './ZusatzinformationenSection';
import RechtlichesSection from './RechtlichesSection';

// Simple IndexedDB save function
const saveToIndexedDB = async (data) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('heduschkaForms', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('submissions')) {
        const store = db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      
      const addRequest = store.add({
        ...data,
        status: 'pending',
        timestamp: Date.now()
      });
      
      addRequest.onsuccess = () => resolve(addRequest.result);
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
};

const FormContainer = ({ user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      kundendaten: {
        name: 'Max Mustermann',
        kunden_id: user?.kunden_id || 'KUNDE_001',
        telefon: '+49 123 456789',
        email: 'max@example.com'
      },
      anlagendaten: { anlagentyp: '', anlagen_id: '', standort: '' },
      serviceangaben: { serviceart: '', dringlichkeit: 'normal', beschreibung: '', wunschtermin: '' },
      zusatzinformationen: { bemerkungen: '', photos: [] },
      rechtliches: { datenschutz_zustimmung: false, agb_akzeptiert: false }
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // DSGVO validation
      if (!data.rechtliches.datenschutz_zustimmung || !data.rechtliches.agb_akzeptiert) {
        alert('Datenschutz-Zustimmung und AGB-Akzeptanz sind erforderlich!');
        return;
      }

      // Save to IndexedDB
      await saveToIndexedDB({
        formData: data,
        status: 'pending',
        timestamp: Date.now()
      });
      
      alert('Serviceanfrage erfolgreich gespeichert!');
      
      // Reset form
      reset({
        kundendaten: data.kundendaten, // Keep customer data
        anlagendaten: { anlagentyp: '', anlagen_id: '', standort: '' },
        serviceangaben: { serviceart: '', dringlichkeit: 'normal', beschreibung: '', wunschtermin: '' },
        zusatzinformationen: { bemerkungen: '', photos: [] },
        rechtliches: { datenschutz_zustimmung: false, agb_akzeptiert: false }
      });
      
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Fehler beim Speichern der Anfrage');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <KundendatenSection register={register} errors={errors} watch={watch} />
        <AnlagendatenSection register={register} errors={errors} watch={watch} />
        <ServiceangabenSection register={register} errors={errors} watch={watch} />
        <ZusatzinformationenSection register={register} errors={errors} watch={watch} setValue={setValue} />
        <RechtlichesSection register={register} errors={errors} watch={watch} />
        
        <div className="form-section">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '15px 24px',
              backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Speichere...' : 'Sichere Serviceanfrage senden'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;