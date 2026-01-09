// DATEV Export Service
export const exportCSV = (rechnungen) => {
  const csvHeader = [
    'Debitor',
    'Rechnungsnummer', 
    'Datum',
    'Netto',
    'MwSt',
    'Brutto',
    'Sachkonto',
    'Kostenstelle'
  ].join(';');

  const csvRows = rechnungen.map(rechnung => {
    const datum = new Date(rechnung.created_at).toLocaleDateString('de-DE');
    
    return [
      rechnung.kunden_id,
      rechnung.nummernkreis,
      datum,
      rechnung.netto.toFixed(2).replace('.', ','),
      rechnung.mwst_betrag.toFixed(2).replace('.', ','),
      rechnung.brutto.toFixed(2).replace('.', ','),
      '8400', // Standard Sachkonto für Erlöse
      '001'   // Standard Kostenstelle
    ].join(';');
  });

  const csvContent = [csvHeader, ...csvRows].join('\n');
  
  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `DATEV_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return csvContent;
};

export const exportASCII = (rechnungen) => {
  // DATEV ASCII format implementation
  const header = 'EXTF';
  const version = '700';
  const formatKennzeichen = '21'; // Buchungsstapel
  const versionsnummer = '8';
  const datenkategorie = '21';
  const formatversion = '9';
  const erzeugtAm = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  const headerLine = [
    header,
    version,
    formatKennzeichen,
    versionsnummer,
    datenkategorie,
    formatversion,
    erzeugtAm,
    '', // Importiert am (leer)
    'Heduschka GmbH',
    '', // Berater
    '', // Mandant
    '', // WJ-Beginn
    '', // Sachkontenlänge
    '', // Datum von
    '', // Datum bis
    '', // Bezeichnung
    '', // Diktatkürzel
    '', // Buchungstyp
    '', // Rechnungslegungszweck
    '', // Festschreibung
    'EUR' // Währungskennzeichen
  ].join(';');

  const dataLines = rechnungen.map(rechnung => {
    const datum = new Date(rechnung.created_at).toLocaleDateString('de-DE').replace(/\./g, '');
    
    return [
      rechnung.brutto.toFixed(2).replace('.', ','), // Umsatz
      'S', // Soll/Haben-Kennzeichen
      '', // WKZ Umsatz
      '', // Kurs
      '', // Basis-Umsatz
      '', // WKZ Basis-Umsatz
      '8400', // Konto
      '10000', // Gegenkonto (Debitor)
      '', // BU-Schlüssel
      datum, // Belegdatum
      '1', // Belegfeld 1
      rechnung.nummernkreis, // Belegfeld 2
      '', // Skonto
      rechnung.kunden_id, // Buchungstext
      '', // Postensperre
      '', // Diverse Adressnummer
      '', // Geschäftspartnerbank
      '', // Sachverhalt
      '', // Zinssperre
      '', // Beleglink
      '', // Beleginfo - Art 1
      '', // Beleginfo - Inhalt 1
      '', // Beleginfo - Art 2
      '', // Beleginfo - Inhalt 2
      '', // Beleginfo - Art 3
      '', // Beleginfo - Inhalt 3
      '', // Beleginfo - Art 4
      '', // Beleginfo - Inhalt 4
      '', // Beleginfo - Art 5
      '', // Beleginfo - Inhalt 5
      '', // Beleginfo - Art 6
      '', // Beleginfo - Inhalt 6
      '', // Beleginfo - Art 7
      '', // Beleginfo - Inhalt 7
      '', // Beleginfo - Art 8
      '', // Beleginfo - Inhalt 8
      '', // KOST1 - Kostenstelle
      '', // KOST2 - Kostenstelle
      '', // KOST-Menge
      '', // EU-Land u. UStID
      '', // EU-Steuersatz
      '', // Abw. Versteuerungsart
      '', // Sachverhalt L+L
      '', // Funktionsergänzung L+L
      '', // BU 49 Hauptfunktionstyp
      '', // BU 49 Hauptfunktionsnummer
      '', // BU 49 Funktionsergänzung
      '', // Zusatzinformation - Art 1
      '', // Zusatzinformation - Inhalt 1
      '', // Zusatzinformation - Art 2
      '', // Zusatzinformation - Inhalt 2
      '', // Zusatzinformation - Art 3
      '', // Zusatzinformation - Inhalt 3
      '', // Zusatzinformation - Art 4
      '', // Zusatzinformation - Inhalt 4
      '', // Zusatzinformation - Art 5
      '', // Zusatzinformation - Inhalt 5
      '', // Zusatzinformation - Art 6
      '', // Zusatzinformation - Inhalt 6
      '', // Zusatzinformation - Art 7
      '', // Zusatzinformation - Inhalt 7
      '', // Zusatzinformation - Art 8
      '', // Zusatzinformation - Inhalt 8
      '', // Zusatzinformation - Art 9
      '', // Zusatzinformation - Inhalt 9
      '', // Zusatzinformation - Art 10
      '', // Zusatzinformation - Inhalt 10
      '', // Zusatzinformation - Art 11
      '', // Zusatzinformation - Inhalt 11
      '', // Zusatzinformation - Art 12
      '', // Zusatzinformation - Inhalt 12
      '', // Zusatzinformation - Art 13
      '', // Zusatzinformation - Inhalt 13
      '', // Zusatzinformation - Art 14
      '', // Zusatzinformation - Inhalt 14
      '', // Zusatzinformation - Art 15
      '', // Zusatzinformation - Inhalt 15
      '', // Zusatzinformation - Art 16
      '', // Zusatzinformation - Inhalt 16
      '', // Zusatzinformation - Art 17
      '', // Zusatzinformation - Inhalt 17
      '', // Zusatzinformation - Art 18
      '', // Zusatzinformation - Inhalt 18
      '', // Zusatzinformation - Art 19
      '', // Zusatzinformation - Inhalt 19
      '', // Zusatzinformation - Art 20
      '', // Zusatzinformation - Inhalt 20
      '', // Stück
      '', // Gewicht
      '', // Zahlweise
      '', // Forderungsart
      '', // Veranlagungsjahr
      '', // Zugeordnete Fälligkeit
      '', // Skontotyp
      '', // Auftragsnummer
      '', // Buchungstyp
      '', // Ust-Schlüssel (Anzahlungen)
      '', // EU-Land (Anzahlungen)
      '', // Sachverhalt L+L (Anzahlungen)
      '', // EU-Steuersatz (Anzahlungen)
      '', // Erlöskonto (Anzahlungen)
      '', // Herkunft-Kz
      '', // Buchungs GUID
      '', // KOST-Datum
      '', // SEPA-Mandatsreferenz
      '', // Skontosperre
      '', // Gesellschaftername
      '', // Beteiligtennummer
      '', // Identifikationsnummer
      '', // Zeichnernummer
      '', // Postensperre bis
      '', // Bezeichnung SoBil-Sachverhalt
      '', // Kennzeichen SoBil-Buchung
      '', // Festschreibung
      '', // Leistungsdatum
      '', // Datum Zuord.Steuerperiode
      '', // Fälligkeit
      '', // Generalumkehr (GU)
      '', // Steuersatz
      '', // Land
    ].join(';');
  });

  const asciiContent = [headerLine, ...dataLines].join('\n');
  
  // Create and download ASCII file
  const blob = new Blob([asciiContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `DATEV_Export_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return asciiContent;
};

export const validateDatevData = (rechnungen) => {
  const errors = [];
  
  rechnungen.forEach((rechnung, index) => {
    if (!rechnung.kunden_id) {
      errors.push(`Rechnung ${index + 1}: Kunden-ID fehlt`);
    }
    if (!rechnung.nummernkreis) {
      errors.push(`Rechnung ${index + 1}: Rechnungsnummer fehlt`);
    }
    if (!rechnung.brutto || rechnung.brutto <= 0) {
      errors.push(`Rechnung ${index + 1}: Ungültiger Bruttobetrag`);
    }
    if (!rechnung.created_at) {
      errors.push(`Rechnung ${index + 1}: Erstellungsdatum fehlt`);
    }
  });
  
  return errors;
};