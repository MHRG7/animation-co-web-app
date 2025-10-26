import winston from 'winston';
import { isDevelopment, isTest } from '../config/env.js';

/**
 * Winston logger configuration
 * - Development: Colorful console output with all log levels
 * - Production: JSON format for log aggregation services
 * - Test: Silent (no console clutter during tests)
 */

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Custom format for development (readable)
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const ts = timestamp as string;
  const lvl = level;
  const msg = message as string;

  let output = `${ts} [${lvl}]: ${msg}`;

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    output += ` ${JSON.stringify(metadata)}`;
  }

  return output;
});

// Create logger instance
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info', // More verbose in development
  format: combine(
    errors({ stack: true }), // Include stack traces ffor errors
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [],
  silent: isTest, // Silent logs during tests
});

// Development: Colorful console output
if (isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), devFormat),
    })
  );
}

// Prodution: JSON format to console (for log aggregation services like cloudWatch)
if (!isDevelopment && !isTest) {
  logger.add(
    new winston.transports.Console({
      format: json(),
    })
  );
}

// Optional: Add file transport for presistent logs
// Uncomment if you want logs saved to files
/*
if (!isTest) {
  logger.add(
    new winston.transforms.File({
      filename: 'logs/error.log',
      level: 'error',
      format: json().
    })
  );

  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: json(),
    })
  );
}
*/

export default logger;
