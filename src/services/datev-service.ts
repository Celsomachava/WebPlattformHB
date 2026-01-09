// DATEV Export Service
import { Rechnung, DatevExport } from '../models/vibe-types';

class DatevService {
  async exportCSV(rechnungen: Rechnung[]): Promise<string> {
    const datevData = rechnungen.map(rechnung => this.convertToDatev(rechnung));
    return this.generateCSV(datevData);
  }

  private convertToDatev(rechnung: Rechnung): DatevExport {
    return {
      debitor: rechnung.kunden_id,
      rechnungsnummer: rechnung.nummer,
      rechnungsdatum: new Date(rechnung.created_at).toISOString().split('T')[0],
      nettobetrag: rechnung.netto,
      mwst: rechnung.mwst_betrag,
      bruttobetrag: rechnung.brutto,
      sachkonto: '8400', // Standard Erlöskonto
      kostenstelle: 'SERVICE'
    };
  }

  private generateCSV(data: DatevExport[]): string {
    const headers = [
      'Debitor',
      'Rechnungsnummer', 
      'Rechnungsdatum',
      'Nettobetrag',
      'MwSt',
      'Bruttobetrag',
      'Sachkonto',
      'Kostenstelle'
    ];

    const rows = data.map(item => [
      item.debitor,
      item.rechnungsnummer,
      item.rechnungsdatum,
      item.nettobetrag.toFixed(2),
      item.mwst.toFixed(2),
      item.bruttobetrag.toFixed(2),
      item.sachkonto,
      item.kostenstelle || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(';'))
      .join('\n');
  }

  async downloadCSV(rechnungen: Rechnung[], filename = 'datev-export.csv'): Promise<void> {
    const csv = await this.exportCSV(rechnungen);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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