import express from 'express';
import { mockServiceRequests } from '../data/mockData.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get service requests
router.get('/requests', (req, res) => {
  let requests = mockServiceRequests;
  
  if (req.user.role === 'customer') {
    requests = requests.filter(r => r.customerId === req.user.id);
  }
  
  res.json(requests);
});

// Create service request
router.post('/requests', (req, res) => {
  const newRequest = {
    id: `SR_${Date.now()}`,
    customerId: req.user.id,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockServiceRequests.push(newRequest);
  res.status(201).json(newRequest);
});

// Update service request status (admin only)
router.patch('/requests/:id/status', adminOnly, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const request = mockServiceRequests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  request.status = status;
  res.json(request);
});

// Sync offline requests
router.post('/sync', (req, res) => {
  const { requests } = req.body;
  const synced = [];
  
  requests.forEach(request => {
    const newRequest = {
      id: `SR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: req.user.id,
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    mockServiceRequests.push(newRequest);
    synced.push(newRequest);
  });
  
  res.json({ synced, count: synced.length });
});

// Get service requests
router.get('/requests', (req, res) => {
  // Mock service requests data
  const mockRequests = [
    {
      id: '1',
      nummer: 'SR-2024-0001',
      kunden_id: 'KUNDE_001',
      serviceart: 'Wartung',
      dringlichkeit: 'normal',
      status: 'neu',
      created_at: Date.now() - 86400000
    }
  ];
  res.json(mockRequests);
});

export default router;