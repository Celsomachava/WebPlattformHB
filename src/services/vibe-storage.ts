// VIBE Architecture - Offline Storage & Encryption

import { EncryptedData, SyncItem, ServiceStatus } from '../models/vibe-types';

// Database Schema
const DB_SCHEMA = {
  name: 'HeduschkaVibeDB',
  version: 1,
  stores: {
    forms: {
      keyPath: 'id',
      indexes: ['status', 'created_at', 'customer_id']
    },
    attachments: {
      keyPath: 'id', 
      indexes: ['form_id', 'encrypted']
    },
    sync_queue: {
      keyPath: 'local_id',
      indexes: ['status', 'retry_count', 'created_at']
    },
    encryption_keys: {
      keyPath: 'key_id',
      indexes: ['created_at']
    },
    user_sessions: {
      keyPath: 'user_id',
      indexes: ['expires_at']
    }
  }
};

// Encryption Manager
class EncryptionManager {
  private masterKey: CryptoKey | null = null;
  
  async initializeKeys(): Promise<void> {
    this.masterKey = await this.getMasterKey() || await this.generateMasterKey();
  }
  
  async encryptData(data: any, keyId: string): Promise<EncryptedData> {
    if (!this.masterKey) await this.initializeKeys();
    
    const dataKey = await this.deriveDataKey(keyId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      dataKey,
      new TextEncoder().encode(JSON.stringify(data))
    );
    
    return {
      data: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
      keyId
    };
  }
  
  async decryptData(encryptedData: EncryptedData): Promise<any> {
    if (!this.masterKey) await this.initializeKeys();
    
    const dataKey = await this.deriveDataKey(encryptedData.keyId);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      dataKey,
      new Uint8Array(encryptedData.data)
    );
    
    return JSON.parse(new TextDecoder().decode(decrypted));
  }
  
  private async deriveDataKey(keyId: string): Promise<CryptoKey> {
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new TextEncoder().encode(keyId), iterations: 100000, hash: 'SHA-256' },
      this.masterKey!,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  private async generateMasterKey(): Promise<CryptoKey> {
    const key = await crypto.subtle.generateKey(
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    await this.storeMasterKey(key);
    return key;
  }
  
  private async getMasterKey(): Promise<CryptoKey | null> {
    // Implementation would retrieve from secure storage
    return null;
  }
  
  private async storeMasterKey(key: CryptoKey): Promise<void> {
    // Implementation would store in secure storage
  }
}

// IndexedDB Wrapper
class OfflineDB {
  private db: IDBDatabase | null = null;
  private encryptionManager = new EncryptionManager();
  
  async init(): Promise<void> {
    await this.encryptionManager.initializeKeys();
    
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_SCHEMA.name, DB_SCHEMA.version);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  private createStores(db: IDBDatabase): void {
    Object.entries(DB_SCHEMA.stores).forEach(([storeName, config]) => {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
        config.indexes.forEach(indexName => {
          store.createIndex(indexName, indexName);
        });
      }
    });
  }
  
  async put(storeName: string, data: any): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(request.error);
    });
  }
  
  async get(storeName: string, key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getByIndex(storeName: string, indexName: string, value: any): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Form Lifecycle Manager
class FormLifecycle {
  constructor(private db: OfflineDB, private encryptionManager: EncryptionManager) {}
  
  async saveDraft(formData: any): Promise<string> {
    const encrypted = await this.encryptionManager.encryptData(formData, formData.id);
    
    return this.db.put('forms', {
      id: formData.id,
      status: ServiceStatus.DRAFT,
      data: encrypted,
      created_at: Date.now(),
      updated_at: Date.now()
    });
  }
  
  async submitForm(formId: string): Promise<void> {
    const form = await this.db.get('forms', formId);
    if (!form) throw new Error('Form not found');
    
    await this.db.put('forms', {
      ...form,
      status: ServiceStatus.SUBMITTED,
      submitted_at: Date.now()
    });
    
    await this.addToSyncQueue(formId);
  }
  
  async markSynced(formId: string, serverId: string): Promise<void> {
    const form = await this.db.get('forms', formId);
    if (!form) throw new Error('Form not found');
    
    await this.db.put('forms', {
      ...form,
      status: ServiceStatus.COMPLETED,
      server_id: serverId,
      synced_at: Date.now()
    });
  }
  
  private async addToSyncQueue(formId: string): Promise<void> {
    const syncItem: SyncItem = {
      id: crypto.randomUUID(),
      type: 'form',
      data: { formId },
      priority: 'normal',
      retryCount: 0,
      created_at: Date.now()
    };
    
    await this.db.put('sync_queue', syncItem);
  }
}

// Storage Cleanup
class StorageCleanup {
  private readonly RETENTION_DAYS = 90;
  private readonly MAX_STORAGE_MB = 500;
  
  constructor(private db: OfflineDB) {}
  
  async runCleanup(): Promise<void> {
    await this.cleanupOldSyncedForms();
    await this.cleanupExpiredSessions();
    await this.compactDatabase();
  }
  
  private async cleanupOldSyncedForms(): Promise<void> {
    const cutoffDate = Date.now() - (this.RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const oldForms = await this.db.getByIndex('forms', 'created_at', IDBKeyRange.upperBound(cutoffDate));
    
    for (const form of oldForms) {
      if (form.status === ServiceStatus.COMPLETED) {
        await this.db.delete('forms', form.id);
        await this.cleanupFormAttachments(form.id);
      }
    }
  }
  
  private async cleanupFormAttachments(formId: string): Promise<void> {
    const attachments = await this.db.getByIndex('attachments', 'form_id', formId);
    for (const attachment of attachments) {
      await this.db.delete('attachments', attachment.id);
    }
  }
  
  private async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();
    const expiredSessions = await this.db.getByIndex('user_sessions', 'expires_at', IDBKeyRange.upperBound(now));
    
    for (const session of expiredSessions) {
      await this.db.delete('user_sessions', session.user_id);
    }
  }
  
  private async compactDatabase(): Promise<void> {
    // IndexedDB doesn't support manual compaction, but we can optimize by reorganizing data
    console.log('Database cleanup completed');
  }
}

// Export singleton instances
export const offlineDB = new OfflineDB();
export const encryptionManager = new EncryptionManager();
export const formLifecycle = new FormLifecycle(offlineDB, encryptionManager);
export const storageCleanup = new StorageCleanup(offlineDB);

// Initialize on module load
offlineDB.init().catch(console.error);