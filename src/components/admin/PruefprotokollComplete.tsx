import React, { useState, useEffect } from 'react';
import { PruefprotokollDGUV201004 } from '../../types/pruefprotokoll';
import { pruefprotokollService } from '../../services/pruefprotokollService';
import { validatePruefprotokoll } from '../../utils/pruefprotokollValidation';

interface Props {
  serviceAnfrageId: string;
}

const PruefprotokollComplete: React.FC<Props> = ({ serviceAnfrageId }) => {
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
        setData(createEmptyProtocol());
      }
    } catch (error) {
      setErrors(['Fehler beim Laden']);
    } finally {
      setLoading(false);
    }
  };

  const createEmptyProtocol = (): PruefprotokollDGUV201004 => ({
    id: crypto.randomUUID(),
    service_anfrage_id: serviceAnfrageId,
    kalenderjahr: new Date().getFullYear(),
    auftraggeber_name: '',
    auftraggeber_strasse: '',
    auftraggeber_ort: '',
    betreiber_name: '',
    betreiber_strasse: '',
    betreiber_ort: '',
    projekt: '',
    kostenstelle: '',
    fahrzeug_geraet: '',
    hersteller_typ: '',
    fahrgestell_nr: '',
    bs_km_stand: '',
    baujahr: '',
    e_anlage: '',
    motor_hersteller_typ: '',
    filter_seriennr: '',
    filter_hersteller_typ: '',
    filter_baujahr: '',
    filter_gewicht: '',
    ueberdruck_typ: '',
    ueberdruck_seriennr: '',
    umluft_typ: '',
    umluft_seriennr: '',
    betriebsanleitung_vorhanden: '',
    filterkarte_vorhanden: '',
    hinweisschild_vorhanden: '',
    montage_auf_dach: false,
    montage_links_hinter_kabine: false,
    montage_rechts_neben_kabine: false,
    montage_direkt_hinter_kabine: false,
    montage_links_neben_kabine: false,
    montage_rechts_hinter_kabine: false,
    sicherer_standplatz: '',
    zugangssysteme_vorhanden: '',
    rops_fops_unbeschaedigt: '',
    ruettelfest_montiert: '',
    vorgesehene_anschlagpunkte_genutzt: '',
    bewegungseinschraenkung: '',
    sichtbeschraenkung: '',
    original_spiegel_ok: '',
    ultraschall_warnsystem: '',
    einschraenkung_richtlinien: '',
    tuer_oeffnungen_beeintraechtigt: '',
    kontrollanzeige_vorhanden: '',
    optische_warnung: '',
    akustische_warnung: '',
    ansprechzeit_ok: '',
    alarm_untergrenze: '',
    alarm_obergrenze: '',
    kontrollanzeige_aktivkohlefilter: '',
    kontrollanzeige_partikelfilter: '',
    betriebsstundenzaehler_vorhanden: '',
    betriebsanzeige_gruen_sichtbar: '',
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
    nachkontrolle_erforderlich: '',
    ort: '',
    protokoll_datum: new Date().toISOString().split('T')[0],
    auftraggeber_unterschrift: '',
    servicetechniker_unterschrift: '',
    created_at: Date.now(),
    updated_at: Date.now()
  });

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

  const CheckboxRow: React.FC<{ label: string; field: keyof PruefprotokollDGUV201004 }> = ({ label, field }) => (
    <tr>
      <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>{label}</td>
      <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
        <input type="checkbox" checked={data?.[field] === 'ja'} onChange={(e) => handleUpdate(field, e.target.checked ? 'ja' : '')} />
      </td>
      <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>ja</td>
      <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
        <input type="checkbox" checked={data?.[field] === 'nein'} onChange={(e) => handleUpdate(field, e.target.checked ? 'nein' : '')} />
      </td>
      <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>nein</td>
    </tr>
  );

  if (loading) return <div style={{ padding: '20px' }}>Lade...</div>;
  if (!data) return <div style={{ padding: '20px' }}>Fehler</div>;

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 10px; font-family: Arial, sans-serif; font-size: 11px; }
          table { page-break-inside: avoid; }
        }
        @page { size: A4; margin: 10mm; }
      `}</style>

      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>💾 Speichern</button>
        <button onClick={() => window.print()} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🖨️ Drucken</button>
      </div>

      {errors.length > 0 && <div className="no-print" style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}

      <div style={{ maxWidth: '210mm', margin: '0 auto', backgroundColor: 'white', padding: '10mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Prüf-/Übernahmeprotokoll für Atemluftversorgungs-/Klimaanlagen</h2>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{data.kalenderjahr}</div>
        </div>
        <div style={{ fontSize: '10px', textAlign: 'center', marginBottom: '10px' }}>nach Merkblatt DGUV 201-004</div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #000', fontWeight: 'bold', width: '100px', fontSize: '11px' }}>Auftraggeber</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.auftraggeber_name} onChange={(e) => handleUpdate('auftraggeber_name', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
                <input type="text" value={data.auftraggeber_strasse} onChange={(e) => handleUpdate('auftraggeber_strasse', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
                <input type="text" value={data.auftraggeber_ort} onChange={(e) => handleUpdate('auftraggeber_ort', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '8px', border: '1px solid #000', fontWeight: 'bold', width: '80px', fontSize: '11px' }}>Betreiber</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.betreiber_strasse} onChange={(e) => handleUpdate('betreiber_strasse', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
                <input type="text" value={data.betreiber_ort} onChange={(e) => handleUpdate('betreiber_ort', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', width: '120px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Projekt:</div>
                <input type="text" value={data.projekt} onChange={(e) => handleUpdate('projekt', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>Kostenstelle:</div>
                <input type="text" value={data.kostenstelle} onChange={(e) => handleUpdate('kostenstelle', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Gerät/Fahrzeug</td>
              <td style={{ padding: '4px', border: '1px solid #000' }} colSpan={3}>
                <input type="text" value={data.hersteller_typ} onChange={(e) => handleUpdate('hersteller_typ', e.target.value)} placeholder="Hersteller/Typ" style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Fahrgestell-Nr.:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.fahrgestell_nr} onChange={(e) => handleUpdate('fahrgestell_nr', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>BS/km-Stand:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.bs_km_stand} onChange={(e) => handleUpdate('bs_km_stand', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Motor</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.motor_hersteller_typ} onChange={(e) => handleUpdate('motor_hersteller_typ', e.target.value)} placeholder="Hersteller/Typ" style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>E-Anlage:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.e_anlage} onChange={(e) => handleUpdate('e_anlage', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Atemluft - Filteranlage</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Hersteller/Typ:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.filter_hersteller_typ} onChange={(e) => handleUpdate('filter_hersteller_typ', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Serien-Nr.:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.filter_seriennr} onChange={(e) => handleUpdate('filter_seriennr', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Baujahr:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.filter_baujahr} onChange={(e) => handleUpdate('filter_baujahr', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Gewicht:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>
                <input type="text" value={data.filter_gewicht} onChange={(e) => handleUpdate('filter_gewicht', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <CheckboxRow label="Betriebsanleitung/Filteranlage vorhanden" field="betriebsanleitung_vorhanden" />
            <CheckboxRow label="Filterkarte vorhanden" field="filterkarte_vorhanden" />
            <CheckboxRow label="Hinweisschild - max - min Kabinendruck vorhanden (300-100 Pascal)" field="hinweisschild_vorhanden" />
          </tbody>
        </table>

        <div style={{ marginBottom: '10px', border: '1px solid #000', padding: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px' }}>Filteranlage ist montiert:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', fontSize: '10px' }}>
            <label><input type="checkbox" checked={data.montage_auf_dach} onChange={(e) => handleUpdate('montage_auf_dach', e.target.checked)} /> auf dem Dach</label>
            <label><input type="checkbox" checked={data.montage_links_hinter_kabine} onChange={(e) => handleUpdate('montage_links_hinter_kabine', e.target.checked)} /> links hinter der Kabine</label>
            <label><input type="checkbox" checked={data.montage_rechts_neben_kabine} onChange={(e) => handleUpdate('montage_rechts_neben_kabine', e.target.checked)} /> rechts neben der Kabine</label>
            <label><input type="checkbox" checked={data.montage_direkt_hinter_kabine} onChange={(e) => handleUpdate('montage_direkt_hinter_kabine', e.target.checked)} /> direkt hinter der Kabine</label>
            <label><input type="checkbox" checked={data.montage_links_neben_kabine} onChange={(e) => handleUpdate('montage_links_neben_kabine', e.target.checked)} /> links neben der Kabine</label>
            <label><input type="checkbox" checked={data.montage_rechts_hinter_kabine} onChange={(e) => handleUpdate('montage_rechts_hinter_kabine', e.target.checked)} /> rechts hinter der Kabine</label>
          </div>
        </div>

        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Filterwechsel</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <CheckboxRow label="sicherer Standplatz zum Filterwechsel und Wartung der Filteranlage vorhanden (nach BGI 584)" field="sicherer_standplatz" />
            <CheckboxRow label="geeignete Zugangssysteme, für Wartung und Filterwechsel, vorhanden" field="zugangssysteme_vorhanden" />
            <CheckboxRow label="Beeinträchtigung von ROPS/FOPS und TOPS Schutzmaßnahmen durch Filteranlage" field="rops_fops_unbeschaedigt" />
            <CheckboxRow label="Konstruktion der Atemluftversorgungsanlage rüttelfest und vibrationsfrei montiert" field="ruettelfest_montiert" />
            <CheckboxRow label="Nutzung der vom Hersteller vorgesehenen Verschraubungen/Anschlagpunkte" field="vorgesehene_anschlagpunkte_genutzt" />
          </tbody>
        </table>

        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Einschränkungen der Sicht und Bewegungsfreiheit</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <CheckboxRow label="Bewegungseinschränkung des Fahrers" field="bewegungseinschraenkung" />
            <CheckboxRow label="Sichtbeschränkung des Fahrers" field="sichtbeschraenkung" />
            <CheckboxRow label="Original Spiegel ausreichend" field="original_spiegel_ok" />
            <CheckboxRow label="Ultraschall - Warneinrichtung bzw. Videoüberwachung" field="ultraschall_warnsystem" />
            <CheckboxRow label="Einschränkung der Original - Wartungsrichtlinien" field="einschraenkung_richtlinien" />
            <CheckboxRow label="Zugänge und Öffnungen nach DIN ISO 2860 beeinträchtigt (Türen, Klappen, Öffnungen)" field="tuer_oeffnungen_beeintraechtigt" />
          </tbody>
        </table>

        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Überdruck Überwachungssystem</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <CheckboxRow label="Kontrollanzeige für Überdruck in der Kabine vorhanden" field="kontrollanzeige_vorhanden" />
            <CheckboxRow label="optische Warneinrichtung für Druckabfall bzw. -100 Pascal vorhanden" field="optische_warnung" />
            <CheckboxRow label="akustische Warneinrichtung für Druckabfall bzw. Anstieg vorhanden" field="akustische_warnung" />
            <CheckboxRow label="Ansprechzeit der Warneinrichtung weniger als 5 Sekunden" field="ansprechzeit_ok" />
            <CheckboxRow label="Alarmeinstellung - unter Grenzwert 100 Pascal" field="alarm_untergrenze" />
            <CheckboxRow label="Alarmeinstellung - oberer Grenzwert 300 Pascal" field="alarm_obergrenze" />
          </tbody>
        </table>

        <div style={{ pageBreakBefore: 'always' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Prüf-/Übernahmeprotokoll für Atemluftversorgungs-/Klimaanlagen</h2>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{data.kalenderjahr}</div>
        </div>
        <div style={{ fontSize: '10px', textAlign: 'center', marginBottom: '10px' }}>nach Merkblatt DGUV 201-004</div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <CheckboxRow label="Kontrollanzeige Partikelfilter vorhanden" field="kontrollanzeige_partikelfilter" />
            <CheckboxRow label="Kontrollanzeige Aktivkohlefilter vorhanden" field="kontrollanzeige_aktivkohlefilter" />
            <CheckboxRow label="Betriebsstundenzähler vorhanden" field="betriebsstundenzaehler_vorhanden" />
            <CheckboxRow label="Betriebsanzeige 'Grün' außen sichtbar montiert" field="betriebsanzeige_gruen_sichtbar" />
          </tbody>
        </table>

        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Sicherheitsmaßnahmen in der Fahrerkabine</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <CheckboxRow label="Filtersystem schaltet automatisch beim Start des Hauptmotors ein" field="auto_einschaltung_hauptmotor" />
            <CheckboxRow label="Hinweisschild vorhanden 'Bei geschlossener Kabine muss die Frischluftversorgung in Betrieb sein'" field="hinweisschild_frischluft" />
            <CheckboxRow label="Fluchtfiltergerät vorhanden" field="fluchtfiltergeraet_vorhanden" />
            <CheckboxRow label="Funkverkehr vorhanden" field="funkverkehr_vorhanden" />
            <CheckboxRow label="Vorhandener Notausstieg Notausstieg blockiert (z.B. Fenster/Türen abgedichtet)" field="notausstieg_blockiert" />
            <CheckboxRow label="Notausstieg nachträglich gewährleistet durch Nothammer" field="notausstieg_nothammer" />
            <CheckboxRow label="Lärmgrenzwert von Klima- und Filteranlage unter 85dB am Fahrerohr" field="laermgrenzwert_unter_85db" />
          </tbody>
        </table>

        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Kabinenabdichtung</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <CheckboxRow label="Abdichtung der Kabine ausreichend" field="kabine_abdichtung_ok" />
            <CheckboxRow label="Hebe - oder Schiebefenster Bedienteil entfernt/blockiert" field="hebeschiebefenster_blockiert" />
            <CheckboxRow label="Außenluftzufuhr für Heizung abgedichtet" field="aussenluft_heizung_abgedichtet" />
            <CheckboxRow label="Durchführung von Schläuchen, Kabeln usw. abgedichtet" field="durchfuehrungen_abgedichtet" />
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }} rowSpan={2}>Klimaanlage</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }} colSpan={3}>vorhanden/ausreichend:</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.klima_typ_hersteller !== '' && data.klima_typ_hersteller !== 'nein'} onChange={(e) => handleUpdate('klima_typ_hersteller', e.target.checked ? 'ja' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>ja</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.klima_typ_hersteller === 'nein'} onChange={(e) => handleUpdate('klima_typ_hersteller', e.target.checked ? 'nein' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>nein</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }} colSpan={7}>
                Typ/Hersteller: <input type="text" value={data.klima_typ_hersteller !== 'ja' && data.klima_typ_hersteller !== 'nein' ? data.klima_typ_hersteller : ''} onChange={(e) => handleUpdate('klima_typ_hersteller', e.target.value)} style={{ width: '80%', border: 'none', borderBottom: '1px dotted #000', fontSize: '11px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Kondensator:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }} colSpan={3}>
                <input type="text" placeholder="Kältemittel:" value={data.kaeltemittel} onChange={(e) => handleUpdate('kaeltemittel', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000' }} colSpan={4}>
                <input type="text" value={data.klima_kondensator} onChange={(e) => handleUpdate('klima_kondensator', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Verdampfer:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }} colSpan={3}>
                <input type="text" placeholder="Kompressor:" value={data.kompressor} onChange={(e) => handleUpdate('kompressor', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000' }} colSpan={4}>
                <input type="text" value={data.klima_verdampfer} onChange={(e) => handleUpdate('klima_verdampfer', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '11px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Umluftwirkung vorhanden:</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.klima_umluftwirkung === 'ja'} onChange={(e) => handleUpdate('klima_umluftwirkung', e.target.checked ? 'ja' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>ja</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.klima_umluftwirkung === 'nein'} onChange={(e) => handleUpdate('klima_umluftwirkung', e.target.checked ? 'nein' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }} colSpan={4}>nein</td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }} rowSpan={2}>Heizung</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }} colSpan={3}>vorhanden/ausreichend:</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.heizung_typ_hersteller !== '' && data.heizung_typ_hersteller !== 'nein'} onChange={(e) => handleUpdate('heizung_typ_hersteller', e.target.checked ? 'ja' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>ja</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.heizung_typ_hersteller === 'nein'} onChange={(e) => handleUpdate('heizung_typ_hersteller', e.target.checked ? 'nein' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>nein</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }} colSpan={7}>
                Hersteller/Typ: <input type="text" value={data.heizung_typ_hersteller !== 'ja' && data.heizung_typ_hersteller !== 'nein' ? data.heizung_typ_hersteller : ''} onChange={(e) => handleUpdate('heizung_typ_hersteller', e.target.value)} style={{ width: '80%', border: 'none', borderBottom: '1px dotted #000', fontSize: '11px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>Heizung im Umluftbetrieb:</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.heizung_umluftbetrieb === 'ja'} onChange={(e) => handleUpdate('heizung_umluftbetrieb', e.target.checked ? 'ja' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>ja</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.heizung_umluftbetrieb === 'nein'} onChange={(e) => handleUpdate('heizung_umluftbetrieb', e.target.checked ? 'nein' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }} colSpan={4}>nein</td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Mängel/Bemerkungen:</div>
        <textarea
          value={data.maengel_bemerkungen}
          onChange={(e) => handleUpdate('maengel_bemerkungen', e.target.value)}
          rows={4}
          style={{ width: '100%', border: '1px solid #000', padding: '8px', fontSize: '11px', marginBottom: '10px' }}
        />

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #000', fontSize: '11px' }}>Nachkontrolle, nach Mängelabstellung, erforderlich:</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.nachkontrolle_erforderlich === 'ja'} onChange={(e) => handleUpdate('nachkontrolle_erforderlich', e.target.checked ? 'ja' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>ja</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center', width: '30px' }}>
                <input type="checkbox" checked={data.nachkontrolle_erforderlich === 'nein'} onChange={(e) => handleUpdate('nachkontrolle_erforderlich', e.target.checked ? 'nein' : '')} />
              </td>
              <td style={{ padding: '4px', border: '1px solid #000', fontSize: '10px', width: '30px', textAlign: 'center' }}>nein</td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #000', fontSize: '11px', width: '50%' }}>
                <div style={{ marginBottom: '30px' }}>
                  Ort: <input type="text" value={data.ort} onChange={(e) => handleUpdate('ort', e.target.value)} style={{ width: '80%', border: 'none', borderBottom: '1px dotted #000', fontSize: '11px' }} />
                </div>
                <div>
                  Auftraggeber bzw. Betreiber: <input type="text" value={data.auftraggeber_unterschrift} onChange={(e) => handleUpdate('auftraggeber_unterschrift', e.target.value)} style={{ width: '60%', border: 'none', borderBottom: '1px dotted #000', fontSize: '11px' }} />
                </div>
              </td>
              <td style={{ padding: '8px', border: '1px solid #000', fontSize: '11px', width: '50%' }}>
                <div style={{ marginBottom: '30px' }}>
                  Datum: <input type="date" value={data.protokoll_datum} onChange={(e) => handleUpdate('protokoll_datum', e.target.value)} style={{ width: '70%', border: 'none', borderBottom: '1px dotted #000', fontSize: '11px' }} />
                </div>
                <div>
                  Servicetechniker: <input type="text" value={data.servicetechniker_unterschrift} onChange={(e) => handleUpdate('servicetechniker_unterschrift', e.target.value)} style={{ width: '70%', border: 'none', borderBottom: '1px dotted #000', fontSize: '11px' }} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: '9px', textAlign: 'center', borderTop: '1px solid #000', paddingTop: '5px' }}>
          Heduschka GmbH - Buchwälder Str. 28 - 01968 Senftenberg<br />
          Es gelten unsere allgemeinen Geschäftsbedingungen (AGB), die Sie auch unter www.heduschka.de finden.
        </div>
      </div>
    </div>
  );
};

export default PruefprotokollComplete;
