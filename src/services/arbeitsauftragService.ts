import { ArbeitsauftragServicebericht } from '../types/arbeitsauftrag';
import { authService } from './simple-auth';

class ArbeitsauftragService {
  private baseUrl = '/api/arbeitsauftrag';

  async getAll(): Promise<ArbeitsauftragServicebericht[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_arbeitsauftrag') || '[]');
      return pending;
    }
  }

  async get(id: string): Promise<ArbeitsauftragServicebericht | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_arbeitsauftrag') || '[]');
      return pending.find((p: ArbeitsauftragServicebericht) => p.id === id) || null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_arbeitsauftrag') || '[]');
      const filtered = pending.filter((p: ArbeitsauftragServicebericht) => p.id !== id);
      localStorage.setItem('pending_arbeitsauftrag', JSON.stringify(filtered));
    }
  }

  async getByServiceRequest(serviceAnfrageId: string): Promise<ArbeitsauftragServicebericht | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${serviceAnfrageId}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(`arbeitsauftrag_${serviceAnfrageId}`, JSON.stringify(data));
        return data;
      }
      return null;
    } catch (error) {
      const cached = localStorage.getItem(`arbeitsauftrag_${serviceAnfrageId}`);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async create(data: Omit<ArbeitsauftragServicebericht, 'id' | 'created_at' | 'updated_at'>): Promise<ArbeitsauftragServicebericht> {
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
      throw new Error('Failed to create');
    } catch (error) {
      const offlineData: ArbeitsauftragServicebericht = {
        id: crypto.randomUUID(),
        ...data,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_arbeitsauftrag') || '[]');
      pending.push(offlineData);
      localStorage.setItem('pending_arbeitsauftrag', JSON.stringify(pending));
      
      return offlineData;
    }
  }

  async update(id: string, data: Partial<ArbeitsauftragServicebericht>): Promise<ArbeitsauftragServicebericht> {
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
      throw new Error('Failed to update');
    } catch (error) {
      throw error;
    }
  }
}

export const arbeitsauftragService = new ArbeitsauftragService();
