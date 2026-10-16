/**
 * Projects' egg, beside Evogami's skills: a paper crane in the game's white
 * and gold, swinging on a thread like a cat toy, and the cat watching it go back and
 * forth. A clear background, so it sits on the project card.
 */
import { CAT_H, CAT_W, drawCat } from './cat';
import { type Box, px, type SceneFactory } from './engine';

export const CRANE_W = 38;
export const CRANE_H = 16;

export const CRANE_CAT_BOX: Box = {
  x: CRANE_W - CAT_W - 1,
  y: CRANE_H - CAT_H,
  w: CAT_W,
  h: CAT_H,
};

export const CRANE_LABEL =
  'Pixel art: a cat watching a paper crane swing on a thread';

// Side on, facing left: the wing raised and swept back, a long gold neck
// rising to a head bent down at the tip, a long gold tail, and a body that
// tapers to a point underneath. `w` white paper, `v` its shaded fold, `g` gold.
const CRANE = [
  '..........w....',
  '.........ww....',
  'gg......www...g',
  'g.g....wwwv..g.',
  '...g..wwwvv.g..',
  '....g.wwwvvg...',
  '.....gwwwvg....',
  '......wwvv.....',
  '.......wv......',
];
const HOLD = 10; // the column the thread is tied to (the wing tip)

const COLORS = { w: '#f7f3ea', v: '#ddd3bd', g: '#d9aa3c' };
/** Traced round the crane, so white paper shows on a white card too. */
const OUTLINE = '#9a7a32';
const PIVOT = { x: 14, y: 0 };
const THREAD = 5;

export const paperCrane: SceneFactory = (ctx) => {
  let t = 0;
  return {
    update(dt) {
      t += dt;
    },
    render() {
      ctx.clearRect(0, 0, CRANE_W, CRANE_H);

      // A pendulum: the thread swings, the crane hangs from its end.
      const angle = Math.sin(t * 1.7) * 0.55;
      const end = {
        x: PIVOT.x + Math.sin(angle) * THREAD,
        y: PIVOT.y + Math.cos(angle) * THREAD,
      };
      ctx.globalAlpha = 0.6;
      for (let i = 0; i <= THREAD; i++) {
        const k = i / THREAD;
        px(
          ctx,
          PIVOT.x + (end.x - PIVOT.x) * k,
          PIVOT.y + (end.y - PIVOT.y) * k,
          '#a1a1aa',
        );
      }
      ctx.globalAlpha = 1;
      const left = Math.round(end.x) - HOLD;
      const top = Math.round(end.y) + 1;
      const filled = (dx: number, dy: number) =>
        (CRANE[dy]?.[dx] ?? '.') !== '.';
      // Outline first: every empty pixel touching the crane.
      for (let dy = -1; dy <= CRANE.length; dy++) {
        for (let dx = -1; dx <= CRANE[0].length; dx++) {
          if (filled(dx, dy)) continue;
          if (
            filled(dx - 1, dy) ||
            filled(dx + 1, dy) ||
            filled(dx, dy - 1) ||
            filled(dx, dy + 1)
          ) {
            px(ctx, left + dx, top + dy, OUTLINE);
          }
        }
      }
      CRANE.forEach((row, dy) => {
        [...row].forEach((ch, dx) => {
          if (ch !== '.')
            px(ctx, left + dx, top + dy, COLORS[ch as 'w' | 'v' | 'g']);
        });
      });

      // The cat only has eyes for the crane.
      drawCat(ctx, CRANE_CAT_BOX.x, CRANE_CAT_BOX.y, t, {
        x: end.x,
        y: end.y + 3,
      });
    },
  };
};
