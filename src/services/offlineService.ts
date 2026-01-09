import { dbService } from './db';
import type { FormData, Submission } from '../models/types';

class OfflineService {
  // Save form submission with photo handling
  async saveSubmission(formData: FormData): Promise<number> {
    try {
      // Convert photo files to base64 for storage
      const processedFormData = {
        ...formData,
        zusatzinformationen: {
          ...formData.zusatzinformationen,
          photos: await this.processPhotos(formData.zusatzinformationen.photos || [])
        }
      };

      const submission: Omit<Submission, 'id'> = {
        formData: processedFormData,
        status: 'pending',
        timestamp: Date.now(),
        sync_attempts: 0
      };

      return await dbService.saveSubmission(submission);
    } catch (error) {
      console.error('Failed to save submission offline:', error);
      throw error;
    }
  }

  // Get all pending submissions for sync
  async getPendingSubmissions(): Promise<Submission[]> {
    try {
      return await dbService.getPendingSubmissions();
    } catch (error) {
      console.error('Failed to get pending submissions:', error);
      return [];
    }
  }

  // Process photos for offline storage
  private async processPhotos(photos: any[]): Promise<any[]> {
    return Promise.all(photos.map(async (photo) => {
      if (photo.data && photo.data.startsWith('data:')) {
        // Already base64
        return photo;
      }
      
      if (photo instanceof File) {
        // Convert File to base64
        return {
          id: Date.now() + Math.random(),
          filename: photo.name,
          data: await this.fileToBase64(photo),
          size: photo.size,
          type: photo.type
        };
      }
      
      return photo;
    }));
  }

  // Convert File to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Check if device is offline
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Get storage statistics
  async getStorageInfo() {
    return await dbService.getStorageInfo();
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    await dbService.clearAll();
  }
}

export const offlineService = new OfflineService();