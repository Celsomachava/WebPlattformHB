import { getPendingSubmissions, updateSubmissionStatus } from './offlineService';

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.listeners = [];
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners('online');
      this.syncPending();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners('offline');
    });
  }
  
  addListener(callback) {
    this.listeners.push(callback);
  }
  
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }
  
  notifyListeners(status) {
    this.listeners.forEach(callback => callback(status));
  }
  
  async syncPending() {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }
    
    this.syncInProgress = true;
    this.notifyListeners('syncing');
    
    try {
      const pendingSubmissions = await getPendingSubmissions();
      
      if (pendingSubmissions.length === 0) {
        this.notifyListeners('synced');
        return;
      }
      
      console.log(`Syncing ${pendingSubmissions.length} pending submissions...`);
      
      for (const submission of pendingSubmissions) {
        try {
          // Simulate API call
          await this.submitToAPI(submission.formData);
          await updateSubmissionStatus(submission.id, 'synced');
          console.log(`Submission ${submission.id} synced successfully`);
        } catch (error) {
          console.error(`Failed to sync submission ${submission.id}:`, error);
          // Update retry count
          submission.sync_attempts = (submission.sync_attempts || 0) + 1;
          
          if (submission.sync_attempts >= 3) {
            await updateSubmissionStatus(submission.id, 'error');
          }
        }
      }
      
      this.notifyListeners('synced');
      this.showSyncNotification(pendingSubmissions.length);
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.notifyListeners('sync-error');
    } finally {
      this.syncInProgress = false;
    }
  }
  
  async submitToAPI(formData) {
    // Simulate API call - replace with actual endpoint
    const apiPayload = {
      kunden_id: formData.kundendaten.kunden_id,
      anlagen_id: formData.anlagendaten.anlagen_id,
      serviceart: formData.serviceangaben.serviceart,
      dringlichkeit: formData.serviceangaben.dringlichkeit,
      beschreibung: formData.serviceangaben.beschreibung,
      bemerkungen: formData.zusatzinformationen?.bemerkungen,
      gewuenschter_termin: formData.serviceangaben.gewuenschter_termin,
      photos: formData.zusatzinformationen?.photos?.map(p => p.data) || [],
      datenschutz_zustimmung: formData.rechtliches.datenschutz_zustimmung,
      agb_akzeptiert: formData.rechtliches.agb_akzeptiert,
      timestamp: Date.now()
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (90% success rate)
    if (Math.random() > 0.1) {
      return { success: true, id: Date.now() };
    } else {
      throw new Error('API Error: Service temporarily unavailable');
    }
  }
  
  showSyncNotification(count) {
    const message = `${count} Serviceanfrage${count > 1 ? 'n' : ''} erfolgreich synchronisiert`;
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  }
  
  getStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }
}

export const syncService = new SyncService();

// Auto-sync on app start
setTimeout(() => {
  if (navigator.onLine) {
    syncService.syncPending();
  }
}, 2000);