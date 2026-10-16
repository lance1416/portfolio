/**
 * Research's egg, under Oxford's dates: the Radcliffe Camera in the drizzle
 * (Oxford's sky on Home drizzles too) — the lead dome and its lantern, the
 * columned drum with a few windows lit, and the cat sitting beside it on
 * the wet cobbles. Night in the dark theme, dusk in the light one.
 */
import { CAT_H, CAT_W, drawCat } from './cat';
import {
  type Box,
  type Ctx,
  layer,
  type Mood,
  type Particle,
  particle,
  px,
  rand,
  type SceneFactory,
  step,
} from './engine';
import { pointerIn } from './pointer';

export const RADCLIFFE_W = 52;
export const RADCLIFFE_H = 32;

const GROUND = 30;
const CENTRE = 24;

export const RADCLIFFE_CAT_BOX: Box = {
  x: 38,
  y: GROUND - CAT_H,
  w: CAT_W,
  h: CAT_H,
};

export const RADCLIFFE_LABEL =
  'Pixel art: the Radcliffe Camera in Oxford on a drizzly evening, with a cat sitting beside it';

interface Palette {
  sky: [string, string];
  stone: [face: string, shade: string, light: string];
  lead: [string, string];
  ground: string;
  rain: string;
}

const PALETTES: Record<Mood, Palette> = {
  night: {
    sky: ['#0b1028', '#1c2350'],
    stone: ['#8c8268', '#6a634f', '#a89c7c'],
    lead: ['#525867', '#3d424e'],
    ground: '#2a2b35',
    rain: '#a7bbe8',
  },
  // Pale, to dissolve into the light theme's off-white page.
  dusk: {
    sky: ['#f3ecec', '#f1c9b9'],
    stone: ['#cdb98a', '#ad9a6f', '#e2d0a2'],
    lead: ['#7d8496', '#646b7c'],
    ground: '#d6d0d6',
    rain: '#8e9bbd',
  },
};

const LIT = '#ffcf6e';

function rect(ctx: Ctx, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

function paint(ctx: Ctx, pal: Palette) {
  for (let y = 0; y < GROUND; y++) {
    rect(ctx, 0, y, RADCLIFFE_W, 1, y < GROUND / 2 ? pal.sky[0] : pal.sky[1]);
  }

  // The lantern on top, then the dome, shaded on its right.
  rect(ctx, CENTRE - 1, 1, 3, 3, pal.stone[2]);
  px(ctx, CENTRE, 0, pal.lead[0]);
  for (let y = 4; y < 13; y++) {
    const half = Math.round(Math.sqrt(81 - (13 - y) ** 2));
    rect(ctx, CENTRE - half, y, half * 2 + 1, 1, pal.lead[0]);
    rect(ctx, CENTRE + half - 2, y, 3, 1, pal.lead[1]);
  }

  // The balustrade, and the drum: columns with windows between, a few lit.
  rect(ctx, 13, 13, 23, 2, pal.stone[2]);
  for (let x = 14; x < 36; x += 2) px(ctx, x, 14, pal.stone[1]);
  rect(ctx, 14, 15, 21, 6, pal.stone[0]);
  for (let i = 0; i < 7; i++) {
    const x = 14 + i * 3;
    rect(ctx, x, 15, 1, 6, pal.stone[2]);
    if (i < 6) rect(ctx, x + 1, 16, 2, 3, i === 1 || i === 4 ? LIT : '#2a2a33');
  }

  // The rusticated ground storey.
  rect(ctx, 12, 21, 25, GROUND - 21, pal.stone[1]);
  for (let y = 22; y < GROUND; y += 2) rect(ctx, 12, y, 25, 1, pal.stone[0]);

  // Wet cobbles.
  rect(ctx, 0, GROUND, RADCLIFFE_W, RADCLIFFE_H - GROUND, pal.ground);
}

export const radcliffe: SceneFactory = (ctx, mood) => {
  const pal = PALETTES[mood];
  ctx.imageSmoothingEnabled = false;
  const backdrop = layer(RADCLIFFE_W, RADCLIFFE_H, (c) => paint(c, pal));
  const drops: Particle[] = Array.from({ length: 14 }, () =>
    particle(rand(0, RADCLIFFE_W + 8), rand(0, GROUND), -9, rand(26, 34), 99),
  );
  let t = 0;

  return {
    update(dt) {
      t += dt;
      step(drops, dt);
      for (const d of drops) {
        if (d.y < GROUND) continue;
        d.x = rand(0, RADCLIFFE_W + 8);
        d.y = rand(-4, 0);
      }
    },
    render() {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(backdrop, 0, 0);

      drawCat(
        ctx,
        RADCLIFFE_CAT_BOX.x,
        RADCLIFFE_CAT_BOX.y,
        t,
        pointerIn(ctx.canvas),
      );

      ctx.globalAlpha = 0.45;
      for (const d of drops) {
        px(ctx, d.x, d.y, pal.rain);
        px(ctx, d.x + 0.3, d.y - 1, pal.rain);
      }
      ctx.globalAlpha = 1;
    },
  };
};
