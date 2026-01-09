class OptimizedDBService {
  constructor() {
    this.db = null;
    this.dbName = 'heduschkaForms';
    this.version = 2; // Increased for new indexes
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Submissions store with optimized indexes
        if (!db.objectStoreNames.contains('submissions')) {
          const store = db.createObjectStore('submissions', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Performance indexes
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('kunden_id', 'kunden_id', { unique: false });
          store.createIndex('status_timestamp', ['status', 'timestamp'], { unique: false });
        }
        
        // Templates store
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }
        
        // Cache store for API responses
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('expires', 'expires', { unique: false });
        }
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Fast query using compound index
  async getPendingSubmissions() {
    if (!this.db) await this.init();
    
    return new Promise((resolve) => {
      const transaction = this.db.transaction(['submissions'], 'readonly');
      const store = transaction.objectStore('submissions');
      const index = store.index('status_timestamp');
      
      // Use compound index for faster queries
      const range = IDBKeyRange.bound(['pending', 0], ['pending', Date.now()]);
      const request = index.getAll(range);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  // Batch operations for better performance
  async batchSave(submissions) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      
      let completed = 0;
      const total = submissions.length;
      
      submissions.forEach(submission => {
        const request = store.add(submission);
        request.onsuccess = () => {
          completed++;
          if (completed === total) resolve();
        };
        request.onerror = () => reject(request.error);
      });
    });
  }

  // Cache API responses
  async cacheResponse(key, data, ttl = 300000) { // 5 minutes default
    if (!this.db) await this.init();
    
    const cacheEntry = {
      key,
      data,
      expires: Date.now() + ttl,
      timestamp: Date.now()
    };
    
    const transaction = this.db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    store.put(cacheEntry);
  }

  async getCachedResponse(key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve) => {
      const transaction = this.db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expires > Date.now()) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => resolve(null);
    });
  }

  // Clean expired cache entries
  async cleanExpiredCache() {
    if (!this.db) await this.init();
    
    const transaction = this.db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    const index = store.index('expires');
    
    const range = IDBKeyRange.upperBound(Date.now());
    const request = index.openCursor(range);
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }
}

export const optimizedDB = new OptimizedDBService();