import 'dotenv/config';
import app from './app.js';

console.log('DATABASE_URL:', process.env['DATABASE_URL']); // debug line

const PORT = parseInt(process.env['PORT'] || '3000', 10);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
