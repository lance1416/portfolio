/**
 * CTWS's egg, beside its skills: Cheesy Toast Work Space gets a toaster.
 * Every few seconds a slice pops up, cheese melting down its side and a
 * little steam rising, then sinks back for the next round. A clear
 * background, so it sits on the project card.
 */
import { px, type SceneFactory } from './engine';

export const TOASTER_W = 22;
export const TOASTER_H = 16;

export const TOASTER_LABEL =
  'Pixel art: a toaster popping up a slice of cheese toast';

// Side on: a rounded chrome body with a slot on top, a lever on the right
// and two little feet. `c` chrome, `h` highlight, `d` its shade, `k` edge.
const TOASTER = [
  '.kkkkkkkkkkkk..',
  'kchhhhhhhhhhck.',
  'kchccccccccccdk',
  'kcccccccccccckk',
  'kcccccccccccc.k',
  'kccccccccccdd.k',
  'kddddddddddddk.',
  '.kk........kk..',
];
const COLORS = { c: '#c4c4cc', h: '#f4f4f5', d: '#8a8a94', k: '#52525b' };

const SLOT = { x: 3, w: 9 }; // across the top
const TOP = TOASTER_H - TOASTER.length; // where the body starts
const RISE = 6; // how far the slice pops up

// The slice: crust round soft bread, cheese over the top.
const CRUST = '#a8662e';
const BREAD = '#efcf94';
const CHEESE = '#f5b82e';

const CYCLE = 5;

/** How far up the slice is at `t`: a pop with an overshoot, then down. */
function lift(t: number) {
  const k = t % CYCLE;
  if (k < 2.2) return 0;
  if (k < 2.6) {
    const p = (k - 2.2) / 0.4;
    return RISE * (1 + 0.3 * Math.sin(p * Math.PI)) * Math.min(1, p * 1.6);
  }
  if (k < 4.4) return RISE;
  return RISE * (1 - (k - 4.4) / 0.6);
}

export const toaster: SceneFactory = (ctx) => {
  let t = 0;
  return {
    update(dt) {
      t += dt;
    },
    render() {
      ctx.clearRect(0, 0, TOASTER_W, TOASTER_H);
      const k = t % CYCLE;
      const up = Math.round(lift(t));

      // The slice, drawn first so the toaster hides its lower part.
      if (up > 0) {
        const y0 = TOP - up;
        for (let y = y0; y <= TOP; y++) {
          for (let x = SLOT.x; x < SLOT.x + SLOT.w; x++) {
            const edge = x === SLOT.x || x === SLOT.x + SLOT.w - 1;
            px(ctx, x, y, edge ? CRUST : BREAD);
          }
        }
        // Cheese over the crown, a drip down the side that grows while it's
        // up, and steam once it has settled.
        for (let x = SLOT.x; x < SLOT.x + SLOT.w; x++) px(ctx, x, y0, CHEESE);
        px(ctx, SLOT.x + 1, y0 + 1, CHEESE);
        px(ctx, SLOT.x + 5, y0 + 1, CHEESE);
        const drip =
          k > 2.6 && k < 4.4 ? Math.min(3, Math.floor((k - 2.6) * 2)) : 0;
        for (let i = 0; i < drip; i++) px(ctx, SLOT.x + 6, y0 + 2 + i, CHEESE);
        if (k > 2.8 && k < 4.6) {
          for (const [i, sx] of [SLOT.x + 2, SLOT.x + 6].entries()) {
            const p = ((k - 2.8) * 0.8 + i * 0.5) % 1;
            ctx.globalAlpha = 0.6 * (1 - p);
            px(
              ctx,
              sx + Math.round(Math.sin(p * 6 + i)),
              y0 - 1 - p * 5,
              '#a1a1aa',
            );
          }
          ctx.globalAlpha = 1;
        }
      }

      TOASTER.forEach((row, dy) => {
        [...row].forEach((ch, dx) => {
          if (ch !== '.')
            px(ctx, dx + 1, TOP + dy, COLORS[ch as 'c' | 'h' | 'd' | 'k']);
        });
      });
      // The slot, dark while it's empty.
      if (up === 0) {
        for (let x = SLOT.x + 1; x < SLOT.x + SLOT.w - 1; x++) {
          px(ctx, x, TOP, '#27272a');
        }
      }
      // The lever: down while it toasts, up once it pops.
      const lever = TOP + (up > 0 ? 2 : 4);
      px(ctx, 16, lever, COLORS.k);
      px(ctx, 17, lever, COLORS.k);
    },
  };
};
