import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

const base = 'http://127.0.0.1:4322';
const server = spawn(
  process.execPath,
  [
    fileURLToPath(
      new URL('../node_modules/astro/bin/astro.mjs', import.meta.url),
    ),
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4322',
  ],
  { stdio: 'ignore', windowsHide: true },
);
let chrome;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (
      await fetch(base)
        .then((response) => response.ok)
        .catch(() => false)
    ) {
      ready = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!ready) throw new Error('Local preview did not start.');
  await mkdir('artifacts/performance', { recursive: true });
  chrome = await launch({
    chromePath:
      process.env.CHROME_PATH ||
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
    chromeFlags: [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--disable-background-networking',
    ],
  });
  const summary = [];
  for (const { path, mode, id } of [
    { path: '/ca/', mode: 'mobile', id: 'ca-home-mobile' },
    { path: '/es/', mode: 'mobile', id: 'es-home-mobile' },
    { path: '/es/el-despacho/', mode: 'mobile', id: 'es-studio-mobile' },
    { path: '/es/', mode: 'desktop', id: 'es-home-desktop' },
  ]) {
    const desktop =
      mode === 'desktop'
        ? {
            formFactor: 'desktop',
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 1000,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
            },
          }
        : {};
    const result = await lighthouse(
      `${base}${path}`,
      {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'error',
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
      },
      { extends: 'lighthouse:default', settings: desktop },
    );
    if (!result) throw new Error('Lighthouse returned no report.');
    const { lhr, report } = result;
    await writeFile(`artifacts/performance/${id}.html`, report[0]);
    await writeFile(`artifacts/performance/${id}.json`, report[1]);
    const item = {
      id,
      url: `${base}${path}`,
      mode,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, category]) => [
          key,
          Math.round(category.score * 100),
        ]),
      ),
      lcpMs: lhr.audits['largest-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      tbtMs: lhr.audits['total-blocking-time'].numericValue,
      failedAudits: Object.entries(lhr.audits)
        .filter(
          ([, audit]) =>
            audit.score !== null &&
            audit.score < 1 &&
            audit.scoreDisplayMode !== 'informative',
        )
        .map(([key, audit]) => ({
          id: key,
          title: audit.title,
          score: audit.score,
        })),
      warnings: lhr.runWarnings,
    };
    summary.push(item);
    console.log(JSON.stringify(item));
  }
  await writeFile(
    'artifacts/performance/summary.json',
    JSON.stringify(
      {
        date: new Date().toISOString(),
        environment:
          'Local Chrome, Lighthouse simulated throttling. Not field CWV.',
        results: summary,
      },
      null,
      2,
    ),
  );
} finally {
  await Promise.resolve(chrome?.kill());
  server.kill();
}
