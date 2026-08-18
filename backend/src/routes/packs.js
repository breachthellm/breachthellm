import { Router } from 'express';
import {
  loadPack,
  loadLevel,
  toPublicLevelView,
  buildSystemPrompt,
  buildToolsForLevel,
} from '../packs/loader.js';
import { verifyFlag } from '../flags.js';
import { runChat } from '../ollama.js';
import {
  getPackProgress,
  getLevelProgress,
  incrementAttempts,
  completeLevel,
  isLevelUnlocked,
  resetLevel,
  resetPack,
  setTicketContent,
} from '../progress.js';

const TICKET_MAX_LENGTH = 2000;

const router = Router();

function findWinningToolCall(level, toolCalls) {
  if (!level.tool || !Array.isArray(toolCalls)) {
    return null;
  }

  const required = level.tool.parameters?.required ?? [];

  return (
    toolCalls.find((call) => {
      if (call.function?.name !== level.tool.name) {
        return false;
      }
      const args = call.function.arguments ?? {};
      return required.every((key) => args[key] !== undefined && args[key] !== '');
    }) ?? null
  );
}

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

router.get('/:packId/levels', async (req, res) => {
  const { packId } = req.params;

  try {
    const pack = await loadPack(packId);
    const progress = await getPackProgress(packId);

    const levels = await Promise.all(
      pack.levelOrder.map(async (levelId) => {
        const level = await loadLevel(packId, levelId);
        const levelProgress = progress?.levels?.[levelId];

        return {
          id: level.id,
          title: level.title,
          teaser: level.teaser,
          difficulty: level.difficulty,
          category: level.category,
          unlocked: levelProgress?.unlocked ?? false,
          completed: levelProgress?.completed ?? false,
        };
      })
    );

    res.json(levels);
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
    const ticketSubmitted = Boolean(levelProgress?.ticketContent);
    res.json(toPublicLevelView(level, { solved, ticketSubmitted }));
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

    if (!(await isLevelUnlocked(packId, levelId))) {
      return res
        .status(403)
        .json({ error: 'This level is locked. Complete the previous level first.' });
    }

    const levelProgress = await getLevelProgress(packId, levelId);
    const ticketContent = levelProgress?.ticketContent ?? null;
    const alreadySolved = levelProgress?.completed ?? false;

    const systemPrompt = buildSystemPrompt(level);
    const tools = buildToolsForLevel(level);
    const assistantMessage = await runChat(systemPrompt, message, ticketContent, tools);

    await incrementAttempts(packId, levelId);

    const winningToolCall = findWinningToolCall(level, assistantMessage.tool_calls);
    if (winningToolCall && !alreadySolved) {
      await completeLevel(packId, levelId);
    }
    const solved = alreadySolved || Boolean(winningToolCall);

    res.json({
      response: assistantMessage.content,
      solved,
      trace: [
        {
          source: 'system',
          text: solved ? systemPrompt : '[system prompt redacted until solved]',
        },
        ...(ticketContent ? [{ source: 'ticket', text: ticketContent }] : []),
        { source: 'user', text: message },
        ...(winningToolCall
          ? [
              {
                source: 'action',
                text: `${winningToolCall.function.name}(${JSON.stringify(
                  winningToolCall.function.arguments
                )}) — EXECUTED`,
              },
            ]
          : []),
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

router.post('/:packId/levels/:levelId/ticket', async (req, res) => {
  const { packId, levelId } = req.params;
  const { content } = req.body ?? {};

  if (typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'content is required' });
  }

  if (content.length > TICKET_MAX_LENGTH) {
    return res
      .status(400)
      .json({ error: `content must be ${TICKET_MAX_LENGTH} characters or fewer` });
  }

  try {
    await loadLevel(packId, levelId);

    if (!(await isLevelUnlocked(packId, levelId))) {
      return res
        .status(403)
        .json({ error: 'This level is locked. Complete the previous level first.' });
    }

    await setTicketContent(packId, levelId, content);
    const levelProgress = await getLevelProgress(packId, levelId);
    res.json(levelProgress);
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

    if (!(await isLevelUnlocked(packId, levelId))) {
      return res
        .status(403)
        .json({ error: 'This level is locked. Complete the previous level first.' });
    }

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

router.post('/:packId/levels/:levelId/reset', async (req, res) => {
  const { packId, levelId } = req.params;

  try {
    await loadLevel(packId, levelId);
    const levelProgress = await resetLevel(packId, levelId);
    res.json(levelProgress);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:packId/reset', async (req, res) => {
  const { packId } = req.params;

  try {
    const progress = await resetPack(packId);
    res.json(progress);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
