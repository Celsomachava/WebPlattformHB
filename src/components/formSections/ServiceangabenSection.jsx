import React from 'react';

const ServiceangabenSection = ({ register, errors }) => {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <span className="section-number">3</span>
        Serviceangaben
      </h2>
      
      <div className="form-group">
        <label className="form-label required">Serviceart</label>
        <select
          {...register('serviceangaben.serviceart', { 
            required: 'Serviceart ist erforderlich' 
          })}
          className="form-select"
        >
          <option value="">Serviceart wählen...</option>
          <option value="wartung">Wartung</option>
          <option value="reparatur">Reparatur</option>
          <option value="notfall">Notfall</option>
          <option value="beratung">Beratung</option>
        </select>
        {errors?.serviceangaben?.serviceart && (
          <span className="error-message">{errors.serviceangaben.serviceart.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Dringlichkeit</label>
        <select
          {...register('serviceangaben.dringlichkeit')}
          className="form-select"
          defaultValue="normal"
        >
          <option value="niedrig">Niedrig</option>
          <option value="normal">Normal</option>
          <option value="hoch">Hoch</option>
          <option value="kritisch">Kritisch</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Gewünschter Termin</label>
        <input
          {...register('serviceangaben.gewuenschter_termin')}
          type="date"
          className="form-input"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="form-group">
        <label className="form-label required">Beschreibung</label>
        <textarea
          {...register('serviceangaben.beschreibung', { 
            required: 'Beschreibung ist erforderlich',
            minLength: { value: 10, message: 'Beschreibung muss mindestens 10 Zeichen lang sein' }
          })}
          className="form-textarea"
          rows="4"
          placeholder="Beschreibung des Problems oder gewünschten Service..."
        />
        {errors?.serviceangaben?.beschreibung && (
          <span className="error-message">{errors.serviceangaben.beschreibung.message}</span>
        )}
      </div>
    </div>
  );
};

export default ServiceangabenSection;