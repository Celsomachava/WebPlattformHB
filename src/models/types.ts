// Heduschka Form Data Models

export interface Kundendaten {
  kunden_id: string;
  name: string;
  firma?: string;
  ansprechpartner: string;
  telefon: string;
  email: string;
  adresse?: string;
}

export interface Anlagendaten {
  anlagen_id: string;
  standort: string;
  anlagentyp: string;
  seriennummer?: string;
  baujahr?: number;
  hersteller?: string;
}

export interface Serviceangaben {
  serviceart: 'wartung' | 'reparatur' | 'notfall' | 'beratung';
  dringlichkeit: 'niedrig' | 'normal' | 'hoch' | 'kritisch';
  beschreibung: string;
  gewuenschter_termin?: string;
}

export interface Zusatzinformationen {
  bemerkungen?: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  filename: string;
  data: string; // base64 encoded
  size: number;
  type: string;
}

export interface Rechtliches {
  datenschutz_zustimmung: boolean;
  agb_akzeptiert: boolean;
  marketing_zustimmung?: boolean;
}

export interface FormTemplate {
  id: string;
  version: string;
  sections: {
    kundendaten: Partial<Kundendaten>;
    anlagendaten: Partial<Anlagendaten>;
    serviceangaben: Partial<Serviceangaben>;
    zusatzinformationen: Partial<Zusatzinformationen>;
    rechtliches: Partial<Rechtliches>;
  };
  created_at: string;
}

export interface FormData {
  kundendaten: Kundendaten;
  anlagendaten: Anlagendaten;
  serviceangaben: Serviceangaben;
  zusatzinformationen: Zusatzinformationen;
  rechtliches: Rechtliches;
}

export interface Submission {
  id?: number;
  formData: FormData;
  status: 'pending' | 'synced' | 'error';
  timestamp: number;
  sync_attempts?: number;
  error_message?: string;
}

// API Payload (Section 8 format)
export interface ApiPayload {
  kunden_id: string;
  anlagen_id: string;
  serviceart: string;
  dringlichkeit: string;
  beschreibung: string;
  bemerkungen?: string;
  gewuenschter_termin?: string;
  photos?: string[];
  datenschutz_zustimmung: boolean;
  agb_akzeptiert: boolean;
  timestamp: number;
}

// Billing Module Types
export interface AngebotPosition {
  id: string;
  artikel: string;
  leistung: string;
  arbeitszeit: number;
  anfahrt: number;
  filter: number;
  pauschalen: number;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
}

export interface Angebot {
  id?: number;
  nummernkreis: string;
  kunden_id: string;
  service_anfrage_id?: number;
  positionen: AngebotPosition[];
  rabatt: number;
  mwst: number;
  netto: number;
  brutto: number;
  status: 'entwurf' | 'versendet' | 'angenommen' | 'abgelehnt';
  gueltig_bis: string;
  created_at: string;
  updated_at: string;
  version: number;
  parent_id?: number;
}

export interface Rechnung {
  id?: number;
  nummernkreis: string;
  angebot_id?: number;
  kunden_id: string;
  positionen: AngebotPosition[];
  mwst_saetze: { [key: string]: number };
  zahlungsbedingungen: string;
  netto: number;
  mwst_betrag: number;
  brutto: number;
  status: 'offen' | 'bezahlt' | 'ueberfaellig' | 'storniert';
  faellig_am: string;
  bezahlt_am?: string;
  created_at: string;
}

export interface DatevExport {
  debitor: string;
  rechnungsnummer: string;
  datum: string;
  netto: number;
  mwst: number;
  brutto: number;
  sachkonto: string;
  kostenstelle: string;
}

// Draft for offline support
export interface Draft {
  id: string;
  type: 'angebot' | 'rechnung' | 'submission';
  user_id: string;
  data: any;
  created_at: string;
  synced: boolean;
  synced_at?: string;
}

// Database Schema Types
export interface DBSchema {
  submissions: {
    key: number;
    value: Submission;
    indexes: {
      'by-status': string;
      'by-timestamp': number;
      'by-kunden-id': string;
    };
  };
  templates: {
    key: string;
    value: FormTemplate;
  };
  angebote: {
    key: number;
    value: Angebot;
    indexes: {
      'by-kunden-id': string;
      'by-status': string;
      'by-nummernkreis': string;
      'by-created-at': string;
    };
  };
  rechnungen: {
    key: number;
    value: Rechnung;
    indexes: {
      'by-kunden-id': string;
      'by-status': string;
      'by-nummernkreis': string;
      'by-angebot-id': number;
      'by-created-at': string;
    };
  };
  drafts: {
    key: string;
    value: Draft;
    indexes: {
      'by-type': string;
      'by-user-id': string;
      'by-created-at': string;
    };
  };
}

// User and Auth Types
export interface User {
  kunden_id: string;
  role: 'admin' | 'kunde';
  id: string;
}

// Statistics Types
export interface Statistics {
  totalSubmissions: number;
  totalAngebote: number;
  totalRechnungen: number;
  monthlyUmsatz: number;
  offenerBetrag: number;
  pendingSubmissions: number;
  activeAngebote: number;
  offeneRechnungen: number;
}