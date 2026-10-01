import { expect, type Page, test } from '@playwright/test';
import { hasMobileMenu } from './layout';

/** Records console errors, uncaught exceptions and renderer crashes. */
function trackFailures(page: Page) {
  const failures: string[] = [];
  page.on('console', (m) => m.type() === 'error' && failures.push(m.text()));
  page.on('pageerror', (e) => failures.push(e.message));
  page.on('crash', () => failures.push('renderer crashed'));
  return failures;
}

/** Flags any loading spinner that appears from now on. */
const watchForSpinner = (page: Page) =>
  page.evaluate(() => {
    (window as unknown as { spinnerSeen: boolean }).spinnerSeen = false;
    new MutationObserver(() => {
      if (document.querySelector('.animate-spin')) {
        (window as unknown as { spinnerSeen: boolean }).spinnerSeen = true;
      }
    }).observe(document.body, { childList: true, subtree: true });
  });

const spinnerSeen = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { spinnerSeen: boolean }).spinnerSeen,
  );

const direction = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.navDirection);

test.describe('navbar page turns', () => {
  test.skip(
    ({ viewport }) => hasMobileMenu(viewport),
    'navbar links from sm up',
  );

  test('turn in chapter order, land the title, never show a spinner', async ({
    page,
  }) => {
    const failures = trackFailures(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await watchForSpinner(page);

    // The URL changes as the transition starts; the page (and the direction
    // MainLayout sets) commits a frame later, so wait for the new heading.
    const go = async (name: string) => {
      await page.getByRole('link', { name, exact: true }).first().click();
      await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    };

    await go('Experience');
    expect(await direction(page)).toBe('forward');

    await go('Research');
    expect(await direction(page)).toBe('forward');

    await go('Experience');
    expect(await direction(page)).toBe('back');

    // The odometer roll settles with the title inside its mask.
    const title = page.locator('h1 span span');
    await expect(title).toHaveText('Experience');
    await expect
      .poll(() =>
        title.evaluate((el) => {
          const mask = el.parentElement?.getBoundingClientRect();
          return Math.round(el.getBoundingClientRect().top - (mask?.top ?? 0));
        }),
      )
      .toBe(0);

    expect(await spinnerSeen(page)).toBe(false);
    expect(failures).toEqual([]);
  });

  test('reduced motion turns pages without animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/experience');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page
      .getByRole('link', { name: 'Research', exact: true })
      .first()
      .click();
    const running = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) =>
            String(
              (a.effect as KeyframeEffect | null)?.pseudoElement ?? '',
            ).includes('view-transition'),
          )
          .filter((a) => a.playState === 'running').length,
    );
    expect(running).toBe(0);
    await expect(page).toHaveURL(/\/research$/);
  });
});

test.describe('mobile menu navigation', () => {
  test.skip(({ viewport }) => !hasMobileMenu(viewport), 'phones only');

  test('navigates from the menu without crashing', async ({ page }) => {
    // Regression: a view transition started from inside the menu crashed
    // WebKit as the tapped link unmounted.
    const failures = trackFailures(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle mobile menu' }).click();
    await page
      .getByRole('link', { name: 'Research', exact: true })
      .last()
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Research',
    );
    expect(failures).toEqual([]);
  });
});
