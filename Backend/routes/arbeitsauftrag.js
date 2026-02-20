import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all work orders
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM arbeitsauftrag';
    let params = [];
    
    if (req.user.role === 'customer') {
      query += ' WHERE kunden_id = ?';
      params.push(req.user.kundennummer);
    }
    
    query += ' ORDER BY created_at DESC';
    const [orders] = await db.query(query, params);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work orders' });
  }
});

// Get single work order
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM arbeitsauftrag WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Work order not found' });
    }
    
    res.json(orders[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work order' });
  }
});

// Create work order
router.post('/', async (req, res) => {
  try {
    const id = uuidv4();
    const nummer = `WO_${Date.now()}`;
    const timestamp = Date.now();
    
    const data = {
      id,
      nummer,
      kunden_id: req.user.kundennummer,
      service_anfrage_id: req.body.service_anfrage_id,
      anlagen_id: req.body.anlagen_id,
      techniker: req.body.techniker,
      geplanter_termin: req.body.geplanter_termin,
      tatsaechlicher_termin: req.body.tatsaechlicher_termin,
      arbeitszeit_stunden: req.body.arbeitszeit_stunden || 0,
      durchgefuehrte_arbeiten: req.body.durchgefuehrte_arbeiten,
      verwendete_materialien: JSON.stringify(req.body.verwendete_materialien || []),
      bemerkungen: req.body.bemerkungen,
      status: req.body.status || 'geplant',
      created_at: timestamp,
      updated_at: timestamp
    };

    await db.query(
      `INSERT INTO arbeitsauftrag 
       (id, nummer, kunden_id, service_anfrage_id, anlagen_id, techniker, geplanter_termin, tatsaechlicher_termin, arbeitszeit_stunden, durchgefuehrte_arbeiten, verwendete_materialien, bemerkungen, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(data)
    );

    res.status(201).json({ ...data, verwendete_materialien: req.body.verwendete_materialien || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create work order' });
  }
});

// Update work order
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body, updated_at: Date.now() };
    if (updates.verwendete_materialien) {
      updates.verwendete_materialien = JSON.stringify(updates.verwendete_materialien);
    }
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), req.params.id, req.params.id];
    
    await db.query(
      `UPDATE arbeitsauftrag SET ${fields} WHERE id = ? OR nummer = ?`,
      values
    );
    
    const [orders] = await db.query(
      'SELECT * FROM arbeitsauftrag WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    
    res.json(orders[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update work order' });
  }
});

// Delete work order
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM arbeitsauftrag WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    res.json({ message: 'Work order deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete work order' });
  }
});

export default router;
