import React, { useState } from 'react';

const ZusatzinformationenSection = ({ register, errors, setValue, watch }) => {
  const [photos, setPhotos] = useState([]);
  const maxPhotos = 5;

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => 
      (file.type === 'image/jpeg' || file.type === 'image/png') && 
      file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (photos.length + validFiles.length > maxPhotos) {
      alert(`Maximal ${maxPhotos} Fotos erlaubt`);
      return;
    }

    const newPhotos = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    }));

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    setValue('zusatzinformationen.photos', updatedPhotos);
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    setValue('zusatzinformationen.photos', updatedPhotos);
  };

  return (
    <div className="form-section">
      <h2 className="section-title">
        <span className="section-number">4</span>
        Zusatzinformationen
      </h2>
      
      <div className="form-group">
        <label className="form-label">Bemerkungen</label>
        <textarea
          {...register('zusatzinformationen.bemerkungen')}
          className="form-textarea"
          rows="3"
          placeholder="Weitere Informationen, Besonderheiten oder Hinweise..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Fotos (max. {maxPhotos}, JPG/PNG, max. 5MB)</label>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={handlePhotoUpload}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ced4da',
            borderRadius: '4px'
          }}
        />
        
        {photos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '10px',
            marginTop: '10px'
          }}>
            {photos.map(photo => (
              <div key={photo.id} style={{
                position: 'relative',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <img
                  src={photo.preview}
                  alt={photo.name}
                  style={{
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
                <div style={{
                  fontSize: '10px',
                  padding: '2px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  {photo.name.length > 15 ? photo.name.substring(0, 15) + '...' : photo.name}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
          {photos.length}/{maxPhotos} Fotos hochgeladen
        </div>
      </div>
    </div>
  );
};

export default ZusatzinformationenSection;