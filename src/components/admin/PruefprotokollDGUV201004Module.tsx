import React, { useState, useEffect } from 'react';
import { PruefprotokollDGUV201004 } from '../../types/pruefprotokoll';
import { pruefprotokollService } from '../../services/pruefprotokollService';
import { validatePruefprotokoll } from '../../utils/pruefprotokollValidation';

interface PruefprotokollModuleProps {
  serviceAnfrageId: string;
}

const PruefprotokollDGUV201004Module: React.FC<PruefprotokollModuleProps> = ({ serviceAnfrageId }) => {
  const [data, setData] = useState<PruefprotokollDGUV201004 | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [serviceAnfrageId]);

  const loadData = async () => {
    try {
      const existing = await pruefprotokollService.getByServiceRequest(serviceAnfrageId);
      if (existing) {
        setData(existing);
      } else {
        setData({
          id: crypto.randomUUID(),
          service_anfrage_id: serviceAnfrageId,
          kontrollanzeige_aktivkohlefilter: false,
          kontrollanzeige_partikelfilter: false,
          betriebsstundenzaehler_vorhanden: false,
          betriebsanzeige_gruen_sichtbar: false,
          auto_einschaltung_hauptmotor: '',
          hinweisschild_frischluft: '',
          fluchtfiltergeraet_vorhanden: '',
          funkverkehr_vorhanden: '',
          notausstieg_blockiert: '',
          notausstieg_nothammer: '',
          laermgrenzwert_unter_85db: '',
          kabine_abdichtung_ok: '',
          hebeschiebefenster_blockiert: '',
          aussenluft_heizung_abgedichtet: '',
          durchfuehrungen_abgedichtet: '',
          klima_typ_hersteller: '',
          klima_kondensator: '',
          klima_verdampfer: '',
          klima_umluftwirkung: '',
          heizung_typ_hersteller: '',
          heizung_umluftbetrieb: '',
          luftzufuhr_vorhanden: '',
          kaeltemittel: '',
          kompressor: '',
          kaelteanlage_vorhanden: '',
          maengel_bemerkungen: '',
          nachkontrolle_erforderlich: false,
          ort: '',
          protokoll_datum: new Date().toISOString().split('T')[0],
          auftraggeber_unterschrift: '',
          servicetechniker_unterschrift: '',
          created_at: Date.now(),
          updated_at: Date.now()
        });
      }
    } catch (error) {
      setErrors(['Fehler beim Laden des Prüfprotokolls']);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (field: keyof PruefprotokollDGUV201004, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSave = async () => {
    if (!data) return;
    
    const validationErrors = validatePruefprotokoll(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (data.created_at === data.updated_at) {
        await pruefprotokollService.create(data);
      } else {
        await pruefprotokollService.update(data.id, data);
      }
      setErrors([]);
      alert('Prüfprotokoll erfolgreich gespeichert!');
    } catch (error) {
      setErrors(['Fehler beim Speichern']);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const YesNoRadio: React.FC<{ value: string; onChange: (val: string) => void; label: string }> = ({ value, onChange, label }) => (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{label}</label>
      <div style={{ display: 'flex', gap: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input type="radio" checked={value === 'ja'} onChange={() => onChange('ja')} />
          <span>Ja</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input type="radio" checked={value === 'nein'} onChange={() => onChange('nein')} />
          <span>Nein</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input type="radio" checked={value === 'n/a'} onChange={() => onChange('n/a')} />
          <span>N/A</span>
        </label>
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: '20px' }}>Lade Prüfprotokoll...</div>;
  if (!data) return <div style={{ padding: '20px' }}>Kein Prüfprotokoll gefunden</div>;

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }} className="pruefprotokoll-container">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .pruefprotokoll-container { margin: 0; padding: 10px; }
          body { font-size: 11px; }
        }
      `}</style>

      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Prüfprotokoll DGUV 201-004</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            💾 Speichern
          </button>
          <button onClick={handlePrint} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            🖨️ Drucken
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="no-print" style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {errors.map((err, i) => <div key={i}>{err}</div>)}
        </div>
      )}

      {/* Additional Filter / Monitoring */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Additional Filter / Monitoring</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.kontrollanzeige_aktivkohlefilter}
              onChange={(e) => handleUpdate('kontrollanzeige_aktivkohlefilter', e.target.checked)}
            />
            <span>Kontrollanzeige Aktivkohlefilter</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.kontrollanzeige_partikelfilter}
              onChange={(e) => handleUpdate('kontrollanzeige_partikelfilter', e.target.checked)}
            />
            <span>Kontrollanzeige Partikelfilter</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.betriebsstundenzaehler_vorhanden}
              onChange={(e) => handleUpdate('betriebsstundenzaehler_vorhanden', e.target.checked)}
            />
            <span>Betriebsstundenzähler vorhanden</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.betriebsanzeige_gruen_sichtbar}
              onChange={(e) => handleUpdate('betriebsanzeige_gruen_sichtbar', e.target.checked)}
            />
            <span>Betriebsanzeige grün sichtbar</span>
          </label>
        </div>
      </div>

      {/* Sicherheitsmaßnahmen Fahrerkabine */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Sicherheitsmaßnahmen Fahrerkabine</h3>
        <YesNoRadio label="Auto-Einschaltung Hauptmotor" value={data.auto_einschaltung_hauptmotor} onChange={(v) => handleUpdate('auto_einschaltung_hauptmotor', v)} />
        <YesNoRadio label="Hinweisschild Frischluft" value={data.hinweisschild_frischluft} onChange={(v) => handleUpdate('hinweisschild_frischluft', v)} />
        <YesNoRadio label="Fluchtfiltergerät vorhanden" value={data.fluchtfiltergeraet_vorhanden} onChange={(v) => handleUpdate('fluchtfiltergeraet_vorhanden', v)} />
        <YesNoRadio label="Funkverkehr vorhanden" value={data.funkverkehr_vorhanden} onChange={(v) => handleUpdate('funkverkehr_vorhanden', v)} />
        <YesNoRadio label="Notausstieg blockiert" value={data.notausstieg_blockiert} onChange={(v) => handleUpdate('notausstieg_blockiert', v)} />
        <YesNoRadio label="Notausstieg Nothammer" value={data.notausstieg_nothammer} onChange={(v) => handleUpdate('notausstieg_nothammer', v)} />
        <YesNoRadio label="Lärmgrenzwert unter 85dB" value={data.laermgrenzwert_unter_85db} onChange={(v) => handleUpdate('laermgrenzwert_unter_85db', v)} />
      </div>

      {/* Kabinenabdichtung */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Kabinenabdichtung</h3>
        <YesNoRadio label="Kabine Abdichtung OK" value={data.kabine_abdichtung_ok} onChange={(v) => handleUpdate('kabine_abdichtung_ok', v)} />
        <YesNoRadio label="Hebeschiebefenster blockiert" value={data.hebeschiebefenster_blockiert} onChange={(v) => handleUpdate('hebeschiebefenster_blockiert', v)} />
        <YesNoRadio label="Außenluft Heizung abgedichtet" value={data.aussenluft_heizung_abgedichtet} onChange={(v) => handleUpdate('aussenluft_heizung_abgedichtet', v)} />
        <YesNoRadio label="Durchführungen abgedichtet" value={data.durchfuehrungen_abgedichtet} onChange={(v) => handleUpdate('durchfuehrungen_abgedichtet', v)} />
      </div>

      {/* Klimaanlage */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Klimaanlage</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Typ / Hersteller</label>
            <input
              type="text"
              value={data.klima_typ_hersteller}
              onChange={(e) => handleUpdate('klima_typ_hersteller', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>
          <YesNoRadio label="Kondensator" value={data.klima_kondensator} onChange={(v) => handleUpdate('klima_kondensator', v)} />
          <YesNoRadio label="Verdampfer" value={data.klima_verdampfer} onChange={(v) => handleUpdate('klima_verdampfer', v)} />
          <YesNoRadio label="Umluftwirkung" value={data.klima_umluftwirkung} onChange={(v) => handleUpdate('klima_umluftwirkung', v)} />
        </div>
      </div>

      {/* Heizung */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Heizung</h3>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Typ / Hersteller</label>
          <input
            type="text"
            value={data.heizung_typ_hersteller}
            onChange={(e) => handleUpdate('heizung_typ_hersteller', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', marginBottom: '15px' }}
          />
        </div>
        <YesNoRadio label="Umluftbetrieb" value={data.heizung_umluftbetrieb} onChange={(v) => handleUpdate('heizung_umluftbetrieb', v)} />
      </div>

      {/* Luftzufuhr / Kälteanlage */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Luftzufuhr / Kälteanlage</h3>
        <YesNoRadio label="Luftzufuhr vorhanden" value={data.luftzufuhr_vorhanden} onChange={(v) => handleUpdate('luftzufuhr_vorhanden', v)} />
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kältemittel</label>
          <input
            type="text"
            value={data.kaeltemittel}
            onChange={(e) => handleUpdate('kaeltemittel', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', marginBottom: '15px' }}
          />
        </div>
        <YesNoRadio label="Kompressor" value={data.kompressor} onChange={(v) => handleUpdate('kompressor', v)} />
        <YesNoRadio label="Kälteanlage vorhanden" value={data.kaelteanlage_vorhanden} onChange={(v) => handleUpdate('kaelteanlage_vorhanden', v)} />
      </div>

      {/* Abschluss */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Abschluss</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mängel / Bemerkungen</label>
          <textarea
            value={data.maengel_bemerkungen}
            onChange={(e) => handleUpdate('maengel_bemerkungen', e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '15px' }}>
          <input
            type="checkbox"
            checked={data.nachkontrolle_erforderlich}
            onChange={(e) => handleUpdate('nachkontrolle_erforderlich', e.target.checked)}
          />
          <span style={{ fontWeight: '500' }}>Nachkontrolle erforderlich</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Ort *</label>
            <input
              type="text"
              value={data.ort}
              onChange={(e) => handleUpdate('ort', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Protokoll Datum *</label>
            <input
              type="date"
              value={data.protokoll_datum}
              onChange={(e) => handleUpdate('protokoll_datum', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
              required
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Auftraggeber Unterschrift</label>
            <input
              type="text"
              value={data.auftraggeber_unterschrift}
              onChange={(e) => handleUpdate('auftraggeber_unterschrift', e.target.value)}
              placeholder="Name eingeben"
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Servicetechniker Unterschrift *</label>
            <input
              type="text"
              value={data.servicetechniker_unterschrift}
              onChange={(e) => handleUpdate('servicetechniker_unterschrift', e.target.value)}
              placeholder="Name eingeben"
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PruefprotokollDGUV201004Module;
