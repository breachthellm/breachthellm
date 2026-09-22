import { Router } from 'express';
import { listPackIds, loadPack, loadLevel } from '../packs/loader.js';
import { getPackProgress } from '../progress.js';

const router = Router();

// Loads every level of every pack on each request rather than caching. Fine
// at today's scale (2 packs, 11 levels total), revisit with a cache or a
// precomputed index if the pack count grows significantly.
router.get('/', async (req, res) => {
  try {
    const packIds = await listPackIds();
    const packs = await Promise.all(packIds.map((id) => loadPack(id)));

    const categories = new Map();

    for (const pack of packs) {
      const progress = await getPackProgress(pack.id);

      for (const levelId of pack.levelOrder) {
        const level = await loadLevel(pack.id, levelId);
        const canonicalCategory = level.category.replace(/^defense-/, '');
        const completed = progress?.levels?.[levelId]?.completed ?? false;

        const entry = categories.get(canonicalCategory) ?? {
          category: canonicalCategory,
          owaspLLM: level.framework?.owaspLLM ?? null,
          mitreAtlas: level.framework?.mitreAtlas ?? null,
          availableModes: [],
          attacked: false,
          defended: false,
        };

        if (!entry.availableModes.includes(pack.mode)) {
          entry.availableModes.push(pack.mode);
        }
        if (pack.mode === 'attack' && completed) entry.attacked = true;
        if (pack.mode === 'defend' && completed) entry.defended = true;

        categories.set(canonicalCategory, entry);
      }
    }

    const result = [...categories.values()].map((entry) => {
      const { attacked, defended, ...rest } = entry;
      const state = attacked && defended
        ? 'both'
        : attacked
          ? 'attacked-only'
          : defended
            ? 'defended-only'
            : 'not-started';
      return { ...rest, attacked, defended, state };
    });

    res.json({ categories: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
