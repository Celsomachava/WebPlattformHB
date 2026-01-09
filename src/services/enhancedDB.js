// Enhanced Database Service with Offline Support
export class EnhancedDB {
  constructor() {
    this.dbName = 'heduschkaForms';
    this.version = 2;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Submissions store (existing)
        if (!db.objectStoreNames.contains('submissions')) {
          const submissionsStore = db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
          submissionsStore.createIndex('status', 'status', { unique: false });
          submissionsStore.createIndex('timestamp', 'timestamp', { unique: false });
          submissionsStore.createIndex('kunden_id', 'kunden_id', { unique: false });
        }
        
        // Angebote store
        if (!db.objectStoreNames.contains('angebote')) {
          const angeboteStore = db.createObjectStore('angebote', { keyPath: 'id', autoIncrement: true });
          angeboteStore.createIndex('kunden_id', 'kunden_id', { unique: false });
          angeboteStore.createIndex('status', 'status', { unique: false });
          angeboteStore.createIndex('nummernkreis', 'nummernkreis', { unique: true });
          angeboteStore.createIndex('created_at', 'created_at', { unique: false });
        }
        
        // Rechnungen store
        if (!db.objectStoreNames.contains('rechnungen')) {
          const rechnungenStore = db.createObjectStore('rechnungen', { keyPath: 'id', autoIncrement: true });
          rechnungenStore.createIndex('kunden_id', 'kunden_id', { unique: false });
          rechnungenStore.createIndex('status', 'status', { unique: false });
          rechnungenStore.createIndex('nummernkreis', 'nummernkreis', { unique: true });
          rechnungenStore.createIndex('angebot_id', 'angebot_id', { unique: false });
          rechnungenStore.createIndex('created_at', 'created_at', { unique: false });
        }
        
        // Drafts store for offline support
        if (!db.objectStoreNames.contains('drafts')) {
          const draftsStore = db.createObjectStore('drafts', { keyPath: 'id' });
          draftsStore.createIndex('type', 'type', { unique: false });
          draftsStore.createIndex('created_at', 'created_at', { unique: false });
          draftsStore.createIndex('user_id', 'user_id', { unique: false });
        }
        
        // Templates store
        if (!db.objectStoreNames.contains('templates')) {
          const templatesStore = db.createObjectStore('templates', { keyPath: 'id' });
          templatesStore.createIndex('version', 'version', { unique: false });
        }
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // Generic CRUD operations
  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add({
        ...data,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put({
        ...data,
        updated_at: new Date().toISOString()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName, indexName = null, value = null) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      let request;
      
      if (indexName && value) {
        const index = store.index(indexName);
        request = index.getAll(value);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Draft management for offline support
  async saveDraft(type, data, userId) {
    const draftId = `${type}_${userId}_${Date.now()}`;
    const draft = {
      id: draftId,
      type,
      user_id: userId,
      data,
      created_at: new Date().toISOString(),
      synced: false
    };
    
    return this.add('drafts', draft);
  }

  async getDrafts(userId, type = null) {
    const allDrafts = await this.getAll('drafts');
    return allDrafts.filter(draft => {
      const userMatch = draft.user_id === userId;
      const typeMatch = type ? draft.type === type : true;
      return userMatch && typeMatch && !draft.synced;
    });
  }

  async markDraftSynced(draftId) {
    const draft = await this.get('drafts', draftId);
    if (draft) {
      draft.synced = true;
      draft.synced_at = new Date().toISOString();
      return this.update('drafts', draft);
    }
  }

  async clearSyncedDrafts() {
    const allDrafts = await this.getAll('drafts');
    const syncedDrafts = allDrafts.filter(draft => draft.synced);
    
    for (const draft of syncedDrafts) {
      await this.delete('drafts', draft.id);
    }
  }

  // Angebot-specific methods
  async createAngebot(angebotData) {
    return this.add('angebote', angebotData);
  }

  async updateAngebot(angebotData) {
    return this.update('angebote', angebotData);
  }

  async getAngeboteByKunde(kundenId) {
    return this.getAll('angebote', 'kunden_id', kundenId);
  }

  async getAngeboteByStatus(status) {
    return this.getAll('angebote', 'status', status);
  }

  // Rechnung-specific methods
  async createRechnung(rechnungData) {
    return this.add('rechnungen', rechnungData);
  }

  async updateRechnung(rechnungData) {
    return this.update('rechnungen', rechnungData);
  }

  async getRechnungenByKunde(kundenId) {
    return this.getAll('rechnungen', 'kunden_id', kundenId);
  }

  async getRechnungenByStatus(status) {
    return this.getAll('rechnungen', 'status', status);
  }

  async createRechnungFromAngebot(angebotId) {
    const angebot = await this.get('angebote', angebotId);
    if (!angebot) {
      throw new Error('Angebot nicht gefunden');
    }

    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const faelligAm = new Date();
    faelligAm.setDate(faelligAm.getDate() + 30);

    const rechnungData = {
      nummernkreis: `RE-${year}-${random}`,
      angebot_id: angebot.id,
      kunden_id: angebot.kunden_id,
      positionen: angebot.positionen,
      mwst_saetze: { '19': 19 },
      zahlungsbedingungen: '30 Tage netto',
      netto: angebot.netto,
      mwst_betrag: angebot.brutto - angebot.netto,
      brutto: angebot.brutto,
      status: 'offen',
      faellig_am: faelligAm.toISOString().split('T')[0]
    };

    return this.createRechnung(rechnungData);
  }

  // Version history for angebote
  async getAngebotVersionHistory(angebotId) {
    const allAngebote = await this.getAll('angebote');
    return allAngebote.filter(a => 
      a.nummernkreis === angebotId || 
      (a.parent_id && a.parent_id === angebotId)
    ).sort((a, b) => b.version - a.version);
  }

  async createAngebotVersion(angebotId, changes) {
    const originalAngebot = await this.get('angebote', angebotId);
    if (!originalAngebot) {
      throw new Error('Original-Angebot nicht gefunden');
    }

    const newVersion = {
      ...originalAngebot,
      ...changes,
      id: undefined, // Will be auto-generated
      parent_id: originalAngebot.id,
      version: (originalAngebot.version || 1) + 1,
      created_at: new Date().toISOString()
    };

    return this.add('angebote', newVersion);
  }

  // Statistics and reporting
  async getStatistics() {
    const [submissions, angebote, rechnungen] = await Promise.all([
      this.getAll('submissions'),
      this.getAll('angebote'),
      this.getAll('rechnungen')
    ]);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRechnungen = rechnungen.filter(r => {
      const rechnungDate = new Date(r.created_at);
      return rechnungDate.getMonth() === currentMonth && 
             rechnungDate.getFullYear() === currentYear;
    });

    const monthlyUmsatz = monthlyRechnungen
      .filter(r => r.status === 'bezahlt')
      .reduce((sum, r) => sum + r.brutto, 0);

    const offeneRechnungen = rechnungen.filter(r => r.status === 'offen');
    const offenerBetrag = offeneRechnungen.reduce((sum, r) => sum + r.brutto, 0);

    return {
      totalSubmissions: submissions.length,
      totalAngebote: angebote.length,
      totalRechnungen: rechnungen.length,
      monthlyUmsatz,
      offenerBetrag,
      pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
      activeAngebote: angebote.filter(a => a.status === 'versendet').length,
      offeneRechnungen: offeneRechnungen.length
    };
  }

  // Cleanup and maintenance
  async cleanup() {
    // Remove old synced drafts
    await this.clearSyncedDrafts();
    
    // Remove old submissions that are synced
    const oldSubmissions = await this.getAll('submissions');
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6); // 6 months old
    
    for (const submission of oldSubmissions) {
      if (submission.status === 'synced' && 
          new Date(submission.timestamp) < cutoffDate) {
        await this.delete('submissions', submission.id);
      }
    }
  }
}

// Export singleton instance
export const enhancedDB = new EnhancedDB();