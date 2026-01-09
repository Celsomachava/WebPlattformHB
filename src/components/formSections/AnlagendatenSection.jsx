import React from 'react';

const AnlagendatenSection = ({ register, errors }) => {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <span className="section-number">2</span>
        Anlagendaten
      </h2>
      
      <div className="form-group">
        <label className="form-label required">Anlagentyp</label>
        <select
          {...register('anlagendaten.anlagentyp', { 
            required: 'Anlagentyp ist erforderlich' 
          })}
          className="form-select"
        >
          <option value="">Bitte wählen...</option>
          <option value="luftfilter">Luftfilter</option>
          <option value="wasserfilter">Wasserfilter</option>
          <option value="oelfilter">Ölfilter</option>
          <option value="partikelfilter">Partikelfilter</option>
        </select>
        {errors?.anlagendaten?.anlagentyp && (
          <span className="error-message">{errors.anlagendaten.anlagentyp.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label required">Anlagen-ID</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            {...register('anlagendaten.anlagen_id', { 
              required: 'Anlagen-ID ist erforderlich' 
            })}
            type="text"
            className="form-input"
            placeholder="Anlagen-ID eingeben oder scannen"
          />
          <button
            type="button"
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => alert('QR-Scanner wird implementiert')}
          >
            📷 QR Scan
          </button>
        </div>
        {errors?.anlagendaten?.anlagen_id && (
          <span className="error-message">{errors.anlagendaten.anlagen_id.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label required">Standort</label>
        <input
          {...register('anlagendaten.standort', { 
            required: 'Standort ist erforderlich' 
          })}
          type="text"
          className="form-input"
          placeholder="z.B. Halle 1, Produktionslinie A"
        />
        {errors?.anlagendaten?.standort && (
          <span className="error-message">{errors.anlagendaten.standort.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Seriennummer</label>
          <input
            {...register('anlagendaten.seriennummer')}
            type="text"
            className="form-input"
            placeholder="Seriennummer (optional)"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Baujahr</label>
          <input
            {...register('anlagendaten.baujahr')}
            type="number"
            className="form-input"
            placeholder="z.B. 2020"
            min="1990"
            max={new Date().getFullYear()}
          />
        </div>
      </div>
    </div>
  );
};

export default AnlagendatenSection;