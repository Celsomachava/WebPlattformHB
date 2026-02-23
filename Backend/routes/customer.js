import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get current customer profile
router.get('/me', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, kundennummer, firmenname, ansprechpartner, email, telefon, role, created_at FROM customers WHERE kundennummer = ?',
      [req.user.kundennummer]
    );
    if (!rows.length) return res.status(404).json({ error: 'Customer not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get all customers (admin only) or own profile (customer)
router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [rows] = await db.query(
        'SELECT id, kundennummer, firmenname, ansprechpartner, email, telefon, role, created_at FROM customers ORDER BY created_at DESC'
      );
      res.json(rows);
    } else {
      const [rows] = await db.query(
        'SELECT id, kundennummer, firmenname, ansprechpartner, email, telefon, role, created_at FROM customers WHERE kundennummer = ?',
        [req.user.kundennummer]
      );
      res.json(rows);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID (admin or own profile)
router.get('/:kundennummer', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.kundennummer !== req.params.kundennummer) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const [rows] = await db.query(
      'SELECT id, kundennummer, firmenname, ansprechpartner, email, telefon, role, created_at FROM customers WHERE kundennummer = ?',
      [req.params.kundennummer]
    );
    if (!rows.length) return res.status(404).json({ error: 'Customer not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { kundennummer, firmenname, ansprechpartner, email, telefon, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, kundennummer, firmenname, ansprechpartner, email, telefon, hashedPassword, role || 'customer', Date.now()]
    );
    
    res.status(201).json({ id, kundennummer, firmenname, ansprechpartner, email, telefon, role: role || 'customer' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:kundennummer', async (req, res) => {
  try {
    const { kundennummer } = req.params;
    
    // Only allow users to update their own profile unless admin
    if (req.user.role !== 'admin' && req.user.kundennummer !== kundennummer) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { firmenname, ansprechpartner, email, telefon } = req.body;
    await db.query(
      'UPDATE customers SET firmenname = ?, ansprechpartner = ?, email = ?, telefon = ?, updated_at = ? WHERE kundennummer = ?',
      [firmenname, ansprechpartner, email, telefon, Date.now(), kundennummer]
    );
    res.json({ message: 'Customer updated' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update customer' });
  }
});

// Delete customer (admin only)
router.delete('/:kundennummer', adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM customers WHERE kundennummer = ?', [req.params.kundennummer]);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
