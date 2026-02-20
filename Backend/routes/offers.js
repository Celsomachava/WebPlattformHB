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
      [id, nummer, kunden_id, service_anfrage_id || null, anlagen_id || null, JSON.stringify(positionen), rabatt_prozent || 0, mwst_prozent || 19, netto || 0, mwst_betrag || 0, brutto || 0, gueltig_bis, bemerkungen || '', Date.now()]
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

// Update entire offer
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { status, sent_at, positionen, netto, mwst_betrag, brutto, gueltig_bis, bemerkungen } = req.body;
    const updates = [];
    const params = [];
    
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (sent_at) {
      updates.push('sent_at = ?');
      params.push(sent_at);
    }
    if (positionen) {
      updates.push('positionen = ?');
      params.push(JSON.stringify(positionen));
    }
    if (netto !== undefined) {
      updates.push('netto = ?');
      params.push(netto);
    }
    if (mwst_betrag !== undefined) {
      updates.push('mwst_betrag = ?');
      params.push(mwst_betrag);
    }
    if (brutto !== undefined) {
      updates.push('brutto = ?');
      params.push(brutto);
    }
    if (gueltig_bis) {
      updates.push('gueltig_bis = ?');
      // Convert ISO date to MySQL DATE format (YYYY-MM-DD)
      const date = new Date(gueltig_bis);
      params.push(date.toISOString().split('T')[0]);
    }
    if (bemerkungen) {
      updates.push('bemerkungen = ?');
      params.push(bemerkungen);
    }
    
    updates.push('updated_at = ?');
    params.push(Date.now());
    params.push(req.params.id);
    
    await db.query(`UPDATE angebote SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Offer updated successfully' });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(400).json({ error: 'Failed to update offer' });
  }
});

// Accept offer (customer)
router.post('/:id/accept', async (req, res) => {
  try {
    await db.query('UPDATE angebote SET status = ?, updated_at = ? WHERE id = ?', ['angenommen', Date.now(), req.params.id]);
    res.json({ message: 'Offer accepted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to accept offer' });
  }
});

// Reject offer (customer)
router.post('/:id/reject', async (req, res) => {
  try {
    await db.query('UPDATE angebote SET status = ?, updated_at = ? WHERE id = ?', ['abgelehnt', Date.now(), req.params.id]);
    res.json({ message: 'Offer rejected' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to reject offer' });
  }
});

export default router;
