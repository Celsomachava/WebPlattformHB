// Offline functionality disabled - all operations require online connection

export const saveSubmission = async (formData) => {
  if (!navigator.onLine) {
    throw new Error('Internetverbindung erforderlich. Bitte prüfen Sie Ihre Verbindung.');
  }
  
  // Direct API submission only
  console.log('Submitting form data online:', formData);
  return Date.now();
};

export const getPendingSubmissions = async () => {
  return [];
};

export const updateSubmissionStatus = async (id, status) => {
  // No offline storage
  return;
};