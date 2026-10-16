/**
 * Research's second scene, under Toronto's dates: University College on a
 * snowy evening — the Norman tower between its two wings, a few windows lit,
 * snow on the front lawn and more coming down, and now and then one of the
 * campus's black squirrels dashing across. Night in the dark theme, a pale
 * winter dusk in the light one (pale, to fade into the page).
 */
import {
  type Ctx,
  gradientRows,
  layer,
  type Mood,
  type Particle,
  particle,
  px,
  rand,
  type SceneFactory,
  step,
} from './engine';

export const UC_W = 52;
export const UC_H = 32;

export const UC_LABEL =
  'Pixel art: University College in Toronto on a snowy evening, a black squirrel running across the lawn';

const GROUND = 27;
const CENTRE = 26;

interface Palette {
  sky: string[];
  stone: [face: string, shade: string, light: string];
  roof: string;
  window: string;
  snow: [ground: string, shade: string, falling: string];
}

const PALETTES: Record<Mood, Palette> = {
  night: {
    sky: ['#0b1028', '#1c2350'],
    stone: ['#8f8470', '#6b6252', '#ab9f86'],
    roof: '#3a3f4c',
    window: '#2a2a33',
    snow: ['#8d97b3', '#6f7a98', '#dfe6ff'],
  },
  // Pale, to fade into the light theme's off-white page.
  dusk: {
    sky: ['#f2eef1', '#e7d9dc'],
    stone: ['#c9b48e', '#a8946f', '#ddcba6'],
    roof: '#7b8292',
    window: '#6a6470',
    snow: ['#f4f6fa', '#d9dee8', '#a9b4cc'],
  },
};

const LIT = '#ffcf6e';

function rect(ctx: Ctx, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

function paint(ctx: Ctx, pal: Palette, night: boolean) {
  gradientRows(ctx, 0, GROUND, pal.sky);

  // The two wings, with slate roofs and a row of arched windows.
  for (const [x0, x1] of [
    [6, 21],
    [31, 46],
  ]) {
    rect(ctx, x0, 15, x1 - x0, GROUND - 15, pal.stone[0]);
    rect(ctx, x0, 13, x1 - x0, 2, pal.roof);
    rect(ctx, x0, 15, x1 - x0, 1, pal.stone[2]);
    for (let x = x0 + 2; x < x1 - 1; x += 3) {
      const lit = night && (x * 7) % 5 === 1;
      rect(ctx, x, 18, 1, 2, lit ? LIT : pal.window);
      rect(ctx, x, 22, 1, 2, pal.window);
    }
  }

  // The Norman tower: a low pyramid roof between corner turrets, each with
  // its own little cap, and an arched door.
  rect(ctx, CENTRE - 5, 7, 10, GROUND - 7, pal.stone[0]);
  rect(ctx, CENTRE + 3, 7, 2, GROUND - 7, pal.stone[1]);
  rect(ctx, CENTRE - 5, 7, 10, 1, pal.stone[2]);
  for (let k = 0; k < 4; k++) {
    rect(ctx, CENTRE - 1 - k, 3 + k, 2 + 2 * k, 1, pal.roof);
  }
  for (const x of [CENTRE - 6, CENTRE + 4]) {
    rect(ctx, x, 5, 2, 4, pal.stone[2]);
    rect(ctx, x, 4, 2, 1, pal.roof);
    px(ctx, x, 3, pal.roof);
  }
  rect(ctx, CENTRE - 1, 10, 2, 3, night ? LIT : pal.window);
  rect(ctx, CENTRE - 2, 21, 4, GROUND - 21, pal.window);
  px(ctx, CENTRE - 2, 21, pal.stone[0]);
  px(ctx, CENTRE + 1, 21, pal.stone[0]);

  // Snow along the roofs and over the lawn.
  rect(ctx, 6, 13, 15, 1, pal.snow[0]);
  rect(ctx, 31, 13, 15, 1, pal.snow[0]);
  rect(ctx, 0, GROUND, UC_W, UC_H - GROUND, pal.snow[0]);
  rect(ctx, 0, GROUND, UC_W, 1, pal.snow[1]);
}

/** The squirrel, two frames of a bounding run: its tail curled up behind. */
const SQUIRREL = [
  ['.kk...', 'k..bb.', 'k.bbbb', 'kbbbb.', '.b..b.'],
  ['.kk...', 'k..bb.', 'k.bbbb', 'kbbbb.', 'b...b.'],
];

export const universityCollege: SceneFactory = (ctx, mood) => {
  const pal = PALETTES[mood];
  ctx.imageSmoothingEnabled = false;
  const backdrop = layer(UC_W, UC_H, (c) => paint(c, pal, mood === 'night'));
  // Sparse snow: a few flakes, not a curtain.
  const flakes: Particle[] = Array.from({ length: 12 }, () =>
    particle(rand(0, UC_W), rand(0, GROUND), 0, rand(5, 8), 99),
  );
  let t = 0;

  return {
    update(dt) {
      t += dt;
      step(flakes, dt);
      for (const f of flakes) {
        if (f.y < GROUND) continue;
        f.x = rand(0, UC_W);
        f.y = -1;
        f.age = 0;
      }
    },
    render() {
      ctx.globalAlpha = 1;
      ctx.drawImage(backdrop, 0, 0);

      for (const [i, f] of flakes.entries()) {
        ctx.globalAlpha = 0.85;
        px(ctx, f.x + Math.sin(t * 1.3 + i) * 1.2, f.y, pal.snow[2]);
      }
      ctx.globalAlpha = 1;

      // A dash across the lawn every eight seconds, two seconds long.
      const k = (t % 8) / 2;
      if (k < 1) {
        const x = -6 + k * (UC_W + 10);
        const frame = SQUIRREL[Math.floor(t * 10) % 2];
        const hop = Math.floor(t * 10) % 2;
        frame.forEach((row, dy) => {
          [...row].forEach((ch, dx) => {
            if (ch !== '.') px(ctx, x + dx, GROUND - 1 + dy - hop, '#17151a');
          });
        });
      }
    },
  };
};
