import React, { useState, useEffect } from 'react';
import { GefaehrdungsbeurteilungAussendienst } from '../../types/gefaehrdungsbeurteilung';
import { gefaehrdungsbeurteilungService } from '../../services/gefaehrdungsbeurteilungService';
import { validateGefaehrdungsbeurteilung } from '../../utils/gefaehrdungsbeurteilungValidation';

interface Props {
  serviceAnfrageId: string;
}

const GefaehrdungsbeurteilungModule: React.FC<Props> = ({ serviceAnfrageId }) => {
  const [data, setData] = useState<GefaehrdungsbeurteilungAussendienst | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [serviceAnfrageId]);

  const loadData = async () => {
    try {
      const existing = await gefaehrdungsbeurteilungService.getByServiceRequest(serviceAnfrageId);
      if (existing) {
        setData(existing);
      } else {
        setData(createEmpty());
      }
    } catch (error) {
      setErrors(['Fehler beim Laden']);
    } finally {
      setLoading(false);
    }
  };

  const createEmpty = (): GefaehrdungsbeurteilungAussendienst => ({
    id: crypto.randomUUID(),
    service_anfrage_id: serviceAnfrageId,
    unternehmen: 'Heduschka GmbH',
    verantwortlicher: '',
    arbeitsbereich: '',
    arbeitsort: '',
    taetigkeit: '',
    arbeitsauftrag: '',
    auftraggeber: '',
    datum: new Date().toISOString().split('T')[0],
    mechanische_gefaehrdung: false,
    elektrische_gefaehrdung: false,
    chemische_gefaehrdung: false,
    biologische_gefaehrdung: false,
    brand_explosion: false,
    thermische_gefaehrdung: false,
    physikalische_gefaehrdung: false,
    umgebungsbedingungen: false,
    verkehrswege: false,
    sonstige_gefaehrdung: false,
    schutzhelm: false,
    schutzbrille: false,
    gehoerschutz: false,
    handschuhe: false,
    ffp2_maske: false,
    einweghandschuhe: false,
    sonstige_psa: '',
    leiter_geruest: false,
    schweisserlaubnis: false,
    befahrschein: false,
    besondere_genehmigung: '',
    unterweisung_durchgefuehrt: false,
    unterweisung_datum: '',
    unterweisung_name: '',
    unterweisung_unterschrift: '',
    final_submission: false,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  const u = (field: keyof GefaehrdungsbeurteilungAussendienst, value: any) => {
    if (!data || data.final_submission) return;
    setData({ ...data, [field]: value });
  };

  const save = async () => {
    if (!data) return;
    const errs = validateGefaehrdungsbeurteilung(data);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    try {
      if (data.created_at === data.updated_at) {
        await gefaehrdungsbeurteilungService.create(data);
      } else {
        await gefaehrdungsbeurteilungService.update(data.id, data);
      }
      setErrors([]);
      alert('Gespeichert!');
    } catch (error) {
      setErrors(['Fehler beim Speichern']);
    }
  };

  const finalSubmit = async () => {
    if (!data) return;
    if (!window.confirm('Nach der finalen Abgabe kann das Dokument nicht mehr bearbeitet werden. Fortfahren?')) return;
    
    const errs = validateGefaehrdungsbeurteilung(data);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    
    try {
      await gefaehrdungsbeurteilungService.update(data.id, { ...data, final_submission: true });
      setData({ ...data, final_submission: true });
      alert('Dokument wurde final abgegeben und ist nun schreibgeschützt.');
    } catch (error) {
      setErrors(['Fehler beim Abgeben']);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Lade...</div>;
  if (!data) return <div style={{ padding: '20px' }}>Fehler</div>;

  const isReadOnly = data.final_submission;

  return (
    <div style={{ marginLeft: '250px', marginTop: '60px', padding: '20px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .form-view { display: none !important; }
          .print-view { display: block !important; }
          body { margin: 0; padding: 10px; font-family: Arial, sans-serif; font-size: 10px; }
          @page { size: A4; margin: 10mm; }
        }
        .print-view { display: none; }
      `}</style>

      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={save} disabled={isReadOnly} style={{ padding: '10px 20px', backgroundColor: isReadOnly ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isReadOnly ? 'not-allowed' : 'pointer' }}>💾 Speichern</button>
        <button onClick={finalSubmit} disabled={isReadOnly} style={{ padding: '10px 20px', backgroundColor: isReadOnly ? '#6c757d' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: isReadOnly ? 'not-allowed' : 'pointer' }}>🔒 Final Abgeben</button>
        <button onClick={() => window.print()} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🖨️ Drucken</button>
        {isReadOnly && <span style={{ color: '#dc3545', fontWeight: 'bold' }}>🔒 SCHREIBGESCHÜTZT</span>}
      </div>

      {errors.length > 0 && <div className="no-print" style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}

      {/* FORM VIEW */}
      <div className="form-view">
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Gefährdungsbeurteilung nach §5 ArbSchG</h2>
          <p style={{ fontSize: '12px', color: '#6c757d' }}>Für Arbeiten im Außendienst</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>1. Allgemeine Angaben</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Unternehmen *</label>
              <input type="text" value={data.unternehmen} onChange={(e) => u('unternehmen', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Verantwortlicher *</label>
              <input type="text" value={data.verantwortlicher} onChange={(e) => u('verantwortlicher', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Arbeitsbereich / Baustelle *</label>
              <input type="text" value={data.arbeitsbereich} onChange={(e) => u('arbeitsbereich', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Arbeitsort</label>
              <input type="text" value={data.arbeitsort} onChange={(e) => u('arbeitsort', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Auftraggeber</label>
              <input type="text" value={data.auftraggeber} onChange={(e) => u('auftraggeber', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Datum *</label>
              <input type="date" value={data.datum} onChange={(e) => u('datum', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>2. Tätigkeiten / Arbeitsauftrag</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Tätigkeit *</label>
            <textarea value={data.taetigkeit} onChange={(e) => u('taetigkeit', e.target.value)} disabled={isReadOnly} rows={2} placeholder="Montage, Wartung und Instandsetzungsarbeiten von Atemluftversorgungsanlagen, Klima-, Heizungs- und Filteranlagen an Fahrzeugen und Maschinen" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Arbeitsauftrag</label>
            <textarea value={data.arbeitsauftrag} onChange={(e) => u('arbeitsauftrag', e.target.value)} disabled={isReadOnly} rows={2} placeholder="SKP an SBA nach DGUV201-004" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>3. Gefährdungsbeurteilung</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label><input type="checkbox" checked={data.mechanische_gefaehrdung} onChange={(e) => u('mechanische_gefaehrdung', e.target.checked)} disabled={isReadOnly} /> Mechanische Gefährdung</label>
            <label><input type="checkbox" checked={data.elektrische_gefaehrdung} onChange={(e) => u('elektrische_gefaehrdung', e.target.checked)} disabled={isReadOnly} /> Elektrische Gefährdung</label>
            <label><input type="checkbox" checked={data.chemische_gefaehrdung} onChange={(e) => u('chemische_gefaehrdung', e.target.checked)} disabled={isReadOnly} /> Chemische Gefährdung</label>
            <label><input type="checkbox" checked={data.biologische_gefaehrdung} onChange={(e) => u('biologische_gefaehrdung', e.target.checked)} disabled={isReadOnly} /> Biologische Gefährdung</label>
            <label><input type="checkbox" checked={data.brand_explosion} onChange={(e) => u('brand_explosion', e.target.checked)} disabled={isReadOnly} /> Brand- und Explosionsgefährdung</label>
            <label><input type="checkbox" checked={data.thermische_gefaehrdung} onChange={(e) => u('thermische_gefaehrdung', e.target.checked)} disabled={isReadOnly} /> Thermische Gefährdung</label>
            <label><input type="checkbox" checked={data.physikalische_gefaehrdung} onChange={(e) => u('physikalische_gefaehrdung', e.target.checked)} disabled={isReadOnly} /> Physikalische Belastungen</label>
            <label><input type="checkbox" checked={data.umgebungsbedingungen} onChange={(e) => u('umgebungsbedingungen', e.target.checked)} disabled={isReadOnly} /> Gefährdung durch Umgebungsbedingungen</label>
            <label><input type="checkbox" checked={data.verkehrswege} onChange={(e) => u('verkehrswege', e.target.checked)} disabled={isReadOnly} /> Verkehrswege</label>
            <label><input type="checkbox" checked={data.sonstige_gefaehrdung} onChange={(e) => u('sonstige_gefaehrdung', e.target.checked)} disabled={isReadOnly} /> Sonstige Gefährdung</label>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>4. Persönliche Schutzausrüstung (PSA)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <label><input type="checkbox" checked={data.schutzhelm} onChange={(e) => u('schutzhelm', e.target.checked)} disabled={isReadOnly} /> Schutzhelm</label>
            <label><input type="checkbox" checked={data.schutzbrille} onChange={(e) => u('schutzbrille', e.target.checked)} disabled={isReadOnly} /> Schutzbrille</label>
            <label><input type="checkbox" checked={data.gehoerschutz} onChange={(e) => u('gehoerschutz', e.target.checked)} disabled={isReadOnly} /> Gehörschutz</label>
            <label><input type="checkbox" checked={data.handschuhe} onChange={(e) => u('handschuhe', e.target.checked)} disabled={isReadOnly} /> Handschuhe</label>
            <label><input type="checkbox" checked={data.ffp2_maske} onChange={(e) => u('ffp2_maske', e.target.checked)} disabled={isReadOnly} /> FFP2 Maske bzw. Filtermaske</label>
            <label><input type="checkbox" checked={data.einweghandschuhe} onChange={(e) => u('einweghandschuhe', e.target.checked)} disabled={isReadOnly} /> Einweghandschuhe</label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sonstige PSA</label>
            <input type="text" value={data.sonstige_psa} onChange={(e) => u('sonstige_psa', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>5. Arbeitsmittel & Genehmigungen</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <label><input type="checkbox" checked={data.leiter_geruest} onChange={(e) => u('leiter_geruest', e.target.checked)} disabled={isReadOnly} /> Leiter / Gerüst</label>
            <label><input type="checkbox" checked={data.schweisserlaubnis} onChange={(e) => u('schweisserlaubnis', e.target.checked)} disabled={isReadOnly} /> Schweißerlaubnis</label>
            <label><input type="checkbox" checked={data.befahrschein} onChange={(e) => u('befahrschein', e.target.checked)} disabled={isReadOnly} /> Befahrschein</label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Besondere Genehmigung</label>
            <input type="text" value={data.besondere_genehmigung} onChange={(e) => u('besondere_genehmigung', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>6. Unterweisung & Unterschriften</h3>
          <div style={{ marginBottom: '15px' }}>
            <label><input type="checkbox" checked={data.unterweisung_durchgefuehrt} onChange={(e) => u('unterweisung_durchgefuehrt', e.target.checked)} disabled={isReadOnly} /> Durchgeführte Beurteilung / Unterweisung vor Ort</label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Datum</label>
              <input type="date" value={data.unterweisung_datum} onChange={(e) => u('unterweisung_datum', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name, Vorname</label>
              <input type="text" value={data.unterweisung_name} onChange={(e) => u('unterweisung_name', e.target.value)} disabled={isReadOnly} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Unterschrift</label>
              <input type="text" value={data.unterweisung_unterschrift} onChange={(e) => u('unterweisung_unterschrift', e.target.value)} disabled={isReadOnly} placeholder="Name eingeben" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* PRINT VIEW */}
      <div className="print-view" style={{ maxWidth: '210mm', margin: '0 auto', backgroundColor: 'white', padding: '10mm' }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>Gefährdungsbeurteilung nach §5 und § Arbeitsschutzgesetz für Arbeiten im Außendienst</h2>
          <div style={{ fontSize: '9px' }}>Heduschka Dienstleister Betriebsanleitung/ Fachbauer Betriebsanweisung</div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000', fontSize: '10px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000', fontWeight: 'bold', width: '120px' }}>Unternehmen:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.unternehmen}</td>
              <td style={{ padding: '4px', border: '1px solid #000', fontWeight: 'bold', width: '120px' }}>Arbeitsbereich/ Baustelle:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.arbeitsbereich}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000', fontWeight: 'bold' }}>Verantwortlicher:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.verantwortlicher}</td>
              <td style={{ padding: '4px', border: '1px solid #000', fontWeight: 'bold' }}>KP vor Ort:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000', fontSize: '10px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000', fontWeight: 'bold', width: '120px' }}>Tätigkeiten:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }} colSpan={3}>{data.taetigkeit}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000', fontWeight: 'bold' }}>Arbeitsauftrag:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.arbeitsauftrag}</td>
              <td style={{ padding: '4px', border: '1px solid #000', fontWeight: 'bold', width: '120px' }}>Auftraggeber:</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.auftraggeber}</td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000', fontSize: '9px' }}>
          <thead>
            <tr>
              <th style={{ padding: '4px', border: '1px solid #000', textAlign: 'left' }}>Gefährdungen:</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>ja</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>nein</th>
              <th style={{ padding: '4px', border: '1px solid #000', textAlign: 'left' }}>Bemerkungen</th>
              <th style={{ padding: '4px', border: '1px solid #000', textAlign: 'left' }}>erforderliche PSA:</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>ja</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>nein</th>
              <th style={{ padding: '4px', border: '1px solid #000', textAlign: 'left' }}>Bemerkungen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Mechanische Gefährdung</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.mechanische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.mechanische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Schutzhelm</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.schutzhelm ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.schutzhelm ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Elektrische Gefährdung</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.elektrische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.elektrische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Schutzbrille S3</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.schutzbrille ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.schutzbrille ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Chemische Gefährdung</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.chemische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.chemische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Schutzhandschuhe (Leder, Kälte)</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.handschuhe ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.handschuhe ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Biologische Gefährdung</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.biologische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.biologische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Sicherheitsschuhe</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>x</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Brand- und Explosionsgefährdung</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.brand_explosion ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.brand_explosion ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Gehörschutz</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.gehoerschutz ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.gehoerschutz ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Thermische Gefährdung</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.thermische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.thermische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Atemschutz</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.ffp2_maske ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.ffp2_maske ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>FFP2 Maske bzw. Filtermaske</td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Physikalische Belastungen</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.physikalische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.physikalische_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Hautschutz</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.einweghandschuhe ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.einweghandschuhe ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Einweghandschuhe Nitril/Latex</td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Gefährdung durch Umgebungsbedingungen</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.umgebungsbedingungen ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.umgebungsbedingungen ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Hautschutz, schütz</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>x</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Verkehrswege</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.verkehrswege ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.verkehrswege ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Fallschutz</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Sonstige Gefährdung</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.sonstige_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.sonstige_gefaehrdung ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}></td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000', fontSize: '9px' }}>
          <thead>
            <tr>
              <th style={{ padding: '4px', border: '1px solid #000', textAlign: 'left' }}>Arbeits-/ Hilfsmittel:</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>ja</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>nein</th>
              <th style={{ padding: '4px', border: '1px solid #000', textAlign: 'left' }}>besondere Genehmigung:</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>ja</th>
              <th style={{ padding: '4px', border: '1px solid #000', width: '30px' }}>nein</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Leiter/ Gerüst</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.leiter_geruest ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.leiter_geruest ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Schweißerlaubnis</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.schweisserlaubnis ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.schweisserlaubnis ? 'x' : ''}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Sonstige</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Befahrschein</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{data.befahrschein ? 'x' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }}>{!data.befahrschein ? 'x' : ''}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }} colSpan={3}></td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Sonstige</td>
              <td style={{ padding: '4px', border: '1px solid #000', textAlign: 'center' }} colSpan={2}>{data.besondere_genehmigung}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>Spezifische Sicherheitshinweise:</div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000', fontSize: '9px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000' }}>Durchgeführte Beurteilung / Unterweisung vor Ort</td>
              <td style={{ padding: '4px', border: '1px solid #000', width: '80px' }}>Datum</td>
              <td style={{ padding: '4px', border: '1px solid #000', width: '150px' }}>Name, Vorname</td>
              <td style={{ padding: '4px', border: '1px solid #000', width: '150px' }}>Unterschrift</td>
            </tr>
            <tr>
              <td style={{ padding: '4px', border: '1px solid #000', height: '30px' }}>{data.unterweisung_durchgefuehrt ? 'Ja' : ''}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.unterweisung_datum}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.unterweisung_name}</td>
              <td style={{ padding: '4px', border: '1px solid #000' }}>{data.unterweisung_unterschrift}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '10px' }}>
          Heduschka GmbH • Buchwälder Str. 28 • 01968 Senftenberg
        </div>
      </div>
    </div>
  );
};

export default GefaehrdungsbeurteilungModule;
