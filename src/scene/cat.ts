/**
 * The cat that hides in every scene: Yuyuan (芋圆, "taro ball"), a family
 * British Shorthair — lilac coat, paler on the face, big copper eyes, a pink
 * nose, small ears set wide on a round head, and a thick tail.
 *
 * Sitting, facing the viewer, tail curled up on the right. `b` body, `l` the
 * paler face and chest, `s` shade, `i` inside the ears, `e` an eye (2×2),
 * `n` the nose. The pupils and the tail are drawn separately: the pupils
 * follow the pointer, the tail flicks.
 */
import { type Ctx, px } from './engine';

export const CAT_W = 11;
export const CAT_H = 10;

const SPRITE = [
  '.bi...ib...',
  '.bbbbbbb...',
  'blllllllb..',
  'beellleeb..',
  'beelnleeb..',
  '.blllllb...',
  '.bbbbbbbb..',
  'bbllllbbs..',
  'bbllllbbs..',
  'bblbblbbs..',
];

const TAIL: [number, number][] = [
  [10, 6],
  [10, 7],
  [9, 8],
  [10, 8],
  [9, 9],
];

/** The tail, its tip raised. */
const TAIL_FLICK: [number, number][] = [
  [10, 4],
  [10, 5],
  [10, 6],
  [10, 7],
  [9, 8],
  [9, 9],
];

/** Each eye's top-left, in the sprite. */
const EYES: [number, number][] = [
  [1, 3],
  [6, 3],
];

export const PUPIL = '#3b2a22';

export const CAT_COLORS = {
  b: '#a99d9b',
  l: '#c6bab5',
  s: '#857978',
  i: '#d29c9c',
  e: '#e8932c',
  n: '#de9a9a',
  tail: '#9a8e8c',
};

/**
 * Draws the cat with its top-left at (x, y). `t` is the scene's clock: it
 * blinks every few seconds and now and then flicks its tail. It looks
 * towards `look` (a point in the scene, e.g. the pointer): each pupil sits
 * in the corner of its eye on that side, both eyes the same way. With
 * nothing to look at, it glances left and right.
 */
export function drawCat(
  ctx: Ctx,
  x: number,
  y: number,
  t: number,
  look: { x: number; y: number } | null = null,
) {
  const blink = t % 4 < 0.15;
  const flick = t % 6.5 > 6;
  SPRITE.forEach((row, dy) => {
    [...row].forEach((ch, dx) => {
      if (ch === '.') return;
      let color = CAT_COLORS[ch as keyof typeof CAT_COLORS];
      // A blink: a shaded lid over the top of each eye, fur below.
      if (blink && ch === 'e') color = dy === 3 ? CAT_COLORS.s : CAT_COLORS.l;
      px(ctx, x + dx, y + dy, color);
    });
  });
  if (!blink) {
    const side = look
      ? { x: look.x >= x + 4.5 ? 1 : 0, y: look.y > y + 5 ? 1 : 0 }
      : { x: Math.floor(t / 3) % 2, y: 1 };
    for (const [ex, ey] of EYES) {
      px(ctx, x + ex + side.x, y + ey + side.y, PUPIL);
    }
  }
  for (const [dx, dy] of flick ? TAIL_FLICK : TAIL) {
    px(ctx, x + dx, y + dy, CAT_COLORS.tail);
  }
}
