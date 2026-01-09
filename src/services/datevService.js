class DatevService {
  exportCSV(rechnungen) {
    const headers = [
      'Debitor',
      'Rechnungsnummer', 
      'Datum',
      'Netto',
      'MwSt',
      'Brutto',
      'Sachkonto',
      'Kostenstelle'
    ];

    const rows = rechnungen.map(rechnung => {
      const datevData = {
        debitor: rechnung.kunden_id,
        rechnungsnummer: rechnung.nummernkreis,
        datum: new Date(rechnung.created_at).toLocaleDateString('de-DE'),
        netto: rechnung.netto,
        mwst: rechnung.mwst_betrag,
        brutto: rechnung.brutto,
        sachkonto: '8400',
        kostenstelle: 'FILTER'
      };

      return [
        datevData.debitor,
        datevData.rechnungsnummer,
        datevData.datum,
        datevData.netto.toFixed(2),
        datevData.mwst.toFixed(2),
        datevData.brutto.toFixed(2),
        datevData.sachkonto,
        datevData.kostenstelle
      ].join(';');
    });

    return [headers.join(';'), ...rows].join('\n');
  }

  downloadCSV(csvContent, filename = 'datev-export.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export const datevService = new DatevService();