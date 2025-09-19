import express, { Express } from 'express';
import authRoutes from './routes/auth.js';

const app: Express = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
