import { syncService } from '../services/syncService';

// Mock fetch
global.fetch = jest.fn();

describe('Sync Service', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Reset online status
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  test('should detect online status', () => {
    expect(syncService.isOnline).toBe(true);
    
    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    
    // Trigger offline event
    window.dispatchEvent(new Event('offline'));
    expect(syncService.isOnline).toBe(false);
  });

  test('should add and remove listeners', () => {
    const mockListener = jest.fn();
    
    // Add listener
    syncService.addListener(mockListener);
    expect(syncService.listeners).toContain(mockListener);
    
    // Remove listener
    syncService.removeListener(mockListener);
    expect(syncService.listeners).not.toContain(mockListener);
  });

  test('should notify listeners on status change', () => {
    const mockListener = jest.fn();
    syncService.addListener(mockListener);
    
    // Trigger offline event
    window.dispatchEvent(new Event('offline'));
    expect(mockListener).toHaveBeenCalledWith('offline');
    
    // Trigger online event
    window.dispatchEvent(new Event('online'));
    expect(mockListener).toHaveBeenCalledWith('online');
    
    syncService.removeListener(mockListener);
  });

  test('should sync pending submissions (no-op)', async () => {
    // This should not throw and complete successfully
    await expect(syncService.syncPending()).resolves.toBeUndefined();
  });

  test('should return current status', () => {
    const status = syncService.getStatus();
    expect(status).toEqual({
      isOnline: true,
      syncInProgress: false
    });
  });

  test('should update status when going offline', () => {
    // Go offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    window.dispatchEvent(new Event('offline'));
    
    const status = syncService.getStatus();
    expect(status).toEqual({
      isOnline: false,
      syncInProgress: false
    });
  });
});