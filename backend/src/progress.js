import { getDb } from './db.js';
import { loadPack } from './packs/loader.js';

const INSTALL_ID = 'local';
const COLLECTION = 'progress';

function emptyLevelState(unlocked) {
  return {
    unlocked,
    completed: false,
    attempts: 0,
    hintsUsed: 0,
    completedAt: null,
  };
}

function progressCollection() {
  return getDb().collection(COLLECTION);
}

export async function ensurePackProgress(packId) {
  const collection = progressCollection();
  const pack = await loadPack(packId);
  const existing = await collection.findOne({ installId: INSTALL_ID, packId });
  const now = new Date();

  if (!existing) {
    const levels = {};
    pack.levelOrder.forEach((levelId, index) => {
      levels[levelId] = emptyLevelState(index === 0);
    });

    await collection.insertOne({
      installId: INSTALL_ID,
      packId,
      levels,
      createdAt: now,
      lastUpdated: now,
    });
    return;
  }

  const missingLevelIds = pack.levelOrder.filter(
    (levelId) => !(levelId in existing.levels)
  );

  if (missingLevelIds.length > 0) {
    const updates = { lastUpdated: now };
    for (const levelId of missingLevelIds) {
      updates[`levels.${levelId}`] = emptyLevelState(false);
    }
    await collection.updateOne({ installId: INSTALL_ID, packId }, { $set: updates });
  }
}

export async function getPackProgress(packId) {
  return progressCollection().findOne(
    { installId: INSTALL_ID, packId },
    { projection: { _id: 0 } }
  );
}

export async function getLevelProgress(packId, levelId) {
  const progress = await getPackProgress(packId);
  return progress?.levels?.[levelId] ?? null;
}

export async function incrementAttempts(packId, levelId) {
  await progressCollection().updateOne(
    { installId: INSTALL_ID, packId },
    {
      $inc: { [`levels.${levelId}.attempts`]: 1 },
      $set: { lastUpdated: new Date() },
    }
  );
}

export async function completeLevel(packId, levelId) {
  const pack = await loadPack(packId);
  const nextLevelId = pack.levelOrder[pack.levelOrder.indexOf(levelId) + 1];
  const now = new Date();

  const update = {
    $set: {
      [`levels.${levelId}.completed`]: true,
      [`levels.${levelId}.completedAt`]: now,
      lastUpdated: now,
    },
  };

  if (nextLevelId) {
    update.$set[`levels.${nextLevelId}.unlocked`] = true;
  }

  await progressCollection().updateOne({ installId: INSTALL_ID, packId }, update);
}
