export interface GefaehrdungsbeurteilungAussendienst {
  id: string;
  service_anfrage_id: string;
  
  // Header
  unternehmen: string;
  verantwortlicher: string;
  arbeitsbereich: string;
  arbeitsort: string;
  taetigkeit: string;
  arbeitsauftrag: string;
  auftraggeber: string;
  datum: string;
  
  // Gefährdungen
  mechanische_gefaehrdung: boolean;
  elektrische_gefaehrdung: boolean;
  chemische_gefaehrdung: boolean;
  biologische_gefaehrdung: boolean;
  brand_explosion: boolean;
  thermische_gefaehrdung: boolean;
  physikalische_gefaehrdung: boolean;
  umgebungsbedingungen: boolean;
  verkehrswege: boolean;
  sonstige_gefaehrdung: boolean;
  
  // PSA
  schutzhelm: boolean;
  schutzbrille: boolean;
  gehoerschutz: boolean;
  handschuhe: boolean;
  ffp2_maske: boolean;
  einweghandschuhe: boolean;
  sonstige_psa: string;
  
  // Arbeitsmittel / Genehmigungen
  leiter_geruest: boolean;
  schweisserlaubnis: boolean;
  befahrschein: boolean;
  besondere_genehmigung: string;
  
  // Unterweisung
  unterweisung_durchgefuehrt: boolean;
  unterweisung_datum: string;
  unterweisung_name: string;
  unterweisung_unterschrift: string;
  
  // Audit
  final_submission: boolean;
  created_at: number;
  updated_at: number;
}
