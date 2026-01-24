import express from 'express';
import { mockUsers, mockCustomers } from '../data/mockData.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  
  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password required' });
  }

  const user = mockUsers.find(u => u.id === userId && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Get full customer data if user is a customer
  let userData = {
    id: user.id,
    name: user.name,
    role: user.role,
    company: user.company,
    email: user.email,
    phone: user.phone,
    address: user.address,
    position: user.position
  };

  if (user.role === 'customer') {
    const customerData = mockCustomers.find(c => c.id === user.id);
    if (customerData) {
      userData = {
        ...userData,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        company: customerData.company,
        name: customerData.name,
        registeredSince: customerData.registeredSince
      };
    }
  } else if (user.role === 'admin') {
    userData = {
      ...userData,
      email: 'admin@heduschka.de',
      phone: '+49 987 654321',
      address: 'Industriestraße 10, 54321 Heduschka',
      position: 'Administrator'
    };
  }

  res.json({
    token: user.token,
    user: userData
  });
});

router.post('/validate', (req, res) => {
  const { token } = req.body;
  const user = mockUsers.find(u => u.token === token);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.json({ 
    valid: true, 
    user: { 
      id: user.id, 
      name: user.name, 
      role: user.role,
      company: user.company,
      email: user.email,
      phone: user.phone,
      address: user.address,
      position: user.position
    } 
  });
});

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  const user = mockUsers.find(u => u.token === token);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Get full customer data if user is a customer
  let userData = {
    id: user.id,
    name: user.name,
    role: user.role,
    company: user.company,
    email: user.email,
    phone: user.phone,
    address: user.address,
    position: user.position
  };

  if (user.role === 'customer') {
    const customerData = mockCustomers.find(c => c.id === user.id);
    if (customerData) {
      userData = {
        ...userData,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        company: customerData.company,
        name: customerData.name,
        registeredSince: customerData.registeredSince
      };
    }
  } else if (user.role === 'admin') {
    userData = {
      ...userData,
      email: 'admin@heduschka.de',
      phone: '+49 987 654321',
      address: 'Industriestraße 10, 54321 Heduschka',
      position: 'Administrator'
    };
  }

  res.json(userData);
});

export default router;