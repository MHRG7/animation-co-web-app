import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { rateLimiterMiddleware } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';

const app: Express = express();

// Trust first proxy (for X-Forwarded-For headre)
app.set('trust proxy', 1);

// 1. Security headers - ALWAYS FIRST
app.use(helmet());

// 2. Logging
app.use(morgan('dev'));

// 3. CORS - control who can call your API
app.use(
  cors({
    origin:
      process.env['NODE_ENV'] === 'production'
        ? 'https://yourdomain.com'
        : 'http://localhost:5137',
    credentials: true, // Allow cookies
  })
);

// 4. Body parsing - AFTER security, BEFORE routes
app.use(express.json());

// 5. Compression - reduce responce size
app.use(compression());

// 6. Rate limiting middlware - prevent abuse
// Disable in test environment
if (process.env['NODE_ENV'] !== 'test') {
  app.use(rateLimiterMiddleware);
}

// 7. Routes
app.use('/auth', authRoutes);

// 8. Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
