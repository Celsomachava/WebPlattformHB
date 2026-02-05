import { optimizedDB } from '../services/optimizedDB';

describe('OptimizedDB Service', () => {
  beforeEach(async () => {
    await optimizedDB.init();
  });

  afterEach(() => {
    // Clean up IndexedDB
    if (optimizedDB.db) {
      optimizedDB.db.close();
    }
  });

  test('should initialize database', async () => {
    expect(optimizedDB.db).toBeTruthy();
    expect(optimizedDB.db.name).toBe('heduschkaForms');
  });

  test('should save and retrieve pending submissions', async () => {
    const testSubmission = {
      formData: {
        kundendaten: { kunden_id: 'TEST_001' },
        serviceangaben: { beschreibung: 'Test submission' }
      },
      status: 'pending',
      timestamp: Date.now()
    };

    // Save submission
    const submissions = [testSubmission];
    await optimizedDB.batchSave(submissions);

    // Retrieve pending submissions
    const pending = await optimizedDB.getPendingSubmissions();
    expect(pending).toHaveLength(1);
    expect(pending[0].formData.kundendaten.kunden_id).toBe('TEST_001');
  });

  test('should cache and retrieve API responses', async () => {
    const testKey = 'test-api-response';
    const testData = { result: 'success', timestamp: Date.now() };

    // Cache response
    await optimizedDB.cacheResponse(testKey, testData, 5000);

    // Retrieve cached response
    const cached = await optimizedDB.getCachedResponse(testKey);
    expect(cached).toEqual(testData);
  });

  test('should return null for expired cache', async () => {
    const testKey = 'expired-response';
    const testData = { result: 'expired' };

    // Cache with very short TTL
    await optimizedDB.cacheResponse(testKey, testData, 1);

    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 10));

    const cached = await optimizedDB.getCachedResponse(testKey);
    expect(cached).toBeNull();
  });

  test('should clean expired cache entries', async () => {
    const expiredKey = 'expired-entry';
    const validKey = 'valid-entry';

    // Add expired entry
    await optimizedDB.cacheResponse(expiredKey, { data: 'expired' }, 1);
    // Add valid entry
    await optimizedDB.cacheResponse(validKey, { data: 'valid' }, 10000);

    // Wait for first entry to expire
    await new Promise(resolve => setTimeout(resolve, 10));

    // Clean expired entries
    await optimizedDB.cleanExpiredCache();

    // Check results
    const expired = await optimizedDB.getCachedResponse(expiredKey);
    const valid = await optimizedDB.getCachedResponse(validKey);

    expect(expired).toBeNull();
    expect(valid).toEqual({ data: 'valid' });
  });
});