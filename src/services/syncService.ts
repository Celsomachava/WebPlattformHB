import { apiService } from './api.js';

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.retryAttempts = new Map();
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPending();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    this.registerBackgroundSync();
  }

  async syncPending() {
    if (!this.isOnline || this.syncInProgress) return;
    
    this.syncInProgress = true;
    this.notifyStatusChange('syncing');
    
    try {
      const pending = await this.getPendingSubmissions();
      
      if (pending.length === 0) {
        this.notifyStatusChange('idle');
        return;
      }

      // Use batch sync endpoint
      const requests = pending.map(p => this.transformPayload(p.formData));
      const result = await apiService.syncServiceRequests(requests);
      
      // Mark all as synced
      for (const submission of pending) {
        await this.updateSubmissionStatus(submission.id, 'synced');
      }
      
      this.notifyStatusChange('success');
      this.simulateConfirmation(result.count);
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.notifyStatusChange('error');
    } finally {
      this.syncInProgress = false;
    }
  }

  async getPendingSubmissions() {
    return new Promise((resolve) => {
      const request = indexedDB.open('heduschkaForms', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['submissions'], 'readonly');
        const store = transaction.objectStore('submissions');
        const index = store.index('by-status');
        const getRequest = index.getAll('pending');
        
        getRequest.onsuccess = () => resolve(getRequest.result || []);
        getRequest.onerror = () => resolve([]);
      };
      
      request.onerror = () => resolve([]);
    });
  }

  async updateSubmissionStatus(id, status) {
    return new Promise((resolve) => {
      const request = indexedDB.open('heduschkaForms', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['submissions'], 'readwrite');
        const store = transaction.objectStore('submissions');
        
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          const submission = getRequest.result;
          if (submission) {
            submission.status = status;
            submission.syncedAt = Date.now();
            store.put(submission);
          }
          resolve();
        };
      };
    });
  }

  transformPayload(formData) {
    return {
      anlagenId: formData.anlagendaten?.anlagen_id || '',
      standort: formData.anlagendaten?.standort || '',
      filtertyp: formData.anlagendaten?.anlagentyp || '',
      qrCode: formData.anlagendaten?.qr_code || '',
      serviceart: formData.serviceangaben?.serviceart || '',
      dringlichkeit: formData.serviceangaben?.dringlichkeit || 'normal',
      wunschtermin: formData.serviceangaben?.wunschtermin || null,
      zeitfenster: formData.serviceangaben?.zeitfenster || '',
      bemerkungen: formData.zusatzinformationen?.bemerkungen || ''
    };
  }

  async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
      } catch (error) {
        console.log('Background sync not supported:', error);
      }
    }
  }

  notifyStatusChange(status) {
    window.dispatchEvent(new CustomEvent('syncStatusChange', { 
      detail: { status, isOnline: this.isOnline } 
    }));
  }

  simulateConfirmation(count) {
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Heduschka Service', {
          body: `${count} Serviceanfrage(n) erfolgreich übermittelt`,
          icon: '/icons/icon-192x192.svg'
        });
      }
      
      console.log(`📧 Bestätigung: ${count} Anfrage(n) an Heduschka übermittelt`);
    }, 1000);
  }

  getStatus() {
    return {
      online: this.isOnline,
      syncing: this.syncInProgress
    };
  }
}

export const syncService = new SyncService();