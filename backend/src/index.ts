import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import crudRoutes from './routes/crud';
import seedRoutes from './routes/seed';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api', crudRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
