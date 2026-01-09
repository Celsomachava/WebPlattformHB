import { GefaehrdungsbeurteilungAussendienst } from '../types/gefaehrdungsbeurteilung';

export const validateGefaehrdungsbeurteilung = (data: Partial<GefaehrdungsbeurteilungAussendienst>): string[] => {
  const errors: string[] = [];
  
  if (!data.unternehmen) errors.push('Unternehmen ist erforderlich');
  if (!data.verantwortlicher) errors.push('Verantwortlicher ist erforderlich');
  if (!data.arbeitsbereich) errors.push('Arbeitsbereich ist erforderlich');
  if (!data.taetigkeit) errors.push('Tätigkeit ist erforderlich');
  if (!data.datum) errors.push('Datum ist erforderlich');
  
  if (data.unterweisung_durchgefuehrt && !data.unterweisung_unterschrift) {
    errors.push('Unterschrift ist erforderlich wenn Unterweisung durchgeführt wurde');
  }
  
  return errors;
};
