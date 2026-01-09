import { ArbeitsauftragServicebericht, ArbeitsauftragZeit } from '../types/arbeitsauftrag';

export const validateTime = (time: string): boolean => {
  if (!time) return true;
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

export const validateZeit = (zeit: ArbeitsauftragZeit): string[] => {
  const errors: string[] = [];
  
  if (zeit.anfahrt_von && !validateTime(zeit.anfahrt_von)) errors.push('Ungültige Anfahrt Von Zeit');
  if (zeit.anfahrt_bis && !validateTime(zeit.anfahrt_bis)) errors.push('Ungültige Anfahrt Bis Zeit');
  if (zeit.arbeitszeit_von && !validateTime(zeit.arbeitszeit_von)) errors.push('Ungültige Arbeitszeit Von');
  if (zeit.arbeitszeit_bis && !validateTime(zeit.arbeitszeit_bis)) errors.push('Ungültige Arbeitszeit Bis');
  if (zeit.rueckfahrt_von && !validateTime(zeit.rueckfahrt_von)) errors.push('Ungültige Rückfahrt Von Zeit');
  if (zeit.rueckfahrt_bis && !validateTime(zeit.rueckfahrt_bis)) errors.push('Ungültige Rückfahrt Bis Zeit');
  
  if (zeit.anfahrt_km < 0) errors.push('Anfahrt KM muss >= 0 sein');
  if (zeit.rueckfahrt_km < 0) errors.push('Rückfahrt KM muss >= 0 sein');
  if (zeit.pausen < 0) errors.push('Pausen muss >= 0 sein');
  
  return errors;
};

export const validateArbeitsauftrag = (data: Partial<ArbeitsauftragServicebericht>): string[] => {
  const errors: string[] = [];
  
  if (!data.auftraggeber_name) errors.push('Auftraggeber Name ist erforderlich');
  if (!data.datum) errors.push('Datum ist erforderlich');
  if (!data.unterschrift_monteur) errors.push('Unterschrift Monteur ist erforderlich');
  
  if (data.zeiten) {
    data.zeiten.forEach((zeit, index) => {
      const zeitErrors = validateZeit(zeit);
      zeitErrors.forEach(err => errors.push(`Zeile ${index + 1}: ${err}`));
    });
  }
  
  return errors;
};
