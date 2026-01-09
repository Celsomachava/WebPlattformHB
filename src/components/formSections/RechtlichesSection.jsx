import React from 'react';

const RechtlichesSection = ({ register, errors }) => {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <span className="section-number">5</span>
        DSGVOO-Einverständnis
      </h2>
      
      <div className="form-group">
        <label className="checkbox-label">
          <input
            {...register('rechtliches.datenschutz_zustimmung', { 
              required: 'Datenschutz-Zustimmung ist erforderlich' 
            })}
            type="checkbox"
          />
          <span>
            <strong>Datenschutzerklärungg *</strong><br />
            Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß DSGVO zu. 
            Die Daten werden nur für die Serviceabwicklung verwendet und nach Abschluss gelöscht.
          </span>
        </label>
        {errors?.rechtliches?.datenschutz_zustimmung && (
          <span className="error-message">{errors.rechtliches.datenschutz_zustimmung.message}</span>
        )}
      </div>
      
      <div className="form-group">
        <label className="checkbox-label">
          <input
            {...register('rechtliches.agb_akzeptiert', { 
              required: 'AGB-Akzeptanz ist erforderlich' 
            })}
            type="checkbox"
          />
          <span>
            <strong>AGB akzeptiert *</strong><br />
            Ich akzeptiere die Allgemeinen Geschäftsbedingungen der Heduschka GmbH.
          </span>
        </label>
        {errors?.rechtliches?.agb_akzeptiert && (
          <span className="error-message">{errors.rechtliches.agb_akzeptiert.message}</span>
        )}
      </div>
    </div>
  );
};

export default RechtlichesSection;