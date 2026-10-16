/**
 * Experience's egg, in the rail of the role that's still going: a desk late
 * at night (dusk in the light theme). A window with the sky outside, a desk
 * lamp, a steaming mug, a monitor showing a multiple-choice question in
 * IQBank's blue — the highlighted answer moves now and then, as if someone
 * were working through it — and the cat sitting on the desk.
 */
import { CAT_H, CAT_W, drawCat } from './cat';
import {
  type Box,
  type Ctx,
  layer,
  type Mood,
  px,
  type SceneFactory,
} from './engine';
import { pointerIn } from './pointer';

export const DESK_W = 48;
export const DESK_H = 32;

const DESK_TOP = 23;
const IQBANK = '#3b5fb2';

export const DESK_CAT_BOX: Box = {
  x: 36,
  y: DESK_TOP - CAT_H,
  w: CAT_W,
  h: CAT_H,
};

export const DESK_LABEL =
  'Pixel art: a desk late at night, a quiz on the monitor, a lamp, a mug, and a cat sitting beside it';

interface Palette {
  wall: string;
  frame: string;
  sky: [string, string];
  stars: boolean;
  screen: string;
  lampGlow: number;
}

const PALETTES: Record<Mood, Palette> = {
  night: {
    wall: '#1b1e31',
    frame: '#2c3150',
    sky: ['#0a0f26', '#141a3a'],
    stars: true,
    screen: '#d5dbec',
    lampGlow: 1,
  },
  dusk: {
    wall: '#4a4062',
    frame: '#5d5278',
    sky: ['#c66d7e', '#ee9a78'],
    stars: false,
    screen: '#e8ecf6',
    lampGlow: 0.5,
  },
};

function rect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function paintRoom(ctx: Ctx, pal: Palette) {
  rect(ctx, 0, 0, DESK_W, DESK_TOP, pal.wall);

  // The window, with its sky.
  rect(ctx, 2, 2, 14, 10, pal.frame);
  for (let y = 3; y < 11; y++) {
    rect(ctx, 3, y, 12, 1, y < 7 ? pal.sky[0] : pal.sky[1]);
  }
  rect(ctx, 8, 3, 1, 8, pal.frame);
  if (pal.stars) {
    for (const [x, y] of [
      [4, 4],
      [11, 5],
      [6, 8],
      [13, 9],
    ]) {
      px(ctx, x, y, '#dfe6ff');
    }
    // A crescent moon.
    rect(ctx, 11, 3, 2, 2, '#ecebdc');
    px(ctx, 12, 3, pal.sky[0]);
  }

  // The desk: a lit top edge, then its front with a drawer.
  rect(ctx, 0, DESK_TOP, DESK_W, 1, '#a57a4c');
  rect(ctx, 0, DESK_TOP + 1, DESK_W, 1, '#8a6440');
  rect(ctx, 0, DESK_TOP + 2, DESK_W, DESK_H - DESK_TOP - 2, '#5c4129');
  rect(ctx, 18, DESK_TOP + 4, 12, 1, '#4a3420');
  px(ctx, 23, DESK_TOP + 5, '#a57a4c');

  // The monitor: bezel, stand and foot.
  rect(ctx, 18, 9, 16, 12, '#202028');
  rect(ctx, 25, 21, 2, 1, '#2c2c36');
  rect(ctx, 23, 22, 6, 1, '#2c2c36');

  // The lamp: a base, an arm, a shade.
  rect(ctx, 3, 21, 5, 2, '#3a3a44');
  for (let y = 15; y < 21; y++) px(ctx, 5, y, '#4a4a55');
  px(ctx, 6, 14, '#4a4a55');
  rect(ctx, 6, 12, 5, 2, '#e0b04a');
  rect(ctx, 7, 14, 3, 1, '#fff1c4');

  // The mug.
  rect(ctx, 13, 20, 3, 3, '#e8e1d6');
  px(ctx, 16, 21, '#e8e1d6');
}

export const lateDesk: SceneFactory = (ctx, mood) => {
  const pal = PALETTES[mood];
  ctx.imageSmoothingEnabled = false;
  const room = layer(DESK_W, DESK_H, (c) => paintRoom(c, pal));
  let t = 0;

  function screen() {
    rect(ctx, 19, 10, 14, 10, pal.screen);
    rect(ctx, 19, 10, 14, 1, IQBANK);
    rect(ctx, 20, 12, 10, 1, '#8a93a8');
    // Three answers; the chosen one moves every few seconds.
    const chosen = Math.floor(t / 3) % 3;
    for (let i = 0; i < 3; i++) {
      const y = 14 + i * 2;
      px(ctx, 20, y, i === chosen ? IQBANK : '#8a93a8');
      rect(
        ctx,
        22,
        y,
        i === 1 ? 6 : 8,
        1,
        i === chosen ? '#5b6b8b' : '#b4bccd',
      );
    }
    // A blinking cursor after the question.
    if (Math.floor(t * 2) % 2) px(ctx, 31, 12, '#3b3f4a');
  }

  function glow(x: number, y: number, r: number, color: string, alpha: number) {
    const g = ctx.createRadialGradient(x, y, 0.5, x, y, r);
    g.addColorStop(0, `rgba(${color}, ${alpha})`);
    g.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  return {
    update(dt) {
      t += dt;
    },
    render() {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(room, 0, 0);
      screen();

      // The mug's steam: two wisps, swaying as they rise.
      for (const offset of [0, 0.9]) {
        const k = ((t * 0.6 + offset) % 1.8) / 1.8;
        ctx.globalAlpha = 0.5 * (1 - k);
        px(
          ctx,
          14 + Math.round(Math.sin(t * 2 + offset * 3) * 0.8),
          19 - k * 5,
          '#c9c9d4',
        );
      }
      ctx.globalAlpha = 1;

      // Lamplight and screen light.
      ctx.globalCompositeOperation = 'lighter';
      glow(8.5, 16, 17, '255, 190, 100', 0.28 * pal.lampGlow);
      glow(26, 15, 16, '150, 175, 255', 0.1);
      ctx.globalCompositeOperation = 'source-over';

      drawCat(ctx, DESK_CAT_BOX.x, DESK_CAT_BOX.y, t, pointerIn(ctx.canvas));
    },
  };
};
