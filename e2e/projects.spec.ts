import { expect, type Page, test } from '@playwright/test';
import { showsRing } from './layout';

/** The progress bar marked current names the front project. */
const front = (page: Page) => page.locator('[aria-current="true"]');

/** Ring face opacities (front, passed, upcoming), rounded. */
const faceOpacities = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.transform-3d > button')].map(
      (face) => Math.round(Number(getComputedStyle(face).opacity) * 100) / 100,
    ),
  );

test.describe('3D ring', () => {
  test.skip(({ viewport }) => !showsRing(viewport), 'roomy landscape only');

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(front(page)).toHaveAttribute('aria-label', 'Show KidneyOS');
    await page.mouse.move(640, 450);
  });

  test('the wheel turns the ring; the page itself never scrolls', async ({
    page,
    hasTouch,
  }) => {
    test.skip(hasTouch, 'touch devices swipe instead (see below)');
    await page.mouse.wheel(0, 120);
    await expect(front(page)).toHaveAttribute('aria-label', 'Show Evogami');

    // A new gesture after a pause goes back.
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -120);
    await expect(front(page)).toHaveAttribute('aria-label', 'Show KidneyOS');

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('a burst of wheel events moves only one card', async ({
    page,
    hasTouch,
  }) => {
    test.skip(hasTouch, 'touch devices swipe instead (see below)');
    for (let i = 0; i < 10; i++) await page.mouse.wheel(0, 40);
    await page.waitForTimeout(300);
    await expect(front(page)).toHaveAttribute('aria-label', 'Show Evogami');
    // Evogami is the last project; also proves nothing overshot past it.
    await expect(page.locator('.transform-3d > button')).toHaveCount(2);
  });

  test('dragging sideways swipes between projects', async ({ page }) => {
    const drag = async (dx: number) => {
      await page.mouse.move(800, 450);
      await page.mouse.down();
      await page.mouse.move(800 + dx / 2, 450, { steps: 5 });
      await page.mouse.move(800 + dx, 450, { steps: 5 });
      await page.mouse.up();
    };
    await drag(-200);
    await expect(front(page)).toHaveAttribute('aria-label', 'Show Evogami');
    await drag(200);
    await expect(front(page)).toHaveAttribute('aria-label', 'Show KidneyOS');
  });

  test('passed cards vanish behind the text; the next one waits half-lit', async ({
    page,
  }) => {
    await expect.poll(() => faceOpacities(page)).toEqual([1, 0.5]);

    await page.keyboard.press('ArrowRight');
    await expect(front(page)).toHaveAttribute('aria-label', 'Show Evogami');
    await expect.poll(() => faceOpacities(page)).toEqual([0, 1]);
  });

  test('the stage fits between the navbar and the dock', async ({ page }) => {
    // Measure the settled layout: webfonts loaded, entrance animations done.
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => faceOpacities(page)).toEqual([1, 0.5]);
    await page.waitForTimeout(500);

    const box = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
        });

    const nav = await box('nav');
    const dock = await box('.fixed.bottom-6');
    const text = await box('main .relative.z-10');
    const card = await box('.transform-3d > button[aria-hidden="true"]');

    for (const part of [text, card]) {
      expect(part.top).toBeGreaterThan(nav.bottom);
      expect(part.bottom).toBeLessThan(dock.top);
    }
    // Text on the left, ring on the right, not overlapping.
    expect(text.right).toBeLessThan(card.left);
    // Roughly even space above and below the text.
    expect(
      Math.abs(text.top - nav.bottom - (dock.top - text.bottom)),
    ).toBeLessThan(60);
  });

  test('reduced motion gets the swipe strip instead of the ring', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Projects',
    );
    await expect(page.locator('.transform-3d')).toHaveCount(0);
    await expect(page.locator('.snap-x')).toBeVisible();
  });
});

test.describe('swipe strip', () => {
  test.skip(
    ({ viewport }) => showsRing(viewport),
    'shown when the ring is not',
  );

  test('snaps card by card and peeks the next one', async ({ page }) => {
    await page.goto('/projects');
    const strip = page.locator('.snap-x');
    await expect(strip).toBeVisible();

    const layout = await strip.evaluate((el) => {
      const cards = [...el.children] as HTMLElement[];
      return {
        snap: getComputedStyle(el).scrollSnapType,
        stripWidth: el.clientWidth,
        firstWidth: cards[0].getBoundingClientRect().width,
        secondLeft: cards[1].getBoundingClientRect().left,
      };
    });
    expect(layout.snap).toBe('x mandatory');
    expect(layout.firstWidth).toBeLessThan(layout.stripWidth);
    // The next card is partly on screen.
    expect(layout.secondLeft).toBeLessThan(layout.stripWidth);

    // Scroll part-way; snapping must settle with a card centred (or at an
    // end of the strip, where centring is clamped), never in between.
    await strip.evaluate((el) =>
      el.scrollBy({ left: 120, behavior: 'instant' }),
    );
    await expect
      .poll(() =>
        strip.evaluate((el) => {
          const box = el.getBoundingClientRect();
          const centre = box.left + box.width / 2;
          const centred = [...el.children].some((card) => {
            const r = card.getBoundingClientRect();
            return Math.abs(r.left + r.width / 2 - centre) < 2;
          });
          const atEnd =
            el.scrollLeft < 1 ||
            el.scrollLeft > el.scrollWidth - el.clientWidth - 1;
          return centred || atEnd;
        }),
      )
      .toBe(true);
  });
});
