import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ArbeitsauftragServicebericht, ArbeitsauftragZeit } from '../../types/arbeitsauftrag';
import { arbeitsauftragService } from '../../services/arbeitsauftragService';
import { validateArbeitsauftrag } from '../../utils/arbeitsauftragValidation';
import { ArbeitsauftragPDF } from './pdf/ArbeitsauftragPDF';

interface Props {
  serviceAnfrageId: string;
}

const ArbeitsauftragModule: React.FC<Props> = ({ serviceAnfrageId }) => {
  const [data, setData] = useState<ArbeitsauftragServicebericht | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [serviceAnfrageId]);

  const loadData = async () => {
    try {
      const existing = await arbeitsauftragService.getByServiceRequest(serviceAnfrageId);
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

  const createEmpty = (): ArbeitsauftragServicebericht => ({
    id: crypto.randomUUID(),
    service_anfrage_id: serviceAnfrageId,
    datum: new Date().toISOString().split('T')[0],
    auftraggeber_name: '',
    auftraggeber_strasse: '',
    auftraggeber_ort: '',
    kd_nr: '',
    kundenanschrift_name: '',
    kundenanschrift_adresse: '',
    bestellung: '',
    ap_name: '',
    ap_tel: '',
    fahrzeug: '',
    kennzeichen: '',
    serien_nr: '',
    baujahr: '',
    km_bs: '',
    arbeitsauftrag: '',
    zeiten: [],
    ausgefuehrte_arbeiten: '',
    material_grobstaubfilter: false,
    material_schwebstofffilter: false,
    material_aktivkohlefilter: false,
    material_umluftfilter: false,
    material_sonstiges: '',
    bemerkungen: '',
    unterschrift_monteur: '',
    unterschrift_kunde: '',
    created_at: Date.now(),
    updated_at: Date.now()
  });

  const u = (field: keyof ArbeitsauftragServicebericht, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const addZeit = () => {
    if (!data) return;
    const newZeit: ArbeitsauftragZeit = {
      id: crypto.randomUUID(),
      datum: new Date().toISOString().split('T')[0],
      monteur: '',
      anfahrt_von: '',
      anfahrt_bis: '',
      anfahrt_km: 0,
      arbeitszeit_von: '',
      arbeitszeit_bis: '',
      pausen: 0,
      rueckfahrt_von: '',
      rueckfahrt_bis: '',
      rueckfahrt_km: 0
    };
    setData({ ...data, zeiten: [...data.zeiten, newZeit] });
  };

  const updateZeit = (index: number, field: keyof ArbeitsauftragZeit, value: any) => {
    if (!data) return;
    const updated = [...data.zeiten];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, zeiten: updated });
  };

  const deleteZeit = (index: number) => {
    if (!data) return;
    setData({ ...data, zeiten: data.zeiten.filter((_, i) => i !== index) });
  };

  const save = async () => {
    if (!data) return;
    const errs = validateArbeitsauftrag(data);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    try {
      if (data.created_at === data.updated_at) {
        await arbeitsauftragService.create(data);
      } else {
        await arbeitsauftragService.update(data.id, data);
      }
      setErrors([]);
      alert('Gespeichert!');
    } catch (error) {
      setErrors(['Fehler beim Speichern']);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Lade...</div>;
  if (!data) return <div style={{ padding: '20px' }}>Fehler</div>;

  return (
    <div style={{ maxWidth: 'calc(100vw - 270px)' }}>
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

      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={save} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Speichern</button>
        <PDFDownloadLink
          document={<ArbeitsauftragPDF data={data} />}
          fileName={`Arbeitsauftrag_${data.datum}_${new Date().toISOString().split('T')[0]}.pdf`}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}
        >
          {({ loading }) => (loading ? 'Generiere PDF...' : 'PDF herunterladen')}
        </PDFDownloadLink>
      </div>

      {errors.length > 0 && <div className="no-print" style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}

      {/* FORM VIEW */}
      <div className="form-view">
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Arbeitsauftrag / Servicebericht</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Datum *</label>
              <input type="date" value={data.datum} onChange={(e) => u('datum', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kd-Nr.</label>
              <input type="text" value={data.kd_nr} onChange={(e) => u('kd_nr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>1. Auftraggeber / Kunde</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Auftraggeber Name *</label>
              <input type="text" value={data.auftraggeber_name} onChange={(e) => u('auftraggeber_name', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bestellung</label>
              <input type="text" value={data.bestellung} onChange={(e) => u('bestellung', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Straße</label>
              <input type="text" value={data.auftraggeber_strasse} onChange={(e) => u('auftraggeber_strasse', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>AP Name</label>
              <input type="text" value={data.ap_name} onChange={(e) => u('ap_name', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Ort</label>
              <input type="text" value={data.auftraggeber_ort} onChange={(e) => u('auftraggeber_ort', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>AP Tel.</label>
              <input type="text" value={data.ap_tel} onChange={(e) => u('ap_tel', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kundenanschrift</label>
              <input type="text" value={data.kundenanschrift_name} onChange={(e) => u('kundenanschrift_name', e.target.value)} placeholder="Name" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', marginBottom: '5px' }} />
              <input type="text" value={data.kundenanschrift_adresse} onChange={(e) => u('kundenanschrift_adresse', e.target.value)} placeholder="Adresse" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>2. Fahrzeug / Arbeitsauftrag</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Fahrzeug</label>
              <input type="text" value={data.fahrzeug} onChange={(e) => u('fahrzeug', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Baujahr</label>
              <input type="text" value={data.baujahr} onChange={(e) => u('baujahr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kennzeichen</label>
              <input type="text" value={data.kennzeichen} onChange={(e) => u('kennzeichen', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>km od. BS</label>
              <input type="text" value={data.km_bs} onChange={(e) => u('km_bs', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Serien-Nr.</label>
              <input type="text" value={data.serien_nr} onChange={(e) => u('serien_nr', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Arbeitsauftrag</label>
            <textarea value={data.arbeitsauftrag} onChange={(e) => u('arbeitsauftrag', e.target.value)} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>3. Arbeitszeiten</h3>
            <button onClick={addZeit} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Zeile hinzufügen</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>Datum</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>Monteur</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>Anfahrt von</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>bis</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>km</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>Arbeitszeit von</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>bis</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>Pausen</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>Rückfahrt von</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>bis</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>km</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>Aktion</th>
                </tr>
              </thead>
              <tbody>
                {data.zeiten.map((zeit, index) => (
                  <tr key={zeit.id}>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="date" value={zeit.datum} onChange={(e) => updateZeit(index, 'datum', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="text" value={zeit.monteur} onChange={(e) => updateZeit(index, 'monteur', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="time" value={zeit.anfahrt_von} onChange={(e) => updateZeit(index, 'anfahrt_von', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="time" value={zeit.anfahrt_bis} onChange={(e) => updateZeit(index, 'anfahrt_bis', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="number" value={zeit.anfahrt_km} onChange={(e) => updateZeit(index, 'anfahrt_km', parseFloat(e.target.value) || 0)} style={{ width: '60px', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="time" value={zeit.arbeitszeit_von} onChange={(e) => updateZeit(index, 'arbeitszeit_von', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="time" value={zeit.arbeitszeit_bis} onChange={(e) => updateZeit(index, 'arbeitszeit_bis', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="number" value={zeit.pausen} onChange={(e) => updateZeit(index, 'pausen', parseFloat(e.target.value) || 0)} style={{ width: '60px', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="time" value={zeit.rueckfahrt_von} onChange={(e) => updateZeit(index, 'rueckfahrt_von', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="time" value={zeit.rueckfahrt_bis} onChange={(e) => updateZeit(index, 'rueckfahrt_bis', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                      <input type="number" value={zeit.rueckfahrt_km} onChange={(e) => updateZeit(index, 'rueckfahrt_km', parseFloat(e.target.value) || 0)} style={{ width: '60px', padding: '4px', border: 'none', fontSize: '11px' }} />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      <button onClick={() => deleteZeit(index)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>4. Ausgeführte Arbeiten</h3>
          <textarea value={data.ausgefuehrte_arbeiten} onChange={(e) => u('ausgefuehrte_arbeiten', e.target.value)} rows={5} placeholder="Wartung und SKP..." style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>5. Material</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label><input type="checkbox" checked={data.material_grobstaubfilter} onChange={(e) => u('material_grobstaubfilter', e.target.checked)} /> Grobstaubfilter S8.2G</label>
            <label><input type="checkbox" checked={data.material_schwebstofffilter} onChange={(e) => u('material_schwebstofffilter', e.target.checked)} /> Schwebstofffilter S8.3S</label>
            <label><input type="checkbox" checked={data.material_aktivkohlefilter} onChange={(e) => u('material_aktivkohlefilter', e.target.checked)} /> Aktivkohlefilter S8.4C-AB</label>
            <label><input type="checkbox" checked={data.material_umluftfilter} onChange={(e) => u('material_umluftfilter', e.target.checked)} /> Umluftfilter UA31-1S</label>
          </div>
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sonstiges</label>
            <input type="text" value={data.material_sonstiges} onChange={(e) => u('material_sonstiges', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>6. Bemerkungen</h3>
          <textarea value={data.bemerkungen} onChange={(e) => u('bemerkungen', e.target.value)} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>7. Unterschriften</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Unterschrift Monteur *</label>
              <input type="text" value={data.unterschrift_monteur} onChange={(e) => u('unterschrift_monteur', e.target.value)} placeholder="Name eingeben" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Unterschrift Kunde</label>
              <input type="text" value={data.unterschrift_kunde} onChange={(e) => u('unterschrift_kunde', e.target.value)} placeholder="Name eingeben" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* PRINT VIEW */}
      <div className="print-view" style={{ maxWidth: '100%', margin: '0 auto', backgroundColor: 'white', padding: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Heduschka <span style={{ fontSize: '14px', fontWeight: 'normal' }}>GmbH</span></h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Datum:</div>
            <div style={{ borderBottom: '1px solid #000', minWidth: '150px', paddingBottom: '2px' }}>{data.datum}</div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px', width: '120px' }}>Auftraggeber:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>
                {data.auftraggeber_name}<br />
                {data.auftraggeber_strasse}<br />
                {data.auftraggeber_ort}
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px', width: '80px' }}>Kd-Nr.:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px', width: '100px' }}>{data.kd_nr}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Kundenanschrift:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>
                {data.kundenanschrift_name}<br />
                {data.kundenanschrift_adresse}
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Bestellung</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }} colSpan={2}></td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>AP:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>{data.ap_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }} colSpan={2}></td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Tel.:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>{data.ap_tel}</td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px', width: '120px' }}>Fahrzeug:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>{data.fahrzeug}</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px', width: '80px' }}>Baujahr:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px', width: '100px' }}>{data.baujahr}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Kennzeichen:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>{data.kennzeichen}</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>km od. BS:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }}>{data.km_bs}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontWeight: 'bold', fontSize: '11px' }}>Serien-Nr.:</td>
              <td style={{ padding: '4px 8px', border: '1px solid #000', fontSize: '11px' }} colSpan={3}>{data.serien_nr}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginBottom: '10px', fontSize: '11px', fontStyle: 'italic' }}>
          <strong>Arbeitsauftrag:</strong> {data.arbeitsauftrag}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', border: '1px solid #000', fontSize: '10px' }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={{ padding: '4px', border: '1px solid #000' }}>Datum</th>
              <th style={{ padding: '4px', border: '1px solid #000' }}>Monteur</th>
              <th style={{ padding: '4px', border: '1px solid #000' }} colSpan={2}>Anfahrt<br />von | bis</th>
              <th style={{ padding: '4px', border: '1px solid #000' }}>km</th>
              <th style={{ padding: '4px', border: '1px solid #000' }} colSpan={2}>Arbeitszeit<br />von | bis</th>
              <th style={{ padding: '4px', border: '1px solid #000' }}>Pausen</th>
              <th style={{ padding: '4px', border: '1px solid #000' }} colSpan={2}>Rückfahrt<br />von | bis</th>
              <th style={{ padding: '4px', border: '1px solid #000' }}>km</th>
            </tr>
          </thead>
          <tbody>
            {data.zeiten.map((zeit, i) => (
              <tr key={i}>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.datum}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.monteur}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.anfahrt_von}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.anfahrt_bis}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.anfahrt_km}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.arbeitszeit_von}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.arbeitszeit_bis}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.pausen}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.rueckfahrt_von}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.rueckfahrt_bis}</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>{zeit.rueckfahrt_km}</td>
              </tr>
            ))}
            {[...Array(Math.max(0, 4 - data.zeiten.length))].map((_, i) => (
              <tr key={`empty-${i}`}>
                <td style={{ padding: '4px', border: '1px solid #000', height: '20px' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
                <td style={{ padding: '4px', border: '1px solid #000' }}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '5px' }}>Ausgeführte Arbeiten</div>
          <div style={{ border: '1px solid #000', padding: '8px', minHeight: '60px', fontSize: '11px', whiteSpace: 'pre-wrap' }}>
            {data.ausgefuehrte_arbeiten}
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '5px' }}>Bemerkungen:</div>
          <div style={{ border: '1px solid #000', padding: '8px', minHeight: '40px', fontSize: '11px', whiteSpace: 'pre-wrap' }}>
            {data.bemerkungen}
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '5px' }}>Material:</div>
          <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
            {data.material_grobstaubfilter && <div>Grobstaubfilter S8.2G</div>}
            {data.material_schwebstofffilter && <div>Schwebstofffilter S8.3S</div>}
            {data.material_aktivkohlefilter && <div>Aktivkohlefilter S8.4C-AB</div>}
            {data.material_umluftfilter && <div>Umluftfilter UA31-1S</div>}
            {data.material_sonstiges && <div>{data.material_sonstiges}</div>}
          </div>
        </div>

        <div style={{ fontSize: '9px', marginBottom: '15px', lineHeight: '1.4' }}>
          Rücksendungen nur innerhalb von 8 Tagen nach unserer schriftlichen Leistung. Für alle Maschinen, Ersatzteile und Waren gelten die Gewährleistungsbestimmungen des Herstellers. Die mit dieser Unterschrift wird bestätigt, dass die Arbeiten ordnungsgemäß durchgeführt wurden, die den genannten Reise- und Arbeitszeit, sowie km angefallen sind und dass die Materialkosten in angeführter Ersatzteile bezahlt werden.
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #000', width: '50%', verticalAlign: 'bottom' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '30px' }}>Unterschrift Monteur</div>
                <div style={{ borderTop: '1px solid #000', paddingTop: '5px', fontSize: '11px' }}>{data.unterschrift_monteur}</div>
              </td>
              <td style={{ padding: '8px', border: '1px solid #000', width: '50%', verticalAlign: 'bottom' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '30px' }}>Stempel/ Unterschrift Kunde bzw. Bevollmächtigter Druckbuchstaben</div>
                <div style={{ borderTop: '1px solid #000', paddingTop: '5px', fontSize: '11px' }}>{data.unterschrift_kunde}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: '9px', textAlign: 'center', marginTop: '15px', borderTop: '1px solid #000', paddingTop: '5px' }}>
          &gt;&gt; Es gelten unsere allgemeinen Geschäftsbedingungen (AGB), die Sie umständig und unter www.heduschka.de finden &lt;&lt;<br />
          Heduschka GmbH • Buchwälder Str. 28 • 01968 Senftenberg • Tel. 03573 79 32 • Fax 03573 79 33 • info@heduschka.de • www.heduschka.de
        </div>
      </div>
    </div>
  );
};

export default ArbeitsauftragModule;
