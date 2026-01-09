import React from 'react';

const KundendatenSection = ({ register, errors }) => {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <span className="section-number">1</span>
        Kundendaten
      </h2>
      
      <div className="form-group">
        <label className="form-label">Kunden-ID</label>
        <input
          {...register('kundendaten.kunden_id')}
          type="text"
          className="form-input"
          readOnly
          style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Name</label>
        <input
          {...register('kundendaten.name')}
          type="text"
          className="form-input"
          readOnly
          style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Telefon</label>
          <input
            {...register('kundendaten.telefon')}
            type="tel"
            className="form-input"
            readOnly
            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">E-Mail</label>
          <input
            {...register('kundendaten.email')}
            type="email"
            className="form-input"
            readOnly
            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Ansprechpartner</label>
        <input
          {...register('kundendaten.ansprechpartner')}
          type="text"
          className="form-input"
          placeholder="Name des Ansprechpartners"
        />
      </div>
    </div>
  );
};

export default KundendatenSection;