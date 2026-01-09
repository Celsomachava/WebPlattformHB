// Performance monitoring utilities
export const performanceMonitor = {
  metrics: {},

  // Start performance measurement
  start(label) {
    this.metrics[label] = { start: performance.now() };
  },

  // End performance measurement
  end(label) {
    if (this.metrics[label]) {
      this.metrics[label].end = performance.now();
      this.metrics[label].duration = this.metrics[label].end - this.metrics[label].start;
    }
  },

  // Get all metrics
  getMetrics() {
    return this.metrics;
  },

  // Log performance data
  logMetrics() {
    console.table(this.metrics);
  }
};

// Offline functionality tests
export const runOfflineTests = () => {
  console.log('Running offline functionality tests...');
  
  // Test IndexedDB
  const testDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('testDB', 1);
      request.onsuccess = () => resolve('IndexedDB: OK');
      request.onerror = () => reject('IndexedDB: Failed');
    });
  };

  // Test Service Worker
  const testSW = () => {
    return navigator.serviceWorker.ready
      .then(() => 'Service Worker: OK')
      .catch(() => 'Service Worker: Failed');
  };

  Promise.all([testDB(), testSW()])
    .then(results => console.log('Offline tests:', results))
    .catch(error => console.error('Offline test failed:', error));
};