import { Router } from 'express';
import { loadLevel, toPublicLevelView, buildSystemPrompt } from '../packs/loader.js';
import { verifyFlag } from '../flags.js';
import { runChat } from '../ollama.js';

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

    res.json({
      response,
      trace: [
        { source: 'system', text: '[system prompt redacted until solved]' },
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
