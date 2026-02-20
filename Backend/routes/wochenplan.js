import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all weekly plans
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM wochenplan';
    let params = [];
    
    if (req.user.role === 'customer') {
      query += ' WHERE kunden_id = ?';
      params.push(req.user.kundennummer);
    }
    
    query += ' ORDER BY kalenderwoche DESC, jahr DESC';
    const [plans] = await db.query(query, params);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly plans' });
  }
});

// Get single weekly plan
router.get('/:id', async (req, res) => {
  try {
    const [plans] = await db.query(
      'SELECT * FROM wochenplan WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    
    if (plans.length === 0) {
      return res.status(404).json({ error: 'Weekly plan not found' });
    }
    
    res.json(plans[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly plan' });
  }
});

// Create weekly plan
router.post('/', adminOnly, async (req, res) => {
  try {
    const id = uuidv4();
    const nummer = `WP_${Date.now()}`;
    const timestamp = Date.now();
    
    const data = {
      id,
      nummer,
      kunden_id: req.body.kunden_id,
      kalenderwoche: req.body.kalenderwoche,
      jahr: req.body.jahr,
      plan_rows: JSON.stringify(req.body.rows || []),
      status: req.body.status || 'entwurf',
      created_at: timestamp,
      updated_at: timestamp
    };

    await db.query(
      `INSERT INTO wochenplan (id, nummer, kunden_id, kalenderwoche, jahr, plan_rows, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(data)
    );

    res.status(201).json({ ...data, rows: req.body.rows || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create weekly plan' });
  }
});

// Update weekly plan
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body, updated_at: Date.now() };
    if (updates.rows) {
      updates.plan_rows = JSON.stringify(updates.rows);
      delete updates.rows;
    }
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), req.params.id, req.params.id];
    
    await db.query(
      `UPDATE wochenplan SET ${fields} WHERE id = ? OR nummer = ?`,
      values
    );
    
    const [plans] = await db.query(
      'SELECT * FROM wochenplan WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    
    res.json(plans[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update weekly plan' });
  }
});

// Delete weekly plan
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM wochenplan WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    res.json({ message: 'Weekly plan deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete weekly plan' });
  }
});

export default router;
