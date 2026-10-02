import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { hasMobileMenu } from './layout';

const PAGES = ['/', '/experience', '/projects', '/research', '/nope'];

/**
 * Reveals every scroll-triggered section and waits for entrances to finish,
 * so contrast is measured on settled colours, not mid-fade opacity.
 */
async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    scrollTo(0, 0);
  });
  // CSS transitions (e.g. the theme's background fade) show in getAnimations()…
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  // …but Motion's springs run in JS and take longer under load: also wait
  // until every element's opacity holds still between polls.
  await page.waitForFunction(
    () => {
      const w = window as Window & { __opacities?: string };
      const now = [...document.querySelectorAll('body *')]
        .map((el) => getComputedStyle(el).opacity)
        .join();
      const settled = now === w.__opacities;
      w.__opacities = now;
      return settled;
    },
    undefined,
    { polling: 250 },
  );
}

for (const path of PAGES) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${path} has no WCAG A/AA violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await settle(page);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        // Ghost numbers and the big 404 are pure decoration (exempt from 1.4.3).
        .exclude('[aria-hidden="true"]')
        .analyze();
      expect(
        violations.flatMap((v) =>
          v.nodes.map(
            (n) =>
              `${v.id}: ${n.target.join(' ')} ${JSON.stringify(n.any[0]?.data ?? '')}`,
          ),
        ),
      ).toEqual([]);
    });
  }
}

const scan = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .exclude('[aria-hidden="true"]')
    .analyze()
    .then(({ violations }) =>
      violations.flatMap((v) =>
        v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`),
      ),
    );

test('the open command palette has no violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const input = page.getByPlaceholder('Type a command or search...');
  await expect(async () => {
    if (!(await input.isVisible()))
      await page.keyboard.press('ControlOrMeta+k');
    await expect(input).toBeVisible({ timeout: 1000 });
  }).toPass();
  await settle(page);
  expect(await scan(page)).toEqual([]);
});

test('the open mobile menu has no violations', async ({ page, viewport }) => {
  test.skip(!hasMobileMenu(viewport), 'phones only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle mobile menu' }).click();
  await settle(page);
  expect(await scan(page)).toEqual([]);
});

test('terminal mode has no violations', async ({ page, viewport }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  if (hasMobileMenu(viewport)) {
    await page.getByRole('button', { name: 'Toggle mobile menu' }).click();
    await page.getByRole('button', { name: 'Terminal' }).click();
  } else {
    await page.getByRole('button', { name: 'Terminal Mode' }).click();
  }
  // The terminal loads on demand, so wait for its prompt.
  const prompt = page.getByRole('textbox', { name: 'Command' });
  await expect(prompt).toBeFocused();
  await prompt.fill('help');
  await prompt.press('Enter');
  expect(await scan(page)).toEqual([]);
});

test('the first Tab reveals a skip link that focuses the page content', async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(isMobile, 'keyboard navigation');
  await page.goto('/experience');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Safari on macOS skips buttons and links on Tab by default; Option+Tab
  // reaches them, and WebKit on macOS behaves the same.
  const mac = browserName === 'webkit' && process.platform === 'darwin';
  await page.keyboard.press(mac ? 'Alt+Tab' : 'Tab');
  const skip = page.getByRole('button', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});
