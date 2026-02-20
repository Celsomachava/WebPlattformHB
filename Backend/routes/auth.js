import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log('Login attempt:', { userId, password: password ? '***' : 'missing' });
    
    if (!userId || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: 'User ID and password required' });
    }

    const [users] = await db.query(
      'SELECT * FROM customers WHERE kundennummer = ?',
      [userId]
    );
    console.log('Database query result:', users.length, 'users found');

    if (!users.length) {
      console.log('User not found:', userId);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    console.log('User found:', { id: user.kundennummer, role: user.role });
    
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword);

    if (!validPassword) {
      console.log('Invalid password for user:', userId);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, kundennummer: user.kundennummer, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log('Login successful for:', userId);
    res.json({
      token,
      user: {
        id: user.kundennummer,
        name: user.ansprechpartner,
        company: user.firmenname,
        email: user.email,
        phone: user.telefon,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await db.query(
      'SELECT id, kundennummer, firmenname, ansprechpartner, email, telefon, role FROM customers WHERE id = ?',
      [decoded.id]
    );

    if (!users.length) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = users[0];
    res.json({ 
      valid: true, 
      user: { 
        id: user.kundennummer,
        name: user.ansprechpartner,
        company: user.firmenname,
        email: user.email,
        phone: user.telefon,
        role: user.role
      } 
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.query(
      'SELECT id, kundennummer, firmenname, ansprechpartner, email, telefon, role FROM customers WHERE id = ?',
      [decoded.id]
    );

    if (!users.length) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = users[0];
    res.json({
      id: user.kundennummer,
      name: user.ansprechpartner,
      company: user.firmenname,
      email: user.email,
      phone: user.telefon,
      role: user.role
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;