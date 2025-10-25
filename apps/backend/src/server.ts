import 'dotenv/config';
import { env } from './config/env.js'; // Validates environment on import
import app from './app.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT.toString()}`);
});
