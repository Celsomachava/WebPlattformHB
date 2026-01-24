import express from 'express';
import { mockCustomers, mockAnlagen } from '../data/mockData.js';

const router = express.Router();

// Get customer profile
router.get('/profile', (req, res) => {
  const customer = mockCustomers.find(c => c.id === req.user.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  res.json(customer);
});

// Get customer assets/anlagen
router.get('/anlagen', (req, res) => {
  const anlagen = mockAnlagen.filter(a => a.customerId === req.user.id);
  res.json(anlagen);
});

// Get specific anlage by ID
router.get('/anlagen/:id', (req, res) => {
  const anlage = mockAnlagen.find(a => 
    a.id === req.params.id && a.customerId === req.user.id
  );
  
  if (!anlage) {
    return res.status(404).json({ error: 'Anlage not found' });
  }
  
  res.json(anlage);
});

export default router;