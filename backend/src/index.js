import express from 'express';
import cors from 'cors';
import packsRouter from './routes/packs.js';
import { connectDB } from './db.js';
import { listPackIds } from './packs/loader.js';
import { ensurePackProgress } from './progress.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/packs', packsRouter);

async function start() {
  await connectDB();

  const packIds = await listPackIds();
  for (const packId of packIds) {
    await ensurePackProgress(packId);
  }

  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start backend:', err.message);
  process.exit(1);
});
