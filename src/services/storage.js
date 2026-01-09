import { openDB } from 'idb';

const DB_NAME = 'HeduschkaServiceDB';
const DB_VERSION = 1;

// Form structure based on Heduschka documentation
const FORM_SCHEMA = {
  kundendaten: ['firma', 'ansprechpartner', 'telefon', 'email'],
  anlagendaten: ['anlagentyp', 'seriennummer', 'standort'],
  serviceangaben: ['servicetyp', 'prioritaet', 'beschreibung'],
  zusatzinformationen: ['bemerkungen', 'fotos'],
  rechtliches: ['datenschutz_zustimmung', 'agb_akzeptiert']
};

class StorageService {
  constructor() {
    this.db = null;
  }

  async init() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Store for form submissions (offline queue)
          if (!db.objectStoreNames.contains('submissions')) {
            const submissionStore = db.createObjectStore('submissions', {
              keyPath: 'id',
              autoIncrement: true
            });
            submissionStore.createIndex('timestamp', 'timestamp');
            submissionStore.createIndex('synced', 'synced');
          }

          // Store for form templates
          if (!db.objectStoreNames.contains('templates')) {
            db.createObjectStore('templates', { keyPath: 'id' });
          }

          // Store for user session data
          if (!db.objectStoreNames.contains('session')) {
            db.createObjectStore('session', { keyPath: 'key' });
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }

  async saveSubmission(formData) {
    const submission = {
      ...formData,
      timestamp: Date.now(),
      synced: false
    };
    return await this.db.add('submissions', submission);
  }

  async getUnsynced() {
    return await this.db.getAllFromIndex('submissions', 'synced', false);
  }

  async markSynced(id) {
    const submission = await this.db.get('submissions', id);
    if (submission) {
      submission.synced = true;
      await this.db.put('submissions', submission);
    }
  }

  async saveTemplate(template) {
    return await this.db.put('templates', template);
  }

  async getTemplate(id = 'default') {
    return await this.db.get('templates', id);
  }
}

export const storageService = new StorageService();