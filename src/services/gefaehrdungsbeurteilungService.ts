import { GefaehrdungsbeurteilungAussendienst } from '../types/gefaehrdungsbeurteilung';
import { authService } from './simple-auth';

class GefaehrdungsbeurteilungService {
  private baseUrl = '/api/gefaehrdungsbeurteilung';

  async getAll(): Promise<GefaehrdungsbeurteilungAussendienst[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_gefaehrdungsbeurteilung') || '[]');
      return pending;
    }
  }

  async get(id: string): Promise<GefaehrdungsbeurteilungAussendienst | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_gefaehrdungsbeurteilung') || '[]');
      return pending.find((p: GefaehrdungsbeurteilungAussendienst) => p.id === id) || null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_gefaehrdungsbeurteilung') || '[]');
      const filtered = pending.filter((p: GefaehrdungsbeurteilungAussendienst) => p.id !== id);
      localStorage.setItem('pending_gefaehrdungsbeurteilung', JSON.stringify(filtered));
    }
  }

  async getByServiceRequest(serviceAnfrageId: string): Promise<GefaehrdungsbeurteilungAussendienst | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${serviceAnfrageId}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(`gefaehrdungsbeurteilung_${serviceAnfrageId}`, JSON.stringify(data));
        return data;
      }
      return null;
    } catch (error) {
      const cached = localStorage.getItem(`gefaehrdungsbeurteilung_${serviceAnfrageId}`);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async create(data: Omit<GefaehrdungsbeurteilungAussendienst, 'id' | 'created_at' | 'updated_at'>): Promise<GefaehrdungsbeurteilungAussendienst> {
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
      const offlineData: GefaehrdungsbeurteilungAussendienst = {
        id: crypto.randomUUID(),
        ...data,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_gefaehrdungsbeurteilung') || '[]');
      pending.push(offlineData);
      localStorage.setItem('pending_gefaehrdungsbeurteilung', JSON.stringify(pending));
      
      return offlineData;
    }
  }

  async update(id: string, data: Partial<GefaehrdungsbeurteilungAussendienst>): Promise<GefaehrdungsbeurteilungAussendienst> {
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
      const pending = JSON.parse(localStorage.getItem('pending_gefaehrdungsbeurteilung') || '[]');
      const index = pending.findIndex((p: GefaehrdungsbeurteilungAussendienst) => p.id === id);
      if (index !== -1) {
        pending[index] = { ...pending[index], ...data, updated_at: Date.now() };
        localStorage.setItem('pending_gefaehrdungsbeurteilung', JSON.stringify(pending));
        return pending[index];
      }
      throw error;
    }
  }
}

export const gefaehrdungsbeurteilungService = new GefaehrdungsbeurteilungService();
