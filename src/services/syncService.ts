class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.retryAttempts = new Map();
    
    // Auto-sync on online
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPending();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Register background sync if supported
    this.registerBackgroundSync();
  }

  async syncPending() {
    if (!this.isOnline || this.syncInProgress) return;
    
    this.syncInProgress = true;
    this.notifyStatusChange('syncing');
    
    try {
      // Get pending submissions from IndexedDB
      const pending = await this.getPendingSubmissions();
      
      if (pending.length === 0) {
        this.notifyStatusChange('idle');
        return;
      }

      // Process FIFO (First In, First Out)
      for (const submission of pending) {
        await this.syncSubmission(submission);
      }
      
      this.notifyStatusChange('success');
      this.simulateConfirmation(pending.length);
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.notifyStatusChange('error');
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncSubmission(submission) {
    const maxRetries = 3;
    const submissionId = submission.id;
    const attempts = this.retryAttempts.get(submissionId) || 0;

    try {
      // Get auth headers securely
      const authHeaders = this.getSecureAuthHeaders();
      
      // POST to API with auth token
      const response = await fetch('/api/serviceanfrage', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(this.transformPayload(submission.formData))
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Mark as synced
      await this.updateSubmissionStatus(submissionId, 'synced');
      this.retryAttempts.delete(submissionId);
      
    } catch (error) {
      const newAttempts = attempts + 1;
      
      if (newAttempts >= maxRetries) {
        await this.updateSubmissionStatus(submissionId, 'error');
        this.retryAttempts.delete(submissionId);
      } else {
        this.retryAttempts.set(submissionId, newAttempts);
        // Exponential backoff
        setTimeout(() => this.syncSubmission(submission), Math.pow(2, newAttempts) * 1000);
      }
      
      throw error;
    }
  }

  getSecureAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };
  }

  async getPendingSubmissions() {
    // Simple IndexedDB access
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
      kunden_id: formData.kundendaten?.kunden_id || '',
      anlagen_id: formData.anlagendaten?.anlagen_id || '',
      serviceart: formData.serviceangaben?.serviceart || '',
      dringlichkeit: formData.serviceangaben?.dringlichkeit || '',
      beschreibung: formData.serviceangaben?.beschreibung || '',
      bemerkungen: formData.zusatzinformationen?.bemerkungen || '',
      photos: formData.zusatzinformationen?.photos?.map(p => p.data) || [],
      datenschutz_zustimmung: formData.rechtliches?.datenschutz_zustimmung || false,
      agb_akzeptiert: formData.rechtliches?.agb_akzeptiert || false,
      timestamp: Date.now()
    };
  }

  getAuthToken() {
    return localStorage.getItem('auth_token') || 'KUNDE_001';
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
    // Simulate email/push confirmation
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Heduschka Service', {
          body: `${count} Serviceanfrage(n) erfolgreich übermittelt`,
          icon: '/icons/icon-192x192.svg'
        });
      }
      
      // Log confirmation for demo
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