import { expect, type Page, test } from '@playwright/test';
import { hasDock, hasMobileMenu } from './layout';

const ROUTES = [
  ['/', 'Sinan Li'],
  ['/experience', 'Experience'],
  ['/projects', 'Projects'],
  ['/research', 'Research'],
] as const;

/** Collects console errors and uncaught exceptions for the whole test. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

const horizontalOverflow = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

for (const [path, heading] of ROUTES) {
  test(`${path} renders without errors or sideways scroll`, async ({
    page,
  }) => {
    const errors = trackErrors(page);
    await page.goto(path);

    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible();
    expect(await horizontalOverflow(page)).toBe(0);
    expect(errors).toEqual([]);
  });
}

test('navigating across every page and back raises no errors', async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto('/');
  for (const [path, heading] of [...ROUTES.slice(1), ROUTES[0]]) {
    // Client-side navigation, like clicking around the site.
    await page.evaluate((to) => {
      history.pushState({}, '', to);
      dispatchEvent(new PopStateEvent('popstate'));
    }, path);
    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('the command palette navigates from the keyboard', async ({ page }) => {
  await page.goto('/');
  // Wait for the app, so the shortcut isn't pressed before its listener exists.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Under parallel load WebKit can take the first keystroke before React has
  // committed; press again only while the palette is still closed (the
  // shortcut toggles, so blind retries could close it).
  const input = page.getByPlaceholder('Type a command or search...');
  await expect(async () => {
    if (!(await input.isVisible()))
      await page.keyboard.press('ControlOrMeta+k');
    await expect(input).toBeVisible({ timeout: 1000 });
  }).toPass();
  await input.fill('res');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/research$/);
});

test('the menu button advertises the platform’s shortcut', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'touch devices show no shortcut');
  await page.goto('/');
  const button = page.getByRole('button', { name: /Menu/ });
  await expect(button).toBeVisible();
  const apple = await page.evaluate(() =>
    /mac|iphone|ipad|ipod/i.test(navigator.platform),
  );
  await expect(button).toHaveAttribute(
    'aria-keyshortcuts',
    apple ? 'Meta+K' : 'Control+K',
  );
  await expect(button.locator('kbd')).toHaveText(apple ? '⌘K' : 'Ctrl K');
});

test.describe('floating dock', () => {
  test.skip(({ viewport }) => !hasDock(viewport), 'the dock shows from sm up');

  test('dark mode applies, persists and uses the dark elevation ring', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('button', { name: 'Toggle Theme' }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    // The navbar's ring comes from --elevation-border, overridden in .dark.
    // The navbar is the first <nav>; Home also has one for "Selected work".
    const navShadow = await page
      .locator('nav')
      .first()
      .evaluate((el) => getComputedStyle(el).boxShadow);
    expect(navShadow).toMatch(/oklch\(1 0 0 \/ 0\.08\)/);
  });
});

test.describe('mobile menu', () => {
  test.skip(({ viewport }) => !hasMobileMenu(viewport), 'phones only');

  test('the menu locks scrolling and closes on navigation', async ({
    page,
  }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle mobile menu' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(
      'hidden',
    );

    await page
      .getByRole('link', { name: 'Experience', exact: true })
      .last()
      .click();
    await expect(page).toHaveURL(/\/experience$/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // The lock is released in an effect, a beat after the attribute changes.
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe('');
  });
});
