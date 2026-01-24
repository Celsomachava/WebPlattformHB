import express from 'express';
import { mockCustomers, mockAnlagen, mockUsers } from '../data/mockData.js';

const router = express.Router();

// Get all customers
router.get('/', (req, res) => {
  // Transform data to match frontend expectations
  const transformedCustomers = mockCustomers.map(customer => ({
    id: customer.id,
    kundennummer: customer.id,
    firmenname: customer.company,
    ansprechpartner: customer.name,
    email: customer.email,
    telefon: customer.phone,
    strasse: customer.address ? customer.address.split(',')[0] : '',
    plz: customer.address ? customer.address.split(',')[1]?.trim().split(' ')[0] : '',
    ort: customer.address ? customer.address.split(',')[1]?.trim().split(' ').slice(1).join(' ') : '',
    created_at: customer.registeredSince,
    password: customer.password
  }));
  
  res.json(transformedCustomers);
});

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

// Create customer route
router.post('/', (req, res) => {
  const { kundennummer, firmenname, ansprechpartner, email, telefon, password } = req.body;
  
  if (!kundennummer || !firmenname || !ansprechpartner || !email || !telefon || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  // Check if customer already exists
  const existingCustomer = mockCustomers.find(c => c.id === kundennummer);
  if (existingCustomer) {
    return res.status(409).json({ error: 'Customer already exists', customer: existingCustomer });
  }

  const newCustomer = {
    id: kundennummer,
    name: ansprechpartner,
    company: firmenname,
    email,
    phone: telefon,
    password,
    registeredSince: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  
  mockCustomers.push(newCustomer);
  mockUsers.push({
    id: kundennummer,
    name: ansprechpartner,
    role: 'customer',
    token: `token_${kundennummer.toLowerCase()}`,
    company: firmenname,
    email,
    phone: telefon,
    address: '',
    position: 'Ansprechpartner',
    password
  });
  
  res.status(201).json(newCustomer);
});

// Create customer route (alternative endpoint)
router.post('/create', (req, res) => {
  const { kundennummer, firmenname, ansprechpartner, email, telefon, password } = req.body;
  
  if (!kundennummer || !firmenname || !ansprechpartner || !email || !telefon || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const newCustomer = {
    id: kundennummer,
    name: ansprechpartner,
    company: firmenname,
    email,
    phone: telefon,
    password,
    registeredSince: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  
  mockCustomers.push(newCustomer);
  mockUsers.push({
    id: kundennummer,
    name: ansprechpartner,
    role: 'customer',
    token: `token_${kundennummer.toLowerCase()}`,
    company: firmenname,
    password
  });
  
  res.status(201).json(newCustomer);
});

export default router;