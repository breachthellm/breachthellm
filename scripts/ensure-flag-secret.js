import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(repoRoot, '.env');
const envExamplePath = path.join(repoRoot, '.env.example');

if (!existsSync(envPath)) {
  copyFileSync(envExamplePath, envPath);
}

const lines = readFileSync(envPath, 'utf-8').split('\n');
const secretLineIndex = lines.findIndex((line) => line.startsWith('FLAG_SECRET='));
const hasSecret = secretLineIndex !== -1 && lines[secretLineIndex].slice('FLAG_SECRET='.length).trim() !== '';

if (hasSecret) {
  process.exit(0);
}

const secret = crypto.randomBytes(32).toString('hex');
const newLine = `FLAG_SECRET=${secret}`;

if (secretLineIndex !== -1) {
  lines[secretLineIndex] = newLine;
} else {
  lines.push(newLine);
}

writeFileSync(envPath, lines.join('\n'));
console.log('Generated FLAG_SECRET in .env (first run).');
