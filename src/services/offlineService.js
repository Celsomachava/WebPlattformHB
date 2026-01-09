import { openDB } from 'idb';

const DB_NAME = 'heduschkaForms';
const DB_VERSION = 1;

let db = null;

const initDB = async () => {
  if (db) return db;
  
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Submissions store
      if (!db.objectStoreNames.contains('submissions')) {
        const submissionsStore = db.createObjectStore('submissions', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        submissionsStore.createIndex('status', 'status');
        submissionsStore.createIndex('timestamp', 'timestamp');
      }
      
      // Templates store
      if (!db.objectStoreNames.contains('templates')) {
        db.createObjectStore('templates', { keyPath: 'id' });
      }
    }
  });
  
  return db;
};

export const saveSubmission = async (formData) => {
  const database = await initDB();
  
  // Convert photos to base64 for storage
  const processedData = { ...formData };
  if (formData.zusatzinformationen?.photos) {
    processedData.zusatzinformationen.photos = await Promise.all(
      formData.zusatzinformationen.photos.map(async (photo) => {
        if (photo.file) {
          const base64 = await fileToBase64(photo.file);
          return {
            id: photo.id,
            filename: photo.name,
            data: base64,
            size: photo.size,
            type: photo.file.type
          };
        }
        return photo;
      })
    );
  }
  
  const submission = {
    formData: processedData,
    status: navigator.onLine ? 'synced' : 'pending',
    timestamp: Date.now(),
    sync_attempts: 0
  };
  
  const id = await database.add('submissions', submission);
  
  // Show appropriate message
  if (navigator.onLine) {
    // Simulate API call
    console.log('Submission synced:', id);
  } else {
    console.log('Submission saved offline:', id);
    showToast('Offline gespeichert - wird synchronisiert wenn online');
  }
  
  return id;
};

export const getPendingSubmissions = async () => {
  const database = await initDB();
  const tx = database.transaction('submissions', 'readonly');
  const index = tx.store.index('status');
  return await index.getAll('pending');
};

export const updateSubmissionStatus = async (id, status) => {
  const database = await initDB();
  const tx = database.transaction('submissions', 'readwrite');
  const submission = await tx.store.get(id);
  
  if (submission) {
    submission.status = status;
    submission.updated_at = Date.now();
    await tx.store.put(submission);
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const showToast = (message) => {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-size: 14px;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};