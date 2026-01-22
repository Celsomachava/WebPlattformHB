export interface PruefprotokollDGUV201004 {
  id: string;
  service_anfrage_id: string;
  
  // Section 1 - Auftraggeber / Betreiber
  kalenderjahr: number;
  auftraggeber_name: string;
  auftraggeber_strasse: string;
  auftraggeber_ort: string;
  betreiber_name: string;
  betreiber_strasse: string;
  betreiber_ort: string;
  projekt: string;
  kostenstelle: string;
  
  // Section 2 - Gerät / Fahrzeug
  fahrzeug_geraet: string;
  hersteller_typ: string;
  fahrgestell_nr: string;
  bs_km_stand: string;
  baujahr: string;
  motor: string;
  motor_hersteller_typ: string;
  e_anlage: string;
  
  // Section 3 - Atemluft - Filteranlage
  atemluft_hersteller_typ: string;
  atemluft_seriennr: string;
  atemluft_baujahr: string;
  atemluft_gewicht: string;
  ueberdruck_ueberwachung_typ: string;
  ueberdruck_ueberwachung_seriennr: string;
  umluft_filteranlage_typ: string;
  umluft_filteranlage_seriennr: string;
  
  // Section 4 - Dokumentation
  betriebsanleitung_vorhanden: string;
  filterkarte_vorhanden: string;
  hinweisschild_kabinendruck: string;
  
  // Section 5 - Filteranlage montiert
  montage_auf_dach: boolean;
  montage_links_hinter_kabine: boolean;
  montage_rechts_neben_kabine: boolean;
  montage_direkt_hinter_kabine: boolean;
  montage_links_neben_kabine: boolean;
  montage_rechts_hinter_kabine: boolean;
  
  // Section 6 - Filterwechsel / Wartung
  sicherer_standplatz: string;
  zugangssysteme_vorhanden: string;
  rops_fops_unbeschaedigt: string;
  ruettelfest_montiert: string;
  vorgesehene_anschlagpunkte_genutzt: string;
  
  // Section 7 - Sicht / Bewegung
  bewegungseinschraenkung: string;
  sichtbeschraenkung: string;
  original_spiegel_ok: string;
  ultraschall_warnsystem: string;
  einschraenkung_richtlinien: string;
  tuer_oeffnungen_beeintraechtigt: string;
  
  // Section 8 - Überdrucksystem
  kontrollanzeige_vorhanden: string;
  optische_warnung: string;
  akustische_warnung: string;
  ansprechzeit_ok: string;
  alarm_untergrenze: string;
  alarm_obergrenze: string;
  
  // Section 9 - Additional Filter / Monitoring
  kontrollanzeige_aktivkohlefilter: string;
  kontrollanzeige_partikelfilter: string;
  betriebsstundenzaehler_vorhanden: string;
  betriebsanzeige_gruen_sichtbar: string;
  
  // Section 10 - Sicherheitsmaßnahmen Fahrerkabine
  auto_einschaltung_hauptmotor: string;
  hinweisschild_frischluft: string;
  fluchtfiltergeraet_vorhanden: string;
  funkverkehr_vorhanden: string;
  notausstieg_blockiert: string;
  notausstieg_nothammer: string;
  laermgrenzwert_unter_85db: string;
  
  // Section 11 - Kabinenabdichtung
  kabine_abdichtung_ok: string;
  hebeschiebefenster_blockiert: string;
  aussenluft_heizung_abgedichtet: string;
  durchfuehrungen_abgedichtet: string;
  ueberdruck_laufend: string;
  luftzufuhr_laufend: string;
  
  // Section 12 - Klimaanlage
  klima_vorhanden: string;
  klima_typ_hersteller: string;
  klima_kondensator: string;
  klima_verdampfer: string;
  kaeltemittel: string;
  kompressor: string;
  klima_umluftwirkung: string;
  
  // Section 13 - Heizung
  heizung_vorhanden: string;
  heizung_typ_hersteller: string;
  heizung_umluftbetrieb: string;
  
  // Section 15 - Mängel/Bemerkungen
  maengel_bemerkungen: string;
  nachkontrolle_erforderlich: string;
  ort: string;
  protokoll_datum: string;
  auftraggeber_betreiber: string;
  servicetechniker: string;
  
  created_at: number;
  updated_at: number;
}
