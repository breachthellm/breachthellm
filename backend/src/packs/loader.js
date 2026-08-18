import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeFlag } from '../flags.js';

const PACKS_DIR = path.dirname(fileURLToPath(import.meta.url));
const ID_PATTERN = /^[a-z0-9-]+$/i;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class InvalidIdError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function assertValidId(id, label) {
  if (!ID_PATTERN.test(id)) {
    throw new InvalidIdError(`Invalid ${label}: ${id}`);
  }
}

async function readJson(filePath, notFoundMessage) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new NotFoundError(notFoundMessage);
    }
    throw err;
  }
}

export async function listPackIds() {
  const entries = await fs.readdir(PACKS_DIR, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export async function loadPack(packId) {
  assertValidId(packId, 'packId');
  const packJsonPath = path.join(PACKS_DIR, packId, 'pack.json');
  return readJson(packJsonPath, `Pack not found: ${packId}`);
}

export async function loadLevel(packId, levelId) {
  assertValidId(packId, 'packId');
  assertValidId(levelId, 'levelId');

  const pack = await loadPack(packId);
  if (!pack.levelOrder.includes(levelId)) {
    throw new NotFoundError(`Level not found in pack ${packId}: ${levelId}`);
  }

  const levelDir = path.join(PACKS_DIR, packId, 'levels', levelId);
  const level = await readJson(
    path.join(levelDir, 'level.json'),
    `Level not found: ${levelId}`
  );

  const systemPrompt = await fs.readFile(
    path.join(levelDir, level.systemPromptFile),
    'utf-8'
  );

  return { ...level, packId, systemPrompt };
}

export function buildSystemPrompt(level) {
  return level.systemPrompt.replaceAll(
    '{{FLAG}}',
    computeFlag(level.packId, level.id)
  );
}

export function toPublicLevelView(level, { solved, ticketSubmitted = false }) {
  const {
    packId,
    flag,
    postSolveExplanation,
    systemPrompt,
    systemPromptFile,
    ...publicFields
  } = level;

  return {
    ...publicFields,
    solved,
    ticketSubmitted,
    ...(solved
      ? {
          flag: computeFlag(packId, level.id),
          postSolveExplanation,
          systemPrompt: buildSystemPrompt(level),
        }
      : {}),
  };
}
