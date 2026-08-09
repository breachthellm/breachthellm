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

export function verifyFlag(packId, levelId, submitted) {
  const expected = Buffer.from(computeFlag(packId, levelId));
  const actual = Buffer.from(String(submitted ?? ''));
  if (expected.length !== actual.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, actual);
}
