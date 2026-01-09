import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import KundendatenSection from '../formSections/KundendatenSection';
import AnlagendatenSection from '../formSections/AnlagendatenSection';
import ServiceangabenSection from '../formSections/ServiceangabenSection';
import ZusatzinformationenSection from '../formSections/ZusatzinformationenSection';
import RechtlichesSection from '../formSections/RechtlichesSection';
import { saveSubmission } from '../../services/offlineService';

const FormContainer = ({ user }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      kundendaten: {
        kunden_id: user?.kunden_id || '',
        name: 'Max Mustermann',
        telefon: '+49 123 456789',
        email: 'max@example.com'
      }
    }
  });

  const sections = [
    { title: 'Kundendaten', component: KundendatenSection },
    { title: 'Anlagendaten', component: AnlagendatenSection },
    { title: 'Serviceangaben', component: ServiceangabenSection },
    { title: 'Zusatzinformationen', component: ZusatzinformationenSection },
    { title: 'DSGVO-Einverständnis', component: RechtlichesSection }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await saveSubmission(data);
      alert('Serviceanfrage erfolgreich gespeichert!');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Fehler beim Speichern der Anfrage');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <div style={{ 
      marginLeft: '250px', 
      marginTop: '60px',
      padding: '20px',
      maxWidth: '800px',
      margin: '60px auto 0 auto'
    }}>
      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '20px'
      }}>
        {sections.map((section, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }} onClick={() => setCurrentSection(index)}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: index <= currentSection ? '#007bff' : '#e9ecef',
              color: index <= currentSection ? 'white' : '#6c757d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            {index < sections.length - 1 && (
              <div style={{
                width: '40px',
                height: '2px',
                background: '#e9ecef',
                marginLeft: '10px'
              }} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <CurrentSectionComponent 
            register={register} 
            errors={errors} 
            watch={watch}
            setValue={setValue}
          />
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px'
        }}>
          <button
            type="button"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            style={{
              padding: '12px 24px',
              background: currentSection === 0 ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentSection === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Zurück
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentSection(currentSection + 1)}
              style={{
                padding: '12px 24px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Weiter
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                background: isSubmitting ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Speichere...' : 'Serviceanfrage senden'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormContainer;