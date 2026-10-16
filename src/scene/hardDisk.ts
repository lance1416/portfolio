/**
 * KidneyOS's egg, beside its skills: a hard disk with its lid off — the
 * platter spinning, the arm seeking from track to track and the activity
 * light blinking while it reads — and Ferris, Rust's crab, snapping its
 * claws beside it. A clear background, so it sits on the project card.
 */
import { px, type SceneFactory } from './engine';

export const DISK_W = 38;
export const DISK_H = 16;

export const DISK_LABEL =
  'Pixel art: a hard disk seeking from track to track while Ferris the crab snaps its claws';

const CASE = { fill: '#71717a', edge: '#3f3f46' };
const PLATTER = ['#e4e4e7', '#a1a1aa'];
const ARM = '#27272a';
const LED = { on: '#4ade80', off: '#14532d' };

const C = { x: 7.5, y: 7.5 }; // the spindle
const R = 5.5; // the platter's radius
const PIVOT = { x: 13, y: 13 };
const ARM_LEN = 9;

// Ferris, front on: claws up, eyes on top. `o` shell, `s` its shade, `e` eyes.
const FERRIS = {
  open: [
    'o.o.......o.o',
    '.oo..e.e..oo.',
    '..o.ooooo.o..',
    '...ooooooo...',
    '..ossssssso..',
    '..o.o...o.o..',
  ],
  shut: [
    '.oo.......oo.',
    '.oo..e.e..oo.',
    '..o.ooooo.o..',
    '...ooooooo...',
    '..ossssssso..',
    '..o.o...o.o..',
  ],
};
const FERRIS_COLORS = { o: '#f74c00', s: '#c43c00', e: '#18181b' };

/** The arm's angle that puts its head `r` from the spindle. */
function armAngle(r: number) {
  // The head is ARM_LEN from the pivot and `r` from the spindle: solve the
  // triangle pivot–spindle–head for its angle at the pivot.
  const dx = C.x - PIVOT.x;
  const dy = C.y - PIVOT.y;
  const d = Math.hypot(dx, dy);
  const cos = (ARM_LEN ** 2 + d ** 2 - r ** 2) / (2 * ARM_LEN * d);
  return Math.atan2(dy, dx) + Math.acos(Math.min(1, Math.max(-1, cos)));
}

export const hardDisk: SceneFactory = (ctx) => {
  let t = 0;
  let spin = 0;
  let track = 3;
  let from = 3;
  let seekAt = 0;
  return {
    update(dt) {
      t += dt;
      spin += dt * 9;
      // A new track every 1.2 s: a quarter second to get there, then it reads.
      if (t - seekAt > 1.2) {
        seekAt = t;
        from = track;
        track = 1.5 + Math.random() * 3.5;
      }
    },
    render() {
      ctx.clearRect(0, 0, DISK_W, DISK_H);

      // The case, corners clipped.
      ctx.fillStyle = CASE.edge;
      ctx.fillRect(1, 0, 14, 16);
      ctx.fillRect(0, 1, 16, 14);
      ctx.fillStyle = CASE.fill;
      ctx.fillRect(1, 1, 14, 14);

      // The platter: a disc with a darker rim, and a glint going round.
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const r = Math.hypot(x + 0.5 - C.x, y + 0.5 - C.y);
          if (r <= R) px(ctx, x, y, r > R - 1 ? PLATTER[1] : PLATTER[0]);
        }
      }
      for (const k of [2, 3.5]) {
        px(
          ctx,
          C.x + Math.cos(spin) * k - 0.5,
          C.y + Math.sin(spin) * k - 0.5,
          PLATTER[1],
        );
      }
      px(ctx, 7, 7, CASE.edge);

      // The arm, from its pivot to the head over the current track.
      const seek = Math.min(1, (t - seekAt) / 0.25);
      const r = from + (track - from) * seek * seek * (3 - 2 * seek);
      const a = armAngle(r);
      for (let i = 0; i <= ARM_LEN; i++) {
        px(
          ctx,
          PIVOT.x + Math.cos(a) * i - 0.5,
          PIVOT.y + Math.sin(a) * i - 0.5,
          ARM,
        );
      }
      px(ctx, PIVOT.x - 1, PIVOT.y - 1, CASE.edge);

      // Lit while it reads, between seeks.
      const reading = seek >= 1 && Math.floor(t * 12) % 3 !== 0;
      px(ctx, 2, 14, reading ? LED.on : LED.off);

      // Ferris: a snap of the claws now and then, and a sidestep.
      const snap = t % 2.4 < 0.6 && Math.floor(t * 8) % 2 === 1;
      const sprite = snap ? FERRIS.shut : FERRIS.open;
      const left = 22 + Math.round(Math.sin(t * 0.9) * 1.5);
      const top = DISK_H - sprite.length;
      sprite.forEach((row, dy) => {
        [...row].forEach((ch, dx) => {
          if (ch !== '.')
            px(ctx, left + dx, top + dy, FERRIS_COLORS[ch as 'o' | 's' | 'e']);
        });
      });
    },
  };
};
