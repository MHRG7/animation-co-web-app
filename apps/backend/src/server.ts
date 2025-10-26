import 'dotenv/config';
import { env } from './config/env.js'; // Validates environment on import
import app from './app.js';
import logger from './lib/logger.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT.toString()}`);
});
