import { PruefprotokollDGUV201004 } from '../types/pruefprotokoll';

export const validatePruefprotokoll = (data: Partial<PruefprotokollDGUV201004>): string[] => {
  const errors: string[] = [];
  
  if (!data.kalenderjahr) errors.push('Kalenderjahr ist erforderlich');
  if (!data.auftraggeber_name) errors.push('Auftraggeber Name ist erforderlich');
  if (!data.ort) errors.push('Ort ist erforderlich');
  if (!data.protokoll_datum) errors.push('Protokoll Datum ist erforderlich');
  if (!data.servicetechniker_unterschrift) errors.push('Servicetechniker Unterschrift ist erforderlich');
  
  return errors;
};
