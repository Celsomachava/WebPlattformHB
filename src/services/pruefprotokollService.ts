import { PruefprotokollDGUV201004 } from '../types/pruefprotokoll';
import { authService } from './simple-auth';

class PruefprotokollService {
  private baseUrl = '/api/pruefprotokoll';

  async getAll(): Promise<PruefprotokollDGUV201004[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_pruefprotokoll') || '[]');
      return pending;
    }
  }

  async get(id: string): Promise<PruefprotokollDGUV201004 | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_pruefprotokoll') || '[]');
      return pending.find((p: PruefprotokollDGUV201004) => p.id === id) || null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_pruefprotokoll') || '[]');
      const filtered = pending.filter((p: PruefprotokollDGUV201004) => p.id !== id);
      localStorage.setItem('pending_pruefprotokoll', JSON.stringify(filtered));
    }
  }

  async getByServiceRequest(serviceAnfrageId: string): Promise<PruefprotokollDGUV201004 | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${serviceAnfrageId}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(`pruefprotokoll_${serviceAnfrageId}`, JSON.stringify(data));
        return data;
      }
      return null;
    } catch (error) {
      const cached = localStorage.getItem(`pruefprotokoll_${serviceAnfrageId}`);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async create(data: Omit<PruefprotokollDGUV201004, 'id' | 'created_at' | 'updated_at'>): Promise<PruefprotokollDGUV201004> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getValidToken()}`
        },
        body: JSON.stringify({
          ...data,
          created_at: Date.now(),
          updated_at: Date.now()
        })
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to create Pruefprotokoll');
    } catch (error) {
      const offlineData: PruefprotokollDGUV201004 = {
        id: crypto.randomUUID(),
        ...data,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_pruefprotokoll') || '[]');
      pending.push(offlineData);
      localStorage.setItem('pending_pruefprotokoll', JSON.stringify(pending));
      
      return offlineData;
    }
  }

  async update(id: string, data: Partial<PruefprotokollDGUV201004>): Promise<PruefprotokollDGUV201004> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getValidToken()}`
        },
        body: JSON.stringify({
          ...data,
          updated_at: Date.now()
        })
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to update Pruefprotokoll');
    } catch (error) {
      throw error;
    }
  }
}

export const pruefprotokollService = new PruefprotokollService();
