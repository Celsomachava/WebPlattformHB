import { openDB, type IDBPDatabase } from 'idb';
import type { DBSchema, Submission, FormTemplate } from '../models/types';

const DB_NAME = 'heduschkaForms';
const DB_VERSION = 1;

class DatabaseService {
  private db: IDBPDatabase<DBSchema> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<DBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Submissions store
        if (!db.objectStoreNames.contains('submissions')) {
          const submissionStore = db.createObjectStore('submissions', {
            keyPath: 'id',
            autoIncrement: true
          });
          submissionStore.createIndex('by-status', 'status');
          submissionStore.createIndex('by-timestamp', 'timestamp');
        }

        // Templates store
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }
      }
    });
  }

  // Submission operations
  async saveSubmission(submission: Omit<Submission, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.add('submissions', submission as Submission);
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.get('submissions', id);
  }

  async getPendingSubmissions(): Promise<Submission[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllFromIndex('submissions', 'by-status', 'pending');
  }

  async updateSubmissionStatus(id: number, status: Submission['status']): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const submission = await this.db.get('submissions', id);
    if (submission) {
      submission.status = status;
      await this.db.put('submissions', submission);
    }
  }

  async deleteSubmission(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('submissions', id);
  }

  // Template operations
  async saveTemplate(template: FormTemplate): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('templates', template);
  }

  async getTemplate(id: string): Promise<FormTemplate | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.get('templates', id);
  }

  async getAllTemplates(): Promise<FormTemplate[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('templates');
  }

  // Utility methods
  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.clear('submissions');
    await this.db.clear('templates');
  }

  async getStorageInfo(): Promise<{ submissions: number; templates: number }> {
    if (!this.db) throw new Error('Database not initialized');
    const [submissions, templates] = await Promise.all([
      this.db.count('submissions'),
      this.db.count('templates')
    ]);
    return { submissions, templates };
  }
}

export const dbService = new DatabaseService();