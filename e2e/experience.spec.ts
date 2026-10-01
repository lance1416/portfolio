import { expect, test } from '@playwright/test';
import { hasStickyRail } from './layout';

test('a timeline bar jumps to its entry, below the navbar, and focuses it', async ({
  page,
}) => {
  // Instant scrolling, so the landing spot doesn't depend on animation timing.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/experience');
  await page.getByRole('link', { name: /^IQBank, .*jump to details$/ }).click();

  const entry = page.locator('article#iqbank');
  await expect(entry).toBeFocused();
  await expect(page).toHaveURL(/#iqbank$/);

  // The smooth scroll lands with the entry just under the fixed navbar
  // (scroll-mt-32), not hidden behind it.
  const navBottom = await page
    .locator('nav')
    .evaluate((el) => el.getBoundingClientRect().bottom);
  await expect
    .poll(() => entry.evaluate((el) => el.getBoundingClientRect().top), {
      timeout: 5000,
    })
    .toBeCloseTo(128, 0);
  expect(128).toBeGreaterThan(navBottom);
});

test('the date rail stays pinned while reading a long entry', async ({
  page,
  viewport,
}) => {
  test.skip(!hasStickyRail(viewport), 'the rail is only sticky from md up');
  await page.goto('/experience');

  const entry = page.locator('article#iqbank');
  // Scroll so the entry's top is well above the viewport.
  await entry.evaluate((el) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 150);
  });

  const railTop = await entry.evaluate(
    (el) => (el.firstElementChild as HTMLElement).getBoundingClientRect().top,
  );
  const entryTop = await entry.evaluate((el) => el.getBoundingClientRect().top);
  expect(entryTop).toBeLessThan(0);
  expect(railTop).toBe(128); // md:top-32
});
