import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all invoices
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM rechnungen WHERE 1=1';
    const params = [];
    
    if (req.user.role === 'customer') {
      query += ' AND kunden_id = ?';
      params.push(req.user.kundennummer);
    }
    
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Create invoice (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { nummer, kunden_id, angebot_id, positionen, mwst_prozent, netto, mwst_betrag, brutto, zahlungsbedingungen, faellig_am, bemerkungen } = req.body;
    const id = uuidv4();
    
    await db.query(
      `INSERT INTO rechnungen (id, nummer, kunden_id, angebot_id, positionen, mwst_prozent, netto, mwst_betrag, brutto, zahlungsbedingungen, faellig_am, bemerkungen, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'offen', ?)`,
      [id, nummer, kunden_id, angebot_id, JSON.stringify(positionen), mwst_prozent, netto, mwst_betrag, brutto, zahlungsbedingungen, faellig_am, bemerkungen, Date.now()]
    );
    
    res.status(201).json({ id, nummer, kunden_id, status: 'offen' });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(400).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice status
router.patch('/:id/status', adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE rechnungen SET status = ?, updated_at = ? WHERE id = ?', [status, Date.now(), req.params.id]);
    res.json({ message: 'Invoice status updated' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update invoice status' });
  }
});

export default router;
