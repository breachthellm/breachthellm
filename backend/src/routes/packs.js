import { Router } from 'express';
import {
  loadPack,
  loadLevel,
  toPublicLevelView,
  buildSystemPrompt,
} from '../packs/loader.js';
import { verifyFlag } from '../flags.js';
import { runChat } from '../ollama.js';
import {
  getPackProgress,
  getLevelProgress,
  incrementAttempts,
  completeLevel,
} from '../progress.js';

const router = Router();

router.get('/:packId/progress', async (req, res) => {
  const { packId } = req.params;

  try {
    await loadPack(packId);
    const progress = await getPackProgress(packId);
    if (!progress) {
      return res.status(404).json({ error: `No progress found for pack: ${packId}` });
    }
    res.json(progress);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:packId/levels/:levelId', async (req, res) => {
  const { packId, levelId } = req.params;

  try {
    const level = await loadLevel(packId, levelId);
    const levelProgress = await getLevelProgress(packId, levelId);
    const solved = levelProgress?.completed ?? false;
    res.json(toPublicLevelView(level, { solved }));
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:packId/levels/:levelId/attempt', async (req, res) => {
  const { packId, levelId } = req.params;
  const { message } = req.body ?? {};

  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const level = await loadLevel(packId, levelId);
    const systemPrompt = buildSystemPrompt(level);
    const response = await runChat(systemPrompt, message);

    await incrementAttempts(packId, levelId);

    const levelProgress = await getLevelProgress(packId, levelId);
    const solved = levelProgress?.completed ?? false;

    res.json({
      response,
      trace: [
        {
          source: 'system',
          text: solved ? systemPrompt : '[system prompt redacted until solved]',
        },
        { source: 'user', text: message },
      ],
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:packId/levels/:levelId/submit', async (req, res) => {
  const { packId, levelId } = req.params;
  const { flag } = req.body ?? {};

  if (typeof flag !== 'string' || flag.trim() === '') {
    return res.status(400).json({ error: 'flag is required' });
  }

  try {
    await loadLevel(packId, levelId);
    const correct = verifyFlag(packId, levelId, flag);
    if (correct) {
      await completeLevel(packId, levelId);
    }
    res.json({ correct });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
