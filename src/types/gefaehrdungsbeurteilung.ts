export interface GefaehrdungsbeurteilungAussendienst {
  id: string;
  service_anfrage_id: string;
  
  // Header
  unternehmen: string;
  verantwortlicher: string;
  arbeitsbereich: string;
  ap_vor_ort: string;
  taetigkeit: string;
  arbeitsbeginn: string;
  arbeitsauftrag: string;
  auftraggeber: string;
  datum: string;
  
  // Gefährdungen
  mechanische_gefaehrdung: boolean;
  mechanische_gefaehrdung_bem: string;
  elektrische_gefaehrdung: boolean;
  elektrische_gefaehrdung_bem: string;
  chemische_gefaehrdung: boolean;
  chemische_gefaehrdung_bem: string;
  biologische_gefaehrdung: boolean;
  biologische_gefaehrdung_bem: string;
  brand_explosion: boolean;
  brand_explosion_bem: string;
  thermische_gefaehrdung: boolean;
  thermische_gefaehrdung_bem: string;
  physikalische_gefaehrdung: boolean;
  physikalische_gefaehrdung_bem: string;
  umgebungsbedingte_gefaehrdung: boolean;
  umgebungsbedingte_gefaehrdung_bem: string;
  physische_belastungen: boolean;
  physische_belastungen_bem: string;
  verkehrswege: boolean;
  verkehrswege_bem: string;
  warnweste: boolean;
  warnweste_bem: string;
  sonstige_gefaehrdung: string;
  sonstige_gefaehrdung_bem: string;
  
  // PSA
  schutzschuhe_s3: boolean;
  schutzschuhe_s3_bem: string;
  schutzkleidung: boolean;
  schutzkleidung_bem: string;
  helm_basecap: boolean;
  helm_basecap_bem: string;
  schutzbrille: boolean;
  schutzbrille_bem: string;
  gehoerschutz: boolean;
  gehoerschutz_bem: string;
  atemschutz: boolean;
  atemschutz_bem: string;
  handschuhe: boolean;
  handschuhe_bem: string;
  einweganzug: boolean;
  einweganzug_bem: string;
  hautpflege_schutz: boolean;
  hautpflege_schutz_bem: string;
  fallschutz: boolean;
  fallschutz_bem: string;
  sonstige_psa: string;
  sonstige_psa_bem: string;
  
  // Arbeitsmittel / Genehmigungen
  leiter_geruest: boolean;
  leiter_geruest_bem: string;
  sonstige_arbeitsmittel: string;
  sonstige_arbeitsmittel_bem: string;
  schweisserlaubnis: boolean;
  schweisserlaubnis_bem: string;
  befahrerlaubnis: boolean;
  befahrerlaubnis_bem: string;
  besondere_genehmigung: string;
  besondere_genehmigung_bem: string;
  spezifische_sicherheitshinweise: string;
  
  // Unterweisung
  unterweisung_datum: string;
  unterweisung_name: string;
  unterweisung_unterschrift: string;
  
  // Audit
  final_submission: boolean;
  created_at: number;
  updated_at: number;
}
