const API_BASE_URL = process.env.VITE_API_URL || 'https://api.heduschka.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Submit service request (POST /api/serviceanfrage)
  async submitServiceRequest(formData) {
    const payload = {
      kunden_id: formData.kundendaten.kunden_id,
      anlagen_id: formData.anlagendaten.anlagen_id,
      serviceart: formData.serviceangaben.serviceart,
      dringlichkeit: formData.serviceangaben.dringlichkeit,
      beschreibung: formData.serviceangaben.beschreibung,
      bemerkungen: formData.zusatzinformationen.bemerkungen,
      gewuenschter_termin: formData.serviceangaben.gewuenschter_termin,
      photos: formData.zusatzinformationen.photos?.map(photo => photo.data) || [],
      datenschutz_zustimmung: formData.rechtliches.datenschutz_zustimmung,
      agb_akzeptiert: formData.rechtliches.agb_akzeptiert,
      timestamp: Date.now()
    };
    
    return this.request('/api/serviceanfrage', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Get form template
  async getFormTemplate() {
    return this.request('/api/form-template');
  }

  // Upload photos
  async uploadPhoto(file, submissionId) {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('submissionId', submissionId);

    return this.request('/api/upload-photo', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type for FormData
    });
  }
}

export const apiService = new ApiService();