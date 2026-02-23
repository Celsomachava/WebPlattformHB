import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get anlagen for current customer
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM anlagen';
    let params = [];
    
    if (req.user.role === 'customer') {
      query += ' WHERE kunden_id = ?';
      params.push(req.user.kundennummer);
    }
    
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anlagen' });
  }
});

// Get anlage by QR code
router.get('/qr/:qr_code', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM anlagen WHERE qr_code_id = ?', [req.params.qr_code]);
    if (!rows.length) return res.status(404).json({ error: 'Anlage not found' });
    
    // Check if customer owns this anlage
    if (req.user.role === 'customer' && rows[0].kunden_id !== req.user.kundennummer) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anlage' });
  }
});

// Create anlage
router.post('/', async (req, res) => {
  try {
    const { anlagen_id, kunden_id, standort, filtertyp, qr_code_id } = req.body;
    const id = uuidv4();
    
    // Customers can only create anlagen for themselves
    const finalKundenId = req.user.role === 'customer' ? req.user.kundennummer : kunden_id;
    
    await db.query(
      'INSERT INTO anlagen (id, anlagen_id, kunden_id, standort, filtertyp, qr_code_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, anlagen_id, finalKundenId, standort, filtertyp, qr_code_id, Date.now()]
    );
    
    res.status(201).json({ id, anlagen_id, kunden_id: finalKundenId, standort, filtertyp, qr_code_id });
  } catch (error) {
    console.error('Create anlage error:', error);
    res.status(400).json({ error: 'Failed to create anlage', details: error.message });
  }
});

// Update anlage (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { standort, filtertyp, qr_code_id } = req.body;
    await db.query(
      'UPDATE anlagen SET standort = ?, filtertyp = ?, qr_code_id = ?, updated_at = ? WHERE id = ?',
      [standort, filtertyp, qr_code_id, Date.now(), req.params.id]
    );
    res.json({ message: 'Anlage updated' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update anlage' });
  }
});

// Delete anlage (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM anlagen WHERE id = ?', [req.params.id]);
    res.json({ message: 'Anlage deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete anlage' });
  }
});

export default router;
