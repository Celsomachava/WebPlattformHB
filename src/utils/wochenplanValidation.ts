import { WochenplanRow, Wochenplan } from '../types/wochenplan';

export const validateNumeric = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validateDate = (date: string): boolean => {
  const parsed = new Date(date);
  return parsed instanceof Date && !isNaN(parsed.getTime());
};

export const validateStornoDate = (datum: string, storno_bis: string): boolean => {
  if (!storno_bis) return true;
  return new Date(storno_bis) >= new Date(datum);
};

export const validateRow = (row: WochenplanRow): string[] => {
  const errors: string[] = [];
  
  if (!row.wochentag) errors.push('Wochentag ist erforderlich');
  if (!row.datum) errors.push('Datum ist erforderlich');
  if (!validateDate(row.datum)) errors.push('Ungültiges Datum');
  if (!validateNumeric(row.preis)) errors.push('Preis muss numerisch sein');
  if (row.storno_bis && !validateStornoDate(row.datum, row.storno_bis)) {
    errors.push('Storno bis muss >= Datum sein');
  }
  
  return errors;
};

export const validateWochenplan = (plan: Partial<Wochenplan>): string[] => {
  const errors: string[] = [];
  
  if (!plan.kalenderwoche || plan.kalenderwoche < 1 || plan.kalenderwoche > 53) {
    errors.push('Kalenderwoche muss zwischen 1 und 53 liegen');
  }
  if (!plan.servicetechniker) errors.push('Servicetechniker ist erforderlich');
  if (plan.geld_mitgeben !== undefined && !validateNumeric(plan.geld_mitgeben)) {
    errors.push('Geld mitgeben muss numerisch sein');
  }
  if (plan.km_ca !== undefined && !validateNumeric(plan.km_ca)) {
    errors.push('KM muss numerisch sein');
  }
  if (plan.tanken !== undefined && !validateNumeric(plan.tanken)) {
    errors.push('Tanken muss numerisch sein');
  }
  if (plan.puffer !== undefined && !validateNumeric(plan.puffer)) {
    errors.push('Puffer muss numerisch sein');
  }
  if (plan.hotel_kosten !== undefined && !validateNumeric(plan.hotel_kosten)) {
    errors.push('Hotel Kosten muss numerisch sein');
  }
  
  return errors;
};

export const calculateDailyTotals = (rows: WochenplanRow[]): Record<string, number> => {
  const totals: Record<string, number> = {};
  
  rows.forEach(row => {
    const key = `${row.wochentag}-${row.datum}`;
    totals[key] = (totals[key] || 0) + (row.preis || 0);
  });
  
  return totals;
};

export const calculateWeeklyTotal = (rows: WochenplanRow[]): number => {
  return rows.reduce((sum, row) => sum + (row.preis || 0), 0);
};
