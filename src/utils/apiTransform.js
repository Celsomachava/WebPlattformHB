import type { FormData, ApiPayload } from '../models/types';

export const transformToApiPayload = (formData: FormData): ApiPayload => {
  return {
    kunden_id: formData.kundendaten.kunden_id,
    anlagen_id: formData.anlagendaten.anlagen_id,
    serviceart: formData.serviceangaben.serviceart,
    dringlichkeit: formData.serviceangaben.dringlichkeit,
    beschreibung: formData.serviceangaben.beschreibung,
    bemerkungen: formData.zusatzinformationen.bemerkungen,
    gewuenschter_termin: formData.serviceangaben.gewuenschter_termin,
    photos: formData.zusatzinformationen.photos.map(photo => photo.data),
    datenschutz_zustimmung: formData.rechtliches.datenschutz_zustimmung,
    agb_akzeptiert: formData.rechtliches.agb_akzeptiert,
    timestamp: Date.now()
  };
};