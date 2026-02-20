import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/service.js';
import customerRoutes from './routes/customer.js';
import anlagenRoutes from './routes/anlagen.js';
import offersRoutes from './routes/offers.js';
import invoicesRoutes from './routes/invoices.js';
import arbeitsauftragRoutes from './routes/arbeitsauftrag.js';
import pruefprotokollRoutes from './routes/pruefprotokoll.js';
import wochenplanRoutes from './routes/wochenplan.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/service', authMiddleware, serviceRoutes);
app.use('/api/serviceanfragen', authMiddleware, serviceRoutes);
app.use('/api/customer', authMiddleware, customerRoutes);
app.use('/api/kunden', authMiddleware, customerRoutes);
app.use('/api/anlagen', authMiddleware, anlagenRoutes);
app.use('/api/offers', authMiddleware, offersRoutes);
app.use('/api/angebote', authMiddleware, offersRoutes);
app.use('/api/invoices', authMiddleware, invoicesRoutes);
app.use('/api/rechnungen', authMiddleware, invoicesRoutes);
app.use('/api/arbeitsauftrag', authMiddleware, arbeitsauftragRoutes);
app.use('/api/pruefprotokoll', authMiddleware, pruefprotokollRoutes);
app.use('/api/wochenplan', authMiddleware, wochenplanRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});