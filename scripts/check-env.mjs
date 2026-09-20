// Refuses to build without the booking form's EmailJS credentials.
//
// Vite inlines VITE_* variables at build time. A build made without them ships a
// booking form that cannot send anything, and nothing looks wrong until a
// customer tries to book. Failing here, before any bundling, means a missing
// .env is caught on the developer's machine, and that dist/ is never overwritten
// with a broken build.
//
// Runs first in `npm run build`. The values come from .env / .env.production, or
// from the process environment (for example build variables on Cloudflare).

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = loadEnv('production', root, 'VITE_');

const required = ['VITE_EMAILJS_SERVICE_ID', 'VITE_EMAILJS_TEMPLATE_ID', 'VITE_EMAILJS_PUBLIC_KEY'];

// `.env.example` ships "your_..." placeholders; copying it without editing must not pass.
const unfilled = required.filter(name => {
  const value = env[name]?.trim();
  return !value || /^your_/i.test(value);
});

if (unfilled.length > 0) {
  console.error(`
  Build stopped: the booking form has no EmailJS credentials.

  Missing or still a placeholder: ${unfilled.join(', ')}

  Copy .env.example to .env and fill in the three values from the EmailJS
  dashboard. On Cloudflare's own build, set them as build variables instead.
  dist/ was not touched.
`);
  process.exit(1);
}

console.log('  EmailJS credentials found for the booking form.');
