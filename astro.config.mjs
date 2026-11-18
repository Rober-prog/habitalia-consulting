import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { allRedirects } from './src/data/service-redirects.mjs';

// SITE_URL is deliberately unset until the owner confirms the domain.
const site = process.env.SITE_URL;
const base = process.env.BASE_PATH || '/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
  throw new Error('BASE_PATH must be a slash-delimited site path.');
}
if (site && (!/^https:\/\//.test(site) || new URL(site).pathname !== '/')) {
  throw new Error('SITE_URL must be an HTTPS origin without a path.');
}
export default defineConfig({
  site: site || 'http://localhost:4321',
  base,
  output: 'static',
  trailingSlash: 'always',
  redirects: Object.fromEntries(
    allRedirects.map((rule) => [
      rule.from,
      {
        destination: `${base.replace(/\/$/, '')}${rule.to}`,
        status: rule.status,
      },
    ]),
  ),
  vite: { plugins: [tailwindcss()] },
});
