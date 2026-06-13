import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv, resolveRuntimeConfig } from './config-utils.mjs';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const envPath = join(root, '.env.production');
const outputPath = join(root, 'docs', 'config.js');

const envContent = readFileSync(envPath, 'utf8');
const env = parseEnv(envContent);
const config = resolveRuntimeConfig(env);

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(
  outputPath,
  `window.__APP_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`,
  'utf8'
);

console.log(`Generated ${outputPath}`);
