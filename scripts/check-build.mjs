import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import categories from '../src/content/categories.json' with { type: 'json' };
import {
  serviceRedirects,
  allRedirects,
} from '../src/data/service-redirects.mjs';

const root = resolve('dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const localPath = (path) => {
  assert.ok(!base || path.startsWith(`${base}/`), `Missing base path: ${path}`);
  return path.slice(base.length);
};
async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? files(join(dir, entry.name))
          : join(dir, entry.name),
      ),
    )
  ).flat();
}
const htmlFiles = (await files(root)).filter((path) => path.endsWith('.html'));
const redirectFiles = new Map(
  allRedirects.map((rule) => [join(root, rule.from, 'index.html'), rule]),
);
const titles = new Set();
const descriptions = new Set();
let references = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (redirectFiles.has(file)) {
    const rule = redirectFiles.get(file);
    assert.ok(
      html.includes(`${base}${rule.to}`),
      `Static redirect target: ${file}`,
    );
    assert.match(
      html,
      /http-equiv="refresh"/,
      `Static redirect fallback: ${file}`,
    );
    continue;
  }
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One H1: ${file}`);
  assert.match(html, /<html[^>]+lang="(?:ca|es)"/, `Language: ${file}`);
  assert.match(
    html,
    /name="robots"[^>]+content="noindex/,
    `Draft noindex: ${file}`,
  );
  assert.doesNotMatch(
    html,
    /soliver@|670\s*24|General Prim|Pla dels Cavalls|1992|1985|LocalBusiness|ProfessionalService/,
    `Unconfirmed facts: ${file}`,
  );
  assert.doesNotMatch(
    html,
    /Versión de trabajo|Versió de treball|pendientes de validación|pendents de validació|en preparación|en preparació|pendiente de aprobación|pendent d’aprovació/,
    `No construction or validation notices: ${file}`,
  );
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `Unique title: ${file}`);
  titles.add(title);
  if (!file.endsWith('404.html')) {
    const description = html.match(
      /name="description"[^>]+content="([^"]+)"/,
    )?.[1];
    assert.ok(
      description && !descriptions.has(description),
      `Unique description: ${file}`,
    );
    descriptions.add(description);
    for (const language of ['ca', 'es', 'x-default'])
      assert.ok(
        html.includes(`hreflang="${language}"`),
        `Hreflang ${language}: ${file}`,
      );
    assert.match(html, /rel="canonical"/, `Canonical: ${file}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:|data:)/.test(target)) continue;
    const url = new URL(
      target,
      `http://localhost${base}/${file.slice(root.length + 1).replaceAll('\\', '/')}`,
    );
    let path = join(root, decodeURIComponent(localPath(url.pathname)));
    if (url.pathname.endsWith('/')) path = join(path, 'index.html');
    assert.ok(path.startsWith(root), `Local path: ${target}`);
    assert.ok(
      await stat(path).catch(() => false),
      `Broken asset/link: ${file} -> ${target}`,
    );
    if (url.hash) {
      const destination = await readFile(path, 'utf8');
      assert.ok(
        destination.includes(`id="${url.hash.slice(1)}"`),
        `Missing fragment ${target}: ${file}`,
      );
    }
    references++;
  }
  // Verify reciprocal, same-section language links in the generated HTML.
  const currentLang = html.match(/<html[^>]+lang="(ca|es)"/)?.[1];
  if (/[/\\](ca|es)[/\\]/.test(file)) {
    const other = currentLang === 'ca' ? 'es' : 'ca';
    const alternate = html.match(
      new RegExp(`rel="alternate" hreflang="${other}" href="([^"]+)"`),
    )?.[1];
    assert.ok(alternate, `Alternate: ${file}`);
    const otherHtml = await readFile(
      join(root, localPath(new URL(alternate).pathname), 'index.html'),
      'utf8',
    );
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(
      otherHtml.includes(`hreflang="${currentLang}" href="${canonical}"`),
      `Reciprocal alternate: ${file}`,
    );
    assert.match(html, /property="og:image"/, `Social metadata: ${file}`);
  }
}
for (const filename of [
  'logo-original-transparente.png',
  'logo-original-ampliado-4140px.png',
  'logo-habitalia-actual.png',
]) {
  const hash = async (path) =>
    createHash('sha256')
      .update(await readFile(path))
      .digest('hex');
  assert.equal(
    await hash(`assets/brand/${filename}`),
    await hash(`public/assets/brand/${filename}`),
    `Brand hash: ${filename}`,
  );
}
const expectedContentPages = 2 + 2 * (7 + categories.length);
assert.equal(
  htmlFiles.length,
  expectedContentPages + allRedirects.length,
  'Content plus static redirect fallbacks',
);
assert.equal(categories.length, 6, 'Exactly six corporate categories');
const expectedServices = [
  'Direcciones de obras',
  'Project Management',
  'Presupuestos y certificaciones',
  'Proyectos técnicos de reformas y actividades',
  'Proyectos de todo tipo',
  'Informes periciales',
  'Valoraciones inmobiliarias',
  'Tramitaciones',
  'Agrupación y segregación horizontal',
  'Coordinaciones de seguridad y salud',
  'Casos difíciles',
  'Feng Shui',
];
const actualServices = categories.flatMap((category) =>
  category.items.map((item) => item.title.es),
);
assert.deepEqual(
  actualServices,
  expectedServices,
  'The exact twelve supplied services, in their supplied groups',
);
assert.equal(
  new Set(
    categories.flatMap((category) => category.items.map((item) => item.id)),
  ).size,
  12,
  'No repeated service',
);
const redirects = await readFile(join(root, '_redirects'), 'utf8');
const inventory = JSON.parse(
  await readFile('artifacts/service-route-inventory-before.json', 'utf8'),
);
assert.equal(
  createHash('sha256')
    .update(await readFile('src/content/services.json'))
    .digest('hex'),
  inventory.legacySourceSha256,
  'Legacy source is unchanged',
);
for (const rule of serviceRedirects) {
  assert.ok(
    inventory.routes.some((item) => item.path === rule.from && item.existed),
    `Redirect must have existed: ${rule.from}`,
  );
  assert.ok(
    redirects.includes(`${rule.from} ${rule.to} 301`),
    `Explicit Cloudflare 301: ${rule.from}`,
  );
  assert.ok(
    await stat(join(root, rule.to, 'index.html')),
    `Existing redirect destination: ${rule.to}`,
  );
  assert.ok(
    !serviceRedirects.some((other) => other.from === rule.to),
    'No redirect chain',
  );
}
for (const category of categories) {
  for (const [lang, segment] of [
    ['es', 'servicios'],
    ['ca', 'serveis'],
  ]) {
    const html = await readFile(
      join(root, lang, segment, category.slug[lang], 'index.html'),
      'utf8',
    );
    for (const item of category.items)
      assert.ok(
        html.includes(item.title[lang]),
        `Included service ${item.id} in ${lang}`,
      );
    assert.match(html, /image\/avif/, 'AVIF responsive source');
    assert.match(html, /image\/webp/, 'WebP responsive source');
    assert.match(html, /srcset=/, 'Responsive image sizes');
    assert.doesNotMatch(
      html,
      /category-visual-pending/,
      'Generated category image required for final build',
    );
  }
}
assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Disallow: \//);
assert.doesNotMatch(await readFile(join(root, 'sitemap.xml'), 'utf8'), /<loc>/);
console.log(
  `PASS: ${expectedContentPages} content pages + ${allRedirects.length} redirect fallbacks; ${references} local references; 6 categories / 12 exact services; responsive AVIF/WebP; reciprocal SEO; legacy source and brand hashes unchanged.`,
);
