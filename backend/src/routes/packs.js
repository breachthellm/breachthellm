import { Router } from 'express';
import { loadLevel, toPublicLevelView } from '../packs/loader.js';

const router = Router();

router.get('/:packId/levels/:levelId', async (req, res) => {
  const { packId, levelId } = req.params;

  try {
    const level = await loadLevel(packId, levelId);
    const solved = false;
    res.json(toPublicLevelView(level, { solved }));
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
