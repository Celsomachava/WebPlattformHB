import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Wochenplan, WochenplanRow } from '../../types/wochenplan';
import { wochenplanService } from '../../services/wochenplanService';
import { validateRow, validateWochenplan, calculateDailyTotals, calculateWeeklyTotal } from '../../utils/wochenplanValidation';
import { WochenplanPDF } from './pdf/WochenplanPDF';

interface WochenplanModuleProps {
  serviceAnfrageId: string;
}

const WochenplanModule: React.FC<WochenplanModuleProps> = ({ serviceAnfrageId }) => {
  const [plan, setPlan] = useState<Wochenplan | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const emptyRow = (): WochenplanRow => ({
    id: crypto.randomUUID(),
    wochentag: 'Mo',
    datum: '',
    geplante_zeit: '',
    firma: '',
    standort: '',
    auftrag: '',
    filter: '',
    hotel_name: '',
    adresse: '',
    storno_bis: '',
    preis: 0,
    inkl_fs: false,
    geb: false,
    bez: false
  });

  useEffect(() => {
    loadWochenplan();
  }, [serviceAnfrageId]);

  const loadWochenplan = async () => {
    try {
      const data = await wochenplanService.getByServiceRequest(serviceAnfrageId);
      if (data) {
        setPlan(data);
      } else {
        setPlan({
          id: crypto.randomUUID(),
          service_anfrage_id: serviceAnfrageId,
          kalenderwoche: getCurrentWeek(),
          servicetechniker: '',
          rows: [],
          information: '',
          geld_mitgeben: 0,
          km_ca: 0,
          tanken: 0,
          puffer: 0,
          hotel_kosten: 0,
          unterschrift_monteur: '',
          unterschrift_service: '',
          zurueck_datum: '',
          created_at: Date.now(),
          updated_at: Date.now()
        });
      }
    } catch (error) {
      setErrors(['Fehler beim Laden des Wochenplans']);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeek = (): number => {
    const date = new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const handleAddRow = () => {
    if (!plan) return;
    setPlan({
      ...plan,
      rows: [...plan.rows, emptyRow()]
    });
  };

  const handleUpdateRow = (rowId: string, field: keyof WochenplanRow, value: any) => {
    if (!plan) return;
    setPlan({
      ...plan,
      rows: plan.rows.map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    });
  };

  const handleDeleteRow = async (rowId: string) => {
    if (!plan) return;
    if (window.confirm('Zeile wirklich löschen?')) {
      try {
        await wochenplanService.deleteRow(plan.id, rowId);
        setPlan({
          ...plan,
          rows: plan.rows.filter(row => row.id !== rowId)
        });
      } catch (error) {
        setPlan({
          ...plan,
          rows: plan.rows.filter(row => row.id !== rowId)
        });
      }
    }
  };

  const handleSave = async () => {
    if (!plan) return;
    
    const validationErrors = validateWochenplan(plan);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (plan.created_at === plan.updated_at) {
        await wochenplanService.create(plan);
      } else {
        await wochenplanService.update(plan.id, plan);
      }
      setErrors([]);
      alert('Wochenplan erfolgreich gespeichert!');
    } catch (error) {
      setErrors(['Fehler beim Speichern']);
    }
  };



  if (loading) return <div style={{ padding: '20px' }}>Lade Wochenplan...</div>;
  if (!plan) return <div style={{ padding: '20px' }}>Kein Wochenplan gefunden</div>;

  const dailyTotals = calculateDailyTotals(plan.rows);
  const weeklyTotal = calculateWeeklyTotal(plan.rows);

  return (
    <div style={{ maxWidth: 'calc(100vw - 270px)' }} className="wochenplan-container">
      <style>{`
        @media print {
          * { margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; }
          body, html { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; }
          .no-print, nav, button, .sidebar, .topbar, h1, h2, h3, p, header, footer, .wochenplan-container > div:first-child { display: none !important; }
          .wochenplan-container { margin: 0 auto !important; padding: 0 !important; max-width: 100% !important; width: 100% !important; }
          table { page-break-inside: avoid; font-size: 10px !important; }
          @page { size: A4 landscape; margin: 10mm; }
        }
      `}</style>

      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Wochenplan</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Speichern
          </button>
          <PDFDownloadLink
            document={<WochenplanPDF data={plan} />}
            fileName={`Wochenplan_KW${plan.kalenderwoche}_${new Date().toISOString().split('T')[0]}.pdf`}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}
          >
            {({ loading }) => (loading ? 'Generiere PDF...' : 'PDF herunterladen')}
          </PDFDownloadLink>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="no-print" style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {errors.map((err, i) => <div key={i}>{err}</div>)}
        </div>
      )}

      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kalenderwoche (KW)</label>
            <input
              type="number"
              value={plan.kalenderwoche}
              onChange={(e) => setPlan({ ...plan, kalenderwoche: parseInt(e.target.value) })}
              min="1"
              max="53"
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Servicetechniker</label>
            <input
              type="text"
              value={plan.servicetechniker}
              onChange={(e) => setPlan({ ...plan, servicetechniker: e.target.value })}
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <button className="no-print" onClick={handleAddRow} style={{ marginBottom: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Zeile hinzufügen
        </button>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Tag</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Datum</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Zeit</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Firma</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Standort</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Auftrag</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Filter</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Hotel</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Adresse</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Storno bis</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'right' }}>Preis €</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>FS</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>Geb</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>Bez</th>
              <th className="no-print" style={{ padding: '8px', border: '1px solid #dee2e6' }}>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {plan.rows.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <select value={row.wochentag} onChange={(e) => handleUpdateRow(row.id, 'wochentag', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }}>
                    <option value="Mo">Mo</option>
                    <option value="Di">Di</option>
                    <option value="Mi">Mi</option>
                    <option value="Do">Do</option>
                    <option value="Fr">Fr</option>
                  </select>
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="date" value={row.datum} onChange={(e) => handleUpdateRow(row.id, 'datum', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="time" value={row.geplante_zeit} onChange={(e) => handleUpdateRow(row.id, 'geplante_zeit', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="text" value={row.firma} onChange={(e) => handleUpdateRow(row.id, 'firma', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="text" value={row.standort} onChange={(e) => handleUpdateRow(row.id, 'standort', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="text" value={row.auftrag} onChange={(e) => handleUpdateRow(row.id, 'auftrag', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="text" value={row.filter} onChange={(e) => handleUpdateRow(row.id, 'filter', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="text" value={row.hotel_name} onChange={(e) => handleUpdateRow(row.id, 'hotel_name', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="text" value={row.adresse} onChange={(e) => handleUpdateRow(row.id, 'adresse', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6' }}>
                  <input type="date" value={row.storno_bis} onChange={(e) => handleUpdateRow(row.id, 'storno_bis', e.target.value)} style={{ width: '100%', padding: '4px', border: 'none' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                  <input type="number" value={row.preis} onChange={(e) => handleUpdateRow(row.id, 'preis', parseFloat(e.target.value) || 0)} step="0.01" style={{ width: '100%', padding: '4px', border: 'none', textAlign: 'right' }} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                  <input type="checkbox" checked={row.inkl_fs} onChange={(e) => handleUpdateRow(row.id, 'inkl_fs', e.target.checked)} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                  <input type="checkbox" checked={row.geb} onChange={(e) => handleUpdateRow(row.id, 'geb', e.target.checked)} />
                </td>
                <td style={{ padding: '4px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                  <input type="checkbox" checked={row.bez} onChange={(e) => handleUpdateRow(row.id, 'bez', e.target.checked)} />
                </td>
                <td className="no-print" style={{ padding: '4px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                  <button onClick={() => handleDeleteRow(row.id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
            <tr>
              <td colSpan={10} style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'right' }}>Wochensumme:</td>
              <td style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'right' }}>€{weeklyTotal.toFixed(2)}</td>
              <td colSpan={4} style={{ padding: '8px', border: '1px solid #dee2e6' }}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Information</label>
            <textarea
              value={plan.information}
              onChange={(e) => setPlan({ ...plan, information: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Geld mitgeben €</label>
              <input type="number" value={plan.geld_mitgeben} onChange={(e) => setPlan({ ...plan, geld_mitgeben: parseFloat(e.target.value) || 0 })} step="0.01" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>KM ca.</label>
              <input type="number" value={plan.km_ca} onChange={(e) => setPlan({ ...plan, km_ca: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tanken €</label>
              <input type="number" value={plan.tanken} onChange={(e) => setPlan({ ...plan, tanken: parseFloat(e.target.value) || 0 })} step="0.01" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Puffer €</label>
              <input type="number" value={plan.puffer} onChange={(e) => setPlan({ ...plan, puffer: parseFloat(e.target.value) || 0 })} step="0.01" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hotel Kosten €</label>
              <input type="number" value={plan.hotel_kosten} onChange={(e) => setPlan({ ...plan, hotel_kosten: parseFloat(e.target.value) || 0 })} step="0.01" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Zurück Datum</label>
              <input type="date" value={plan.zurueck_datum} onChange={(e) => setPlan({ ...plan, zurueck_datum: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Unterschrift Monteur</label>
            <input type="text" value={plan.unterschrift_monteur} onChange={(e) => setPlan({ ...plan, unterschrift_monteur: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Unterschrift Service</label>
            <input type="text" value={plan.unterschrift_service} onChange={(e) => setPlan({ ...plan, unterschrift_service: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WochenplanModule;
