import express from 'express';
import { mockUsers } from '../data/mockData.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  
  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password required' });
  }

  const user = mockUsers.find(u => u.id === userId && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    token: user.token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      company: user.company
    }
  });
});

router.post('/validate', (req, res) => {
  const { token } = req.body;
  const user = mockUsers.find(u => u.token === token);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.json({ valid: true, user: { id: user.id, name: user.name, role: user.role } });
});

export default router;