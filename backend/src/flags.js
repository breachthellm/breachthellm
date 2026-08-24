import crypto from 'node:crypto';

const FLAG_PREFIX = 'BTL';
const FLAG_HEX_LENGTH = 16;

function getFlagSecret() {
  const secret = process.env.FLAG_SECRET;
  if (!secret) {
    throw new Error(
      'FLAG_SECRET is not set. Run `npm run dev` instead of `docker compose up` ' +
        'directly so it can be generated automatically, or set FLAG_SECRET manually in .env.'
    );
  }
  return secret;
}

export function computeFlag(packId, levelId) {
  const secret = getFlagSecret();
  const hash = crypto
    .createHmac('sha256', secret)
    .update(`${packId}:${levelId}`)
    .digest('hex')
    .slice(0, FLAG_HEX_LENGTH);
  return `${FLAG_PREFIX}{${hash}}`;
}

function sanitizeFlagInput(input) {
  // A real flag only ever contains "BTL{", lowercase hex, and "}". Model
  // transcription noise (a stray slash, asterisk, or case slip from
  // reproducing text) can't accidentally turn a wrong flag into a right
  // one here, this only strips/folds, it never substitutes in a
  // different valid character.
  return String(input ?? '')
    .toLowerCase()
    .replace(/[^btl{}0-9a-f]/g, '');
}

export function verifyFlag(packId, levelId, submitted) {
  const expected = Buffer.from(sanitizeFlagInput(computeFlag(packId, levelId)));
  const actual = Buffer.from(sanitizeFlagInput(submitted));
  if (expected.length !== actual.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, actual);
}
