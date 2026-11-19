import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { languages, slugs, href, type Page } from '../src/i18n/ui';
import services from '../src/content/services.json' with { type: 'json' };
import categories from '../src/content/categories.json' with { type: 'json' };
import {
  isRedirectedLegacy,
  serviceRedirects,
  catalogRedirects,
} from '../src/data/service-redirects.mjs';

for (const lang of languages) {
  test(`${lang}: all routes, accessibility, images and mobile overflow`, async ({
    page,
  }) => {
    const routes = [
      ...(Object.keys(slugs[lang]) as Page[]).map((key) => href(lang, key)),
      ...categories.map(
        (category) => `${href(lang, 'services')}${category.slug[lang]}/`,
      ),
      ...services
        .filter((service) => !isRedirectedLegacy(service.id))
        .map((service) => `${href(lang, 'services')}${service.slug[lang]}/`),
    ];
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error')
        errors.push(`${msg.text()} (${msg.location().url})`);
    });
    const reports = [];
    for (const path of routes) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('.draft-bar, .gate-note')).toHaveCount(0);
      await page.locator('footer').scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          page
            .locator('img')
            .evaluateAll((images) =>
              images.every(
                (img) =>
                  (img as HTMLImageElement).complete &&
                  (img as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
      const report = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      reports.push({
        path,
        viewport: 1440,
        violations: report.violations,
        passes: report.passes.length,
      });
      expect(report.violations, `${path}: desktop accessibility`).toEqual([]);
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(overflow, `${path}: horizontal overflow at ${width}px`).toBe(
          false,
        );
      }
      {
        await page.setViewportSize({ width: 390, height: 844 });
        const mobileReport = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        reports.push({
          path,
          viewport: 390,
          violations: mobileReport.violations,
          passes: mobileReport.passes.length,
        });
        expect(mobileReport.violations).toEqual([]);
      }
    }
    expect(errors).toEqual([]);
    await mkdir('artifacts', { recursive: true });
    await writeFile(
      `artifacts/accessibility-${lang}.json`,
      JSON.stringify(reports, null, 2),
    );
  });

  test(`${lang}: six categories, twelve services, responsive grid and navigation`, async ({
    page,
  }) => {
    await page.goto(href(lang, 'services'));
    await expect(page.locator('.category-card')).toHaveCount(6);
    for (const [width, columns] of [
      [1440, 3],
      [900, 2],
      [390, 1],
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(
        await page
          .locator('.category-grid')
          .evaluate(
            (grid) =>
              getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          ),
      ).toBe(columns);
      await page.screenshot({
        path: `artifacts/screenshots/${lang}-services-${width}.png`,
        fullPage: true,
      });
    }
    await page.locator('.category-card a').first().click();
    await expect(page.locator('h1')).toHaveText(categories[0].title[lang]);
    await expect(page.locator('.included-service h3')).toHaveText(
      categories[0].items.map((item) => item.title[lang]),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({
      path: `artifacts/screenshots/${lang}-category-desktop.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: `artifacts/screenshots/${lang}-category-mobile.png`,
      fullPage: true,
    });
    const other = lang === 'ca' ? 'es' : 'ca';
    await page.locator(`.language-switcher a[lang='${other}']`).click();
    await expect(page).toHaveURL(new RegExp(categories[0].slug[other]));
    await expect(page.locator('.included-service')).toHaveCount(3);
    await page.locator('.category-sidebar .button').click();
    await expect(page).toHaveURL(new RegExp(href(other, 'contact')));
    await page.goto(href(lang));
    await expect(page.locator('.category-card')).toHaveCount(6);
  });

  test(`${lang}: captures, keyboard, menu and language continuity`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/${lang}/`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.screenshot({
      path: `artifacts/screenshots/${lang}-home-desktop.png`,
      fullPage: true,
    });
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${lang}/`);
    await page.screenshot({
      path: `artifacts/screenshots/${lang}-home-mobile.png`,
      fullPage: true,
    });
    const menu = page.locator('.mobile-menu summary');
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
    await page.keyboard.press('Tab');
    await expect(page.locator('.mobile-menu nav a').first()).toBeFocused();
    await page.locator('.mobile-menu nav a').nth(1).click();
    await expect(page).toHaveURL(new RegExp(slugs[lang].studio));
    const other = lang === 'ca' ? 'es' : 'ca';
    await page.locator(`.language-switcher a[lang='${other}']`).click();
    await expect(page).toHaveURL(
      new RegExp(`/${other}/${slugs[other].studio}/`),
    );
    await page.screenshot({
      path: `artifacts/screenshots/${other}-studio-mobile.png`,
      fullPage: true,
    });
    expect(
      await page.evaluate(() => ({
        local: localStorage.length,
        session: sessionStorage.length,
        cookies: document.cookie,
      })),
    ).toEqual({ local: 0, session: 0, cookies: '' });
  });
  test(`${lang}: confirmed contact details and local map`, async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      if (!request.url().startsWith('http://127.0.0.1:4321/'))
        external.push(request.url());
    });
    await page.goto(href(lang, 'contact'));
    await expect(page.locator('main address')).toContainText(
      '08720 Vilafranca del Penedès',
    );
    await expect(
      page.locator('main a[href^="mailto:"]').first(),
    ).toHaveAttribute(
      'href',
      'mailto:info@habitaliaconsulting.com?subject=WEB%20HABITALIA%20CONSULTING',
    );
    await expect(page.locator('main a[href^="tel:"]')).toHaveAttribute(
      'href',
      'tel:+34938923692',
    );
    await expect(page.locator('.location-map')).toHaveAttribute(
      'data-latitude',
      '41.3438246',
    );
    await expect(page.locator('.location-map')).toHaveAttribute(
      'data-longitude',
      '1.7016493',
    );
    await expect(page.locator('.location-map svg')).toBeVisible();
    await expect(page.locator('.location-map-link')).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=41.3438246%2C1.7016493',
    );
    await expect(page.locator('.map-open-text')).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=41.3438246%2C1.7016493',
    );
    await expect(page.locator('.location-map-link')).not.toHaveAttribute(
      'target',
      '_blank',
    );
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.locator('form, input, textarea')).toHaveCount(0);
    await expect(page.locator('.contact-invitation .button')).toHaveAttribute(
      'href',
      'mailto:info@habitaliaconsulting.com?subject=WEB%20HABITALIA%20CONSULTING',
    );
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.screenshot({
        path: `artifacts/screenshots/${lang}-contact-${width}.png`,
        fullPage: true,
      });
    }
    expect(external).toEqual([]);
  });
}

test('essential navigation works without JavaScript; no contact data can be sent', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/es/');
  await expect(page.locator('h1')).toContainText('Una mirada técnica.');
  await page.locator('.mobile-menu summary').click();
  await page.locator('.mobile-menu a').last().click();
  await expect(page).toHaveURL(/\/es\/contacto\//);
  await expect(page.locator('form, input, textarea')).toHaveCount(0);
  await expect(page.locator('.contact-invitation .button')).toHaveAttribute(
    'href',
    'mailto:info@habitaliaconsulting.com?subject=WEB%20HABITALIA%20CONSULTING',
  );
  await context.close();
});

test('Catalan default, Spanish switch, not-found page and no external requests', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4321/'))
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/ca\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await page.locator('.language-switcher a[lang="es"]').click();
  await expect(page).toHaveURL(/\/es\//);
  await page.goto('/404.html');
  await expect(page.locator('h1')).toContainText('Página no encontrada');
  expect(external).toEqual([]);
});

test('legacy URL fallback navigates to the equivalent category', async ({
  page,
}) => {
  for (const rule of serviceRedirects) {
    await page.goto(rule.from);
    await page.waitForURL(`http://127.0.0.1:4321${rule.to}`);
    await expect(page.locator('.included-service')).not.toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `http://localhost:4321${rule.to}`,
    );
  }
});

test('old draft URLs lead to the current catalogue', async ({ page }) => {
  for (const rule of catalogRedirects) {
    await page.goto(rule.from);
    await page.waitForURL(`http://127.0.0.1:4321${rule.to}`);
    await expect(page.locator('.category-card')).toHaveCount(6);
    await expect(page.locator('.legacy-notice')).toHaveCount(0);
  }
});
