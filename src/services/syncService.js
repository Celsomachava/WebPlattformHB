// Sync functionality disabled - online-only mode

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = [];
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners('online');
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
    // No sync needed - online only
    return;
  }
  
  getStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: false
    };
  }
}

export const syncService = new SyncService();