import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all service requests
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM service_requests';
    let params = [];
    
    if (req.user.role === 'customer') {
      query += ' WHERE kunden_id = ?';
      params.push(req.user.kundennummer);
    }
    
    query += ' ORDER BY created_at DESC';
    const [requests] = await db.query(query, params);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

// Create service request
router.post('/', async (req, res) => {
  try {
    const id = uuidv4();
    const nummer = `SR_${Date.now()}`;
    const timestamp = Date.now();
    
    const kunden_id = req.body.kunden_id || req.user.kundennummer || req.user.id;
    
    const data = {
      id,
      nummer,
      kunden_id,
      anlagen_id: req.body.anlagenId || req.body.anlagen_id,
      standort: req.body.standort,
      filtertyp: req.body.filtertyp || req.body.anlagentyp,
      qr_code: req.body.qrCode || req.body.qr_code,
      serviceart: req.body.serviceart,
      dringlichkeit: req.body.dringlichkeit || 'normal',
      wunschtermin: req.body.wunschtermin,
      zeitfenster: req.body.zeitfenster,
      bemerkungen: req.body.bemerkungen,
      status: 'neu',
      created_at: timestamp,
      updated_at: timestamp
    };

    await db.query(
      `INSERT INTO service_requests 
       (id, nummer, kunden_id, anlagen_id, standort, filtertyp, qr_code, serviceart, dringlichkeit, wunschtermin, zeitfenster, bemerkungen, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(data)
    );

    res.status(201).json({ ...data, id: nummer });
  } catch (error) {
    console.error('Create service request error:', error);
    res.status(500).json({ error: 'Failed to create service request', details: error.message });
  }
});

// Update service request status
router.patch('/:id/status', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.query(
      'UPDATE service_requests SET status = ?, updated_at = ? WHERE nummer = ? OR id = ?',
      [status, Date.now(), id, id]
    );
    
    const [requests] = await db.query(
      'SELECT * FROM service_requests WHERE nummer = ? OR id = ?',
      [id, id]
    );
    
    res.json(requests[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Sync multiple requests (offline sync)
router.post('/sync', async (req, res) => {
  try {
    const { requests } = req.body;
    const synced = [];
    
    for (const request of requests) {
      const id = uuidv4();
      const nummer = `SR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();
      
      const data = {
        id,
        nummer,
        kunden_id: req.user.kundennummer,
        anlagen_id: request.anlagenId || request.anlagen_id,
        standort: request.standort,
        filtertyp: request.filtertyp || request.anlagentyp,
        qr_code: request.qrCode || request.qr_code,
        serviceart: request.serviceart,
        dringlichkeit: request.dringlichkeit || 'normal',
        wunschtermin: request.wunschtermin,
        zeitfenster: request.zeitfenster,
        bemerkungen: request.bemerkungen,
        status: 'neu',
        created_at: timestamp,
        updated_at: timestamp
      };

      await db.query(
        `INSERT INTO service_requests 
         (id, nummer, kunden_id, anlagen_id, standort, filtertyp, qr_code, serviceart, dringlichkeit, wunschtermin, zeitfenster, bemerkungen, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        Object.values(data)
      );

      synced.push({ ...data, id: nummer });
    }
    
    res.json({ synced, count: synced.length });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default router;