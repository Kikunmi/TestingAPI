import app from './app.js';
import connectDb from './db.js';

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to connect to DB', err);
  process.exit(1);
});
