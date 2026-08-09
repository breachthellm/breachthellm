import express from 'express';
import packsRouter from './routes/packs.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/packs', packsRouter);

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
