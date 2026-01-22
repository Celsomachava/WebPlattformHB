export interface ArbeitsauftragZeit {
  id: string;
  datum: string;
  monteur: string;
  anfahrt_von: string;
  anfahrt_bis: string;
  anfahrt_km: number;
  arbeitszeit_von: string;
  arbeitszeit_bis: string;
  pausen: number;
  rueckfahrt_von: string;
  rueckfahrt_bis: string;
  rueckfahrt_km: number;
}

export interface ArbeitsauftragServicebericht {
  id: string;
  service_anfrage_id: string;
  datum: string;
  
  // Auftraggeber / Kunde
  auftraggeber_name: string;
  auftraggeber_strasse: string;
  auftraggeber_ort: string;
  kd_nr: string;
  kundenanschrift_name: string;
  kundenanschrift_adresse: string;
  bestellung: string;
  ap_name: string;
  ap_tel: string;
  
  // Fahrzeug / Arbeitsauftrag
  fahrzeug: string;
  kennzeichen: string;
  serien_nr: string;
  baujahr: string;
  km_bs: string;
  arbeitsauftrag: string;
  
  // Arbeitszeiten
  zeiten: ArbeitsauftragZeit[];
  
  // Ausgeführte Arbeiten
  ausgefuehrte_arbeiten: string;
  
  // Material
  material_zeile1_col1: string;
  material_zeile1_col2: string;
  material_zeile1_col3: string;
  material_zeile2_col1: string;
  material_zeile2_col2: string;
  material_zeile2_col3: string;
  material_zeile3_col1: string;
  material_zeile3_col2: string;
  material_zeile3_col3: string;
  material_zeile4_col1: string;
  material_zeile4_col2: string;
  material_zeile4_col3: string;
  
  // Bemerkungen
  bemerkungen: string;
  
  // Signatures
  unterschrift_monteur: string;
  unterschrift_kunde: string;
  
  created_at: number;
  updated_at: number;
}
