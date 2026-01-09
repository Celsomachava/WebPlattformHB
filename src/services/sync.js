class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async addToQueue(data) {
    const submission = {
      id: Date.now(),
      data,
      timestamp: Date.now(),
      retries: 0
    };
    
    this.syncQueue.push(submission);
    
    if (this.isOnline) {
      await this.processSyncQueue();
    }
    
    return submission.id;
  }

  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    const toSync = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of toSync) {
      try {
        await this.syncItem(item);
      } catch (error) {
        if (item.retries < 3) {
          item.retries++;
          this.syncQueue.push(item);
        }
      }
    }
  }

  async syncItem(item) {
    // Simulate API call
    console.log('Syncing item:', item);
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  getPendingCount() {
    return this.syncQueue.length;
  }
}

export const syncService = new SyncService();