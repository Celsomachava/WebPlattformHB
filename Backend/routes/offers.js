import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all offers
router.get('/', async (req, res) => {
  try {
    const { status, kunden_id } = req.query;
    let query = 'SELECT * FROM angebote WHERE 1=1';
    const params = [];
    
    if (req.user.role === 'customer') {
      query += ' AND kunden_id = ?';
      params.push(req.user.kundennummer);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (kunden_id) {
      query += ' AND kunden_id = ?';
      params.push(kunden_id);
    }
    
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Create offer (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { nummer, kunden_id, service_anfrage_id, anlagen_id, positionen, rabatt_prozent, mwst_prozent, netto, mwst_betrag, brutto, gueltig_bis, bemerkungen } = req.body;
    const id = uuidv4();
    
    await db.query(
      `INSERT INTO angebote (id, nummer, kunden_id, service_anfrage_id, anlagen_id, positionen, rabatt_prozent, mwst_prozent, netto, mwst_betrag, brutto, gueltig_bis, bemerkungen, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'entwurf', ?)`,
      [id, nummer, kunden_id, service_anfrage_id, anlagen_id, JSON.stringify(positionen), rabatt_prozent, mwst_prozent, netto, mwst_betrag, brutto, gueltig_bis, bemerkungen, Date.now()]
    );
    
    res.status(201).json({ id, nummer, kunden_id, status: 'entwurf' });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(400).json({ error: 'Failed to create offer' });
  }
});

// Update offer status
router.patch('/:id/status', adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE angebote SET status = ?, updated_at = ? WHERE id = ?', [status, Date.now(), req.params.id]);
    res.json({ message: 'Offer status updated' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update offer status' });
  }
});

export default router;
