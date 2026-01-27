import React, { useState, useEffect } from 'react';

interface FormListManagerProps<T> {
  title: string;
  service: {
    getAll: () => Promise<T[]>;
    delete: (id: string) => Promise<void>;
  };
  renderForm: (id: string | null, onBack: () => void) => React.ReactNode;
  getItemLabel: (item: T) => string;
  getItemId: (item: T) => string;
  downloadPDF?: (item: T) => void;
}

export function FormListManager<T>({
  title,
  service,
  renderForm,
  getItemLabel,
  getItemId,
  downloadPDF
}: FormListManagerProps<T>) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await service.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      loadItems();
    }
  }, [view]);

  const handleNew = () => {
    setSelectedId(null);
    setView('form');
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setView('form');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Möchten Sie diesen Eintrag wirklich löschen?')) return;
    try {
      await service.delete(id);
      await loadItems();
      alert('Eintrag wurde erfolgreich gelöscht.');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Fehler beim Löschen');
    }
  };

  const handleBack = () => {
    setSelectedId(null);
    setView('list');
  };

  if (view === 'form') {
    return <>{renderForm(selectedId || 'new', handleBack)}</>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: 'calc(100vw - 270px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{title}</h1>
        <button onClick={handleNew} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          + Neu erstellen
        </button>
      </div>

      {loading ? (
        <div>Lade...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px' }}>
          <p>Keine Einträge vorhanden. Erstellen Sie einen neuen Eintrag.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Bezeichnung</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6', width: '300px' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={getItemId(item)} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{getItemLabel(item)}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(getItemId(item))} style={{ padding: '6px 12px', marginLeft: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Ansehen/Bearbeiten
                    </button>
                    {downloadPDF && (
                      <button onClick={() => downloadPDF(item)} style={{ padding: '6px 12px', marginLeft: '8px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        PDF
                      </button>
                    )}
                    <button onClick={() => handleDelete(getItemId(item))} style={{ padding: '6px 12px', marginLeft: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
