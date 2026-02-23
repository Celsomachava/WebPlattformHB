import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all inspection protocols
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM pruefprotokoll';
    let params = [];
    
    if (req.user.role === 'customer') {
      query += ' WHERE kunden_id = ?';
      params.push(req.user.kundennummer);
    }
    
    query += ' ORDER BY created_at DESC';
    const [protocols] = await db.query(query, params);
    res.json(protocols);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inspection protocols' });
  }
});

// Get single inspection protocol
router.get('/:id', async (req, res) => {
  try {
    const [protocols] = await db.query(
      'SELECT * FROM pruefprotokoll WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    
    if (protocols.length === 0) {
      return res.status(404).json({ error: 'Inspection protocol not found' });
    }
    
    res.json(protocols[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inspection protocol' });
  }
});

// Create inspection protocol
router.post('/', async (req, res) => {
  try {
    const id = uuidv4();
    const nummer = `PP_${Date.now()}`;
    const timestamp = Date.now();
    
    const data = {
      id,
      nummer,
      kunden_id: req.user.kundennummer,
      service_anfrage_id: req.body.service_anfrage_id,
      anlagen_id: req.body.anlagen_id,
      pruefdatum: req.body.pruefdatum,
      naechste_pruefung: req.body.naechste_pruefung,
      pruefart: req.body.pruefart,
      pruefergebnis: req.body.pruefergebnis || 'bestanden',
      pruefpunkte: JSON.stringify(req.body.pruefpunkte || []),
      maengel: JSON.stringify(req.body.maengel || []),
      bemerkungen: req.body.bemerkungen,
      pruefer_name: req.body.pruefer_name,
      pruefer_qualifikation: req.body.pruefer_qualifikation,
      status: req.body.status || 'entwurf',
      created_at: timestamp,
      updated_at: timestamp
    };

    await db.query(
      `INSERT INTO pruefprotokoll 
       (id, nummer, kunden_id, service_anfrage_id, anlagen_id, pruefdatum, naechste_pruefung, pruefart, pruefergebnis, pruefpunkte, maengel, bemerkungen, pruefer_name, pruefer_qualifikation, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(data)
    );

    res.status(201).json({ 
      ...data, 
      pruefpunkte: req.body.pruefpunkte || [],
      maengel: req.body.maengel || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inspection protocol' });
  }
});

// Update inspection protocol
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body, updated_at: Date.now() };
    if (updates.pruefpunkte) {
      updates.pruefpunkte = JSON.stringify(updates.pruefpunkte);
    }
    if (updates.maengel) {
      updates.maengel = JSON.stringify(updates.maengel);
    }
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), req.params.id, req.params.id];
    
    await db.query(
      `UPDATE pruefprotokoll SET ${fields} WHERE id = ? OR nummer = ?`,
      values
    );
    
    const [protocols] = await db.query(
      'SELECT * FROM pruefprotokoll WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    
    res.json(protocols[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inspection protocol' });
  }
});

// Delete inspection protocol
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM pruefprotokoll WHERE id = ? OR nummer = ?',
      [req.params.id, req.params.id]
    );
    res.json({ message: 'Inspection protocol deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inspection protocol' });
  }
});

export default router;
