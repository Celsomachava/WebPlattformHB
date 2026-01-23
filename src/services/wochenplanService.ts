import { Wochenplan, WochenplanRow } from '../types/wochenplan';
import { authService } from './simple-auth';

class WochenplanService {
  private baseUrl = '/api/wochenplan';

  async getAll(): Promise<Wochenplan[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_wochenplan') || '[]');
      return pending;
    }
  }

  async get(id: string): Promise<Wochenplan | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_wochenplan') || '[]');
      return pending.find((p: Wochenplan) => p.id === id) || null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_wochenplan') || '[]');
      const filtered = pending.filter((p: Wochenplan) => p.id !== id);
      localStorage.setItem('pending_wochenplan', JSON.stringify(filtered));
    }
  }

  async getByServiceRequest(serviceAnfrageId: string): Promise<Wochenplan | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${serviceAnfrageId}`, {
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(`wochenplan_${serviceAnfrageId}`, JSON.stringify(data));
        return data;
      }
      return null;
    } catch (error) {
      const cached = localStorage.getItem(`wochenplan_${serviceAnfrageId}`);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async create(data: Omit<Wochenplan, 'id' | 'created_at' | 'updated_at'>): Promise<Wochenplan> {
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
      throw new Error('Failed to create Wochenplan');
    } catch (error) {
      const offlineData: Wochenplan = {
        ...data as any,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      
      const pending = JSON.parse(localStorage.getItem('pending_wochenplan') || '[]');
      pending.push(offlineData);
      localStorage.setItem('pending_wochenplan', JSON.stringify(pending));
      
      return offlineData;
    }
  }

  async update(id: string, data: Partial<Wochenplan>): Promise<Wochenplan> {
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
      throw new Error('Failed to update Wochenplan');
    } catch (error) {
      const pending = JSON.parse(localStorage.getItem('pending_wochenplan') || '[]');
      const index = pending.findIndex((p: Wochenplan) => p.id === id);
      if (index !== -1) {
        pending[index] = { ...pending[index], ...data, updated_at: Date.now() };
        localStorage.setItem('pending_wochenplan', JSON.stringify(pending));
        return pending[index];
      }
      throw error;
    }
  }

  async deleteRow(planId: string, rowId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${planId}/row/${rowId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${await authService.getValidToken()}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete row');
      }
    } catch (error) {
      throw error;
    }
  }
}

export const wochenplanService = new WochenplanService();
