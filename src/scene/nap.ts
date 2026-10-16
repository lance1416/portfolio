/**
 * The cat asleep, curled into a loaf with its tail wrapped round the front,
 * z's drifting up. Once every hiding place is found it naps on the dock (or
 * the footer); petting it (`wake`) opens its eyes for a moment.
 */
import { CAT_COLORS } from './cat';
import { px, type SceneFactory } from './engine';

export const NAP_W = 17;
export const NAP_H = 14;

// `b` body, `l` pale face and chest, `s` shade (and closed eyes), `i` inside
// the ears, `n` nose, `t` tail; `e` marks where open eyes go.
const SPRITE = [
  '.bi...ib.....',
  '.bbbbbbb.....',
  'blllllllbbbb.',
  'beellleebbbbb',
  'blllnlllbbbbb',
  '.blllllbbbbbs',
  'ttttttbbbbbs.',
  '.bbbbbbbbbs..',
];

const Z = ['####', '..#.', '.#..', '####'];

let wokeAt = Number.NEGATIVE_INFINITY;

/** Opens the cat's eyes for a couple of seconds. */
export function wake() {
  wokeAt = performance.now();
}

export const nap: SceneFactory = (ctx) => {
  let t = 0;
  return {
    update(dt) {
      t += dt;
    },
    render() {
      ctx.clearRect(0, 0, NAP_W, NAP_H);
      const awake = performance.now() - wokeAt < 2500;
      const top = NAP_H - SPRITE.length;
      SPRITE.forEach((row, dy) => {
        [...row].forEach((ch, dx) => {
          if (ch === '.') return;
          let color =
            CAT_COLORS[ch as keyof typeof CAT_COLORS] ?? CAT_COLORS.tail;
          if (ch === 'e') color = awake ? CAT_COLORS.e : CAT_COLORS.s;
          px(ctx, dx, top + dy, color);
        });
      });
      if (awake) return;
      // A "z" drifting up from its head and fading, one every 2.4 s.
      const k = (t % 2.4) / 2.4;
      ctx.globalAlpha = 1 - k;
      const zx = 10 + Math.round(k * 3);
      const zy = top - 4 - Math.round(k * 2);
      Z.forEach((row, dy) => {
        [...row].forEach((bit, dx) => {
          if (bit === '#') px(ctx, zx + dx, zy + dy, CAT_COLORS.s);
        });
      });
      ctx.globalAlpha = 1;
    },
  };
};
