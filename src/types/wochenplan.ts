export interface WochenplanRow {
  id: string;
  wochentag: 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr';
  datum: string;
  geplante_zeit: string;
  firma: string;
  standort: string;
  auftrag: string;
  filter: string;
  hotel_name: string;
  adresse: string;
  storno_bis: string;
  preis: number;
  inkl_fs: boolean;
  geb: boolean;
  bez: boolean;
}

export interface Wochenplan {
  id: string;
  service_anfrage_id: string;
  kalenderwoche: number;
  servicetechniker: string;
  rows: WochenplanRow[];
  information: string;
  geld_mitgeben: number;
  km_ca: number;
  tanken: number;
  puffer: number;
  hotel_kosten: number;
  unterschrift_monteur: string;
  unterschrift_service: string;
  zurueck_datum: string;
  created_at: number;
  updated_at: number;
}

export interface WochenplanFormData {
  kalenderwoche: number;
  servicetechniker: string;
  information: string;
  geld_mitgeben: number;
  km_ca: number;
  tanken: number;
  puffer: number;
  hotel_kosten: number;
  unterschrift_monteur: string;
  unterschrift_service: string;
  zurueck_datum: string;
}

export interface WochenplanCalculations {
  daily_totals: Record<string, number>;
  weekly_total: number;
}
