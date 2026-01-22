import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PruefprotokollDGUV201004 } from '../../types/pruefprotokoll';
import { pruefprotokollService } from '../../services/pruefprotokollService';
import { validatePruefprotokoll } from '../../utils/pruefprotokollValidation';
import { PruefprotokollPDF } from './pdf/PruefprotokollPDF';

interface Props {
  serviceAnfrageId: string;
  onBack?: () => void;
}

const PruefprotokollForm: React.FC<Props> = ({ serviceAnfrageId, onBack }) => {
  const [data, setData] = useState<PruefprotokollDGUV201004 | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [serviceAnfrageId]);

  const loadData = async () => {
    try {
      if (serviceAnfrageId === 'new') {
        setData(createEmpty());
      } else {
        const existing = await pruefprotokollService.get(serviceAnfrageId);
        if (existing) {
          setData(existing);
        } else {
          setData(createEmpty());
        }
      }
    } catch (error) {
      setErrors(['Fehler beim Laden']);
    } finally {
      setLoading(false);
    }
  };

  const createEmpty = (): PruefprotokollDGUV201004 => ({
    id: crypto.randomUUID(),
    service_anfrage_id: serviceAnfrageId,
    kalenderjahr: new Date().getFullYear(),
    auftraggeber_name: '', auftraggeber_strasse: '', auftraggeber_ort: '',
    betreiber_name: '', betreiber_strasse: '', betreiber_ort: '',
    projekt: '', kostenstelle: '',
    fahrzeug_geraet: '', hersteller_typ: '', fahrgestell_nr: '', bs_km_stand: '', baujahr: '', motor: '', motor_hersteller_typ: '', e_anlage: '',
    atemluft_hersteller_typ: '', atemluft_seriennr: '', atemluft_baujahr: '', atemluft_gewicht: '',
    ueberdruck_ueberwachung_typ: '', ueberdruck_ueberwachung_seriennr: '', umluft_filteranlage_typ: '', umluft_filteranlage_seriennr: '',
    betriebsanleitung_vorhanden: '', filterkarte_vorhanden: '', hinweisschild_kabinendruck: '',
    montage_auf_dach: false, montage_links_hinter_kabine: false, montage_rechts_neben_kabine: false,
    montage_direkt_hinter_kabine: false, montage_links_neben_kabine: false, montage_rechts_hinter_kabine: false,
    sicherer_standplatz: '', zugangssysteme_vorhanden: '', rops_fops_unbeschaedigt: '', ruettelfest_montiert: '', vorgesehene_anschlagpunkte_genutzt: '',
    bewegungseinschraenkung: '', sichtbeschraenkung: '', original_spiegel_ok: '', ultraschall_warnsystem: '', einschraenkung_richtlinien: '', tuer_oeffnungen_beeintraechtigt: '',
    kontrollanzeige_vorhanden: '', optische_warnung: '', akustische_warnung: '', ansprechzeit_ok: '', alarm_untergrenze: '', alarm_obergrenze: '',
    kontrollanzeige_aktivkohlefilter: '', kontrollanzeige_partikelfilter: '', betriebsstundenzaehler_vorhanden: '', betriebsanzeige_gruen_sichtbar: '',
    auto_einschaltung_hauptmotor: '', hinweisschild_frischluft: '', fluchtfiltergeraet_vorhanden: '', funkverkehr_vorhanden: '', notausstieg_blockiert: '', notausstieg_nothammer: '', laermgrenzwert_unter_85db: '',
    kabine_abdichtung_ok: '', hebeschiebefenster_blockiert: '', aussenluft_heizung_abgedichtet: '', durchfuehrungen_abgedichtet: '', ueberdruck_laufend: '', luftzufuhr_laufend: '',
    klima_vorhanden: '', klima_typ_hersteller: '', klima_kondensator: '', klima_verdampfer: '', kaeltemittel: '', kompressor: '', klima_umluftwirkung: '',
    heizung_vorhanden: '', heizung_typ_hersteller: '', heizung_umluftbetrieb: '',
    maengel_bemerkungen: '', nachkontrolle_erforderlich: '', ort: '', protokoll_datum: new Date().toISOString().split('T')[0],
    auftraggeber_betreiber: '', servicetechniker: '',
    created_at: Date.now(), updated_at: Date.now()
  });

  const u = (field: keyof PruefprotokollDGUV201004, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const save = async () => {
    if (!data) return;
    const errs = validatePruefprotokoll(data);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    try {
      if (data.created_at === data.updated_at) {
        await pruefprotokollService.create(data);
      } else {
        await pruefprotokollService.update(data.id, data);
      }
      setErrors([]);
      alert('Gespeichert!');
    } catch (error) {
      setErrors(['Fehler beim Speichern']);
    }
  };

  const YN: React.FC<{ label: string; field: keyof PruefprotokollDGUV201004 }> = ({ label, field }) => (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{label}</label>
      <div style={{ display: 'flex', gap: '20px' }}>
        <label><input type="radio" checked={data?.[field] === 'ja'} onChange={() => u(field, 'ja')} /> Ja</label>
        <label><input type="radio" checked={data?.[field] === 'nein'} onChange={() => u(field, 'nein')} /> Nein</label>
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: '20px' }}>Lade...</div>;
  if (!data) return <div style={{ padding: '20px' }}>Fehler</div>;

  return (
    <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {onBack && <button onClick={onBack} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>← Zurück</button>}
        <button onClick={save} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Speichern</button>
        <PDFDownloadLink
          document={<PruefprotokollPDF data={data} />}
          fileName={`Pruefprotokoll_DGUV_${data.kalenderjahr}_${new Date().toISOString().split('T')[0]}.pdf`}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}
        >
          {({ loading }) => (loading ? 'Generiere PDF...' : 'PDF herunterladen')}
        </PDFDownloadLink>
      </div>

      <style>{`
        @media print {
          * { margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; }
          body, html { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; }
          .no-print, nav, button, .sidebar, .topbar, .form-view, h1, h2, h3, p, header, footer { display: none !important; }
          .print-view { display: block !important; margin: 0 auto !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          @page { size: A4 portrait; margin: 10mm; }
        }
        .print-view { display: none; }
      `}</style>

      {errors.length > 0 && <div className="no-print" style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}

      <div className="form-view">
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Prüfprotokoll DGUV 201-004</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kalenderjahr *</label>
              <input type="number" value={data.kalenderjahr} onChange={(e) => u('kalenderjahr', parseInt(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>1. Auftraggeber / Betreiber</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Auftraggeber Name *</label>
              <input type="text" value={data.auftraggeber_name} onChange={(e) => u('auftraggeber_name', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Betreiber Name</label>
              <input type="text" value={data.betreiber_name} onChange={(e) => u('betreiber_name', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Auftraggeber Straße</label>
              <input type="text" value={data.auftraggeber_strasse} onChange={(e) => u('auftraggeber_strasse', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Betreiber Straße</label>
              <input type="text" value={data.betreiber_strasse} onChange={(e) => u('betreiber_strasse', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Auftraggeber Ort</label>
              <input type="text" value={data.auftraggeber_ort} onChange={(e) => u('auftraggeber_ort', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Betreiber Ort</label>
              <input type="text" value={data.betreiber_ort} onChange={(e) => u('betreiber_ort', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Projekt</label>
              <input type="text" value={data.projekt} onChange={(e) => u('projekt', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kostenstelle</label>
              <input type="text" value={data.kostenstelle} onChange={(e) => u('kostenstelle', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>2. Gerät / Fahrzeug</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Fahrzeug/Gerät</label>
              <input type="text" value={data.fahrzeug_geraet} onChange={(e) => u('fahrzeug_geraet', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Hersteller/Typ</label>
              <input type="text" value={data.hersteller_typ} onChange={(e) => u('hersteller_typ', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Fahrgestell-Nr.</label>
              <input type="text" value={data.fahrgestell_nr} onChange={(e) => u('fahrgestell_nr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>BS/km-Stand</label>
              <input type="text" value={data.bs_km_stand} onChange={(e) => u('bs_km_stand', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Baujahr</label>
              <input type="text" value={data.baujahr} onChange={(e) => u('baujahr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Motor</label>
              <input type="text" value={data.motor} onChange={(e) => u('motor', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Hersteller/Typ</label>
              <input type="text" value={data.motor_hersteller_typ} onChange={(e) => u('motor_hersteller_typ', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>E-Anlage</label>
              <input type="text" value={data.e_anlage} onChange={(e) => u('e_anlage', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>3. Atemluft - Filteranlage</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Hersteller/Typ</label>
              <input type="text" value={data.atemluft_hersteller_typ} onChange={(e) => u('atemluft_hersteller_typ', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Serien-Nr.</label>
              <input type="text" value={data.atemluft_seriennr} onChange={(e) => u('atemluft_seriennr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Baujahr</label>
              <input type="text" value={data.atemluft_baujahr} onChange={(e) => u('atemluft_baujahr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Gewicht</label>
              <input type="text" value={data.atemluft_gewicht} onChange={(e) => u('atemluft_gewicht', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Überdruck - Überwachungssystem Typ</label>
              <input type="text" value={data.ueberdruck_ueberwachung_typ} onChange={(e) => u('ueberdruck_ueberwachung_typ', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Überdruck - Überwachungssystem Serien-Nr.</label>
              <input type="text" value={data.ueberdruck_ueberwachung_seriennr} onChange={(e) => u('ueberdruck_ueberwachung_seriennr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Umluft - Filteranlage Typ</label>
              <input type="text" value={data.umluft_filteranlage_typ} onChange={(e) => u('umluft_filteranlage_typ', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Umluft - Filteranlage Serien-Nr.</label>
              <input type="text" value={data.umluft_filteranlage_seriennr} onChange={(e) => u('umluft_filteranlage_seriennr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <YN label="Betriebsanleitung/Filteranlage vorhanden" field="betriebsanleitung_vorhanden" />
          <YN label="Filterkarte vorhanden" field="filterkarte_vorhanden" />
          <YN label="Hinweisschild: max - min Kabinendruck vorhanden (300-100 Pascal)" field="hinweisschild_kabinendruck" />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>5. Filteranlage ist montiert:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label><input type="checkbox" checked={data.montage_auf_dach} onChange={(e) => u('montage_auf_dach', e.target.checked)} /> auf dem Dach</label>
            <label><input type="checkbox" checked={data.montage_links_hinter_kabine} onChange={(e) => u('montage_links_hinter_kabine', e.target.checked)} /> links hinter der Kabine</label>
            <label><input type="checkbox" checked={data.montage_rechts_neben_kabine} onChange={(e) => u('montage_rechts_neben_kabine', e.target.checked)} /> rechts neben der Kabine</label>
            <label><input type="checkbox" checked={data.montage_direkt_hinter_kabine} onChange={(e) => u('montage_direkt_hinter_kabine', e.target.checked)} /> direkt hinter der Kabine</label>
            <label><input type="checkbox" checked={data.montage_links_neben_kabine} onChange={(e) => u('montage_links_neben_kabine', e.target.checked)} /> links neben der Kabine</label>
            <label><input type="checkbox" checked={data.montage_rechts_hinter_kabine} onChange={(e) => u('montage_rechts_hinter_kabine', e.target.checked)} /> rechts hinter der Kabine</label>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>6. Filterwechsel</h3>
          <YN label="sicherer Standplatz zum Filterwechsel und Wartung der Filteranlage vorhanden (nach BGI 584)." field="sicherer_standplatz" />
          <YN label="ausreichende Zugangssysteme, für Wartung und Filterwechsel, vorhanden." field="zugangssysteme_vorhanden" />
          <YN label="Beeinträchtigung von ROPS/ FOPS und TOPS Schutzmaßnahmen durch Filteranlage." field="rops_fops_unbeschaedigt" />
          <YN label="Konstruktion der Atemluftversorgungsanlage rüttelfest und vibrationsfrei montiert." field="ruettelfest_montiert" />
          <YN label="Nutzung der vom Hersteller vorgesehenden Verschraubungen/ Anschlagpunkte." field="vorgesehene_anschlagpunkte_genutzt" />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>7. Einschränkungen der Sicht und Bewegungsfreiheit</h3>
          <YN label="Bewegungseinschränkung des Fahrers." field="bewegungseinschraenkung" />
          <YN label="Sichtbeschränkung des Fahrers." field="sichtbeschraenkung" />
          <YN label="Original Spiegel ausreichend." field="original_spiegel_ok" />
          <YN label="Ultraschall - Warneinrichtung bzw. Videoüberwachung." field="ultraschall_warnsystem" />
          <YN label="Einschränkung der Original - Wartungsrichtlinien." field="einschraenkung_richtlinien" />
          <YN label="Zugänge und Öffnungen nach DIN ISO 2860 beeinträchtigt (Türen, Klappen, Öffnungen)." field="tuer_oeffnungen_beeintraechtigt" />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>8. Überdruck Überwachungssystem</h3>
          <YN label="Kontrollanzeige für Überdruck in der Kabine vorhanden." field="kontrollanzeige_vorhanden" />
          <YN label="optische Warneinrichtung für Druckabfall bzw. Anstieg vorhanden." field="optische_warnung" />
          <YN label="akustische Warneinrichtung für Druckabfall bzw. Anstieg vorhanden." field="akustische_warnung" />
          <YN label="Ansprechzeit der Warneinrichtung weniger als 5 Sekunden." field="ansprechzeit_ok" />
          <YN label="Alarmeinstellung - unter Grenzwert 100 Pascal." field="alarm_untergrenze" />
          <YN label="Alarmeinstellung - oberer Grenzwert 300 Pascal." field="alarm_obergrenze" />
          <YN label="Kontrollanzeige Partikelfilter vorhanden." field="kontrollanzeige_partikelfilter" />
          <YN label="Kontrollanzeige Aktivkohlefilter vorhanden." field="kontrollanzeige_aktivkohlefilter" />
          <YN label="Betriebsstundenzähler vorhanden." field="betriebsstundenzaehler_vorhanden" />
          <YN label='Betriebsanzeige "Grün" außen sichtbar montiert.' field="betriebsanzeige_gruen_sichtbar" />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>10. Sicherheitsmaßnahmen in der Fahrerkabine</h3>
          <YN label="Filtersystem schaltet automatisch beim Start des Hauptmotors ein." field="auto_einschaltung_hauptmotor" />
          <YN label='Hinweisschild vorhanden: "Bei geschlossener Kabine muss die Frischluftversorgung in Betrieb sein."' field="hinweisschild_frischluft" />
          <YN label="Fluchtfiltergerät vorhanden." field="fluchtfiltergeraet_vorhanden" />
          <YN label="Funkverkehr vorhanden." field="funkverkehr_vorhanden" />
          <YN label="vorhandener Notausstieg blockiert (z.B. Fenster/Türen abgedichtet)." field="notausstieg_blockiert" />
          <YN label="Notausstieg nachträglich gewährleistet durch Nothammer." field="notausstieg_nothammer" />
          <YN label="Lärmgrenzwert von Klima- und Filteranlage unter 85dB am Fahrerrohr." field="laermgrenzwert_unter_85db" />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>11. Kabinenabdichtung</h3>
          <YN label="Abdichtung der Kabine ausreichend." field="kabine_abdichtung_ok" />
          <YN label="Hebe - oder Schiebefenster Bedienteil entfernt/blockiert." field="hebeschiebefenster_blockiert" />
          <YN label="Außenluftzufuhr für Heizung abgedichtet." field="aussenluft_heizung_abgedichtet" />
          <YN label="Durchführung von Schläuchen, Kabeln usw. abgedichtet." field="durchfuehrungen_abgedichtet" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Überdruck bei laufendem Motor:</label>
              <input type="text" value={data.ueberdruck_laufend} onChange={(e) => u('ueberdruck_laufend', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Luftzufuhr bei laufendem Motor:</label>
              <input type="text" value={data.luftzufuhr_laufend} onChange={(e) => u('luftzufuhr_laufend', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>12. Klimaanlage</h3>
          <YN label="Klimaanlage vorhanden/ ausreichend:" field="klima_vorhanden" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Typ/Hersteller</label>
              <input type="text" value={data.klima_typ_hersteller} onChange={(e) => u('klima_typ_hersteller', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kältemittel</label>
              <input type="text" value={data.kaeltemittel} onChange={(e) => u('kaeltemittel', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kondensator</label>
              <input type="text" value={data.klima_kondensator} onChange={(e) => u('klima_kondensator', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kompressor</label>
              <input type="text" value={data.kompressor} onChange={(e) => u('kompressor', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Verdampfer</label>
              <input type="text" value={data.klima_verdampfer} onChange={(e) => u('klima_verdampfer', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
          <YN label="Umluftwirkung vorhanden" field="klima_umluftwirkung" />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>13. Heizung</h3>
          <YN label="Heizung vorhanden/ ausreichend:" field="heizung_vorhanden" />
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Typ/Hersteller</label>
            <input type="text" value={data.heizung_typ_hersteller} onChange={(e) => u('heizung_typ_hersteller', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', marginBottom: '15px' }} />
          </div>
          <YN label="Heizung im Umluftbetrieb:" field="heizung_umluftbetrieb" />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>15. Mängel/Bemerkungen</h3>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mängel/Bemerkungen</label>
            <textarea value={data.maengel_bemerkungen} onChange={(e) => u('maengel_bemerkungen', e.target.value)} rows={4} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', marginBottom: '15px' }} />
          </div>
          <YN label="Nachkontrolle, nach Mängelabstellung, erforderlich:" field="nachkontrolle_erforderlich" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Ort *</label>
              <input type="text" value={data.ort} onChange={(e) => u('ort', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Datum *</label>
              <input type="date" value={data.protokoll_datum} onChange={(e) => u('protokoll_datum', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Auftraggeber bzw. Betreiber</label>
              <input type="text" value={data.auftraggeber_betreiber} onChange={(e) => u('auftraggeber_betreiber', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Servicetechniker *</label>
              <input type="text" value={data.servicetechniker} onChange={(e) => u('servicetechniker', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PruefprotokollForm;
