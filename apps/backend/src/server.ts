import 'dotenv/config';
import { env } from './config/env.js'; // Validates environment on import
import app from './app.js';
import logger from './lib/logger.js';
import { disconnectPrisma } from './lib/prisma.js';

const PORT = env.PORT;

// Store server instance for graceful shutdown
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT.toString()}`);
});

// Graceful shutdown handler
function shutdown(signal: string): void {
  logger.info(`${signal} received, shutting down gracefully`);

  // Stop accepting new connections
  server.close(() => {
    logger.info('HTTP server closed');

    // Disconnect database
    disconnectPrisma()
      .then(() => {
        logger.info('Database disconnected');
        process.exit(0);
      })
      .catch((err: unknown) => {
        logger.error('Error disconnecting database', { error: err });
        process.exit(1);
      });
  });

  // Force exit if graceful shutdown takes too long (10 seconds)
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Listen for termination signals
process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});
process.on('SIGINT', () => {
  shutdown('SIGINT');
});
