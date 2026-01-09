// Simple fallback services
export const offlineDB = {
  async init() {
    console.log('Simple DB initialized');
  },
  async get() { return null; },
  async put() { return 'ok'; },
  async delete() { return 'ok'; }
};

export const backgroundSyncEngine = {
  onSyncStatusChange() {
    return () => {}; // unsubscribe function
  },
  getPendingCount() { return 0; },
  getIsSyncing() { return false; },
  processSyncQueue() { return Promise.resolve(); }
};