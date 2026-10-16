/**
 * The 404: a signpost at a crossroads, its boards pointing to the site's
 * pages (the page lays real links over them), a lantern hanging from the
 * post, and the cat sitting on top. The error page's version has snapped:
 * a stump, the post in the grass with the boards strewn about, the lantern
 * still lit on the ground, and the cat sitting on the fallen post, unbothered.
 * Night in the dark theme, dusk in the light one.
 */
import { CAT_H, CAT_W, drawCat } from './cat';
import {
  type Ctx,
  ditherRows,
  hash,
  layer,
  type Mood,
  mulberry32,
  px,
  SCENE_H,
  SCENE_W,
  type Scene,
  type SceneFactory,
} from './engine';
import { drawText, textWidth } from './pixelFont';
import { pointerIn } from './pointer';

/** A rectangle in scene pixels. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const POST_X = 95; // the post is 2px wide, from here
const POST_TOP = 38;
const GROUND = 88;
const BOARD_H = 9;
const TIP = 4; // the arrow point beyond the board

interface Sign {
  label: string;
  to: string;
  /** The page's name, for the link's accessible name. */
  name: string;
  left: boolean;
  y: number;
}

export const SIGNS: Sign[] = [
  {
    label: 'EXPERIENCE',
    name: 'Experience',
    to: '/experience',
    left: true,
    y: 44,
  },
  { label: 'PROJECTS', name: 'Projects', to: '/projects', left: false, y: 55 },
  { label: 'RESEARCH', name: 'Research', to: '/research', left: true, y: 66 },
];

/** Where each board sits, arrow point included. */
export function signBox(sign: Sign): Box {
  const w = textWidth(sign.label) + 6;
  return sign.left
    ? { x: POST_X + 2 - w - TIP, y: sign.y, w: w + TIP, h: BOARD_H }
    : { x: POST_X, y: sign.y, w: w + TIP, h: BOARD_H };
}

/** The cat, sitting on top of the post. */
export const CAT_BOX: Box = {
  x: POST_X - 3,
  y: POST_TOP - CAT_H,
  w: CAT_W,
  h: CAT_H,
};

/** Where the cat sits once the post is down. */
export const FALLEN_CAT_BOX: Box = {
  x: 60,
  y: GROUND + 6 - CAT_H,
  w: CAT_W,
  h: CAT_H,
};

/** Each board's top-left once it's fallen into the grass. */
const FALLEN_AT: Record<string, [number, number]> = {
  EXPERIENCE: [10, 99],
  PROJECTS: [126, 90],
  RESEARCH: [116, 99],
};

export const SIGNPOST_LABEL =
  'Pixel art: a signpost at a crossroads pointing to Experience, Projects and Research, with a cat sitting on top';

export const FALLEN_LABEL =
  'Pixel art: the signpost has snapped and its boards lie in the grass; a cat sits on the fallen post';

interface Palette {
  sky: string[];
  hills: string;
  grass: [string, string];
  path: [string, string];
  wood: [face: string, top: string, edge: string, text: string];
  post: [string, string];
  stars: boolean;
  lanternGlow: number;
}

const PALETTES: Record<Mood, Palette> = {
  night: {
    sky: ['#060915', '#090e20', '#0d132b', '#121937', '#171f42', '#1e264d'],
    hills: '#10162c',
    grass: ['#1d3326', '#16281e'],
    path: ['#3a3226', '#2e281e'],
    wood: ['#6b4c31', '#80603f', '#3e2a1a', '#f3dfb4'],
    post: ['#5a3f28', '#3e2a1a'],
    stars: true,
    lanternGlow: 1,
  },
  dusk: {
    sky: ['#2e2a5c', '#463871', '#694781', '#965784', '#c66d7e', '#ea9479'],
    hills: '#5a4672',
    grass: ['#6f8f4c', '#5c7a3e'],
    path: ['#b08a62', '#9a7652'],
    wood: ['#a57a4c', '#c0955f', '#6e4e2e', '#3a2616'],
    post: ['#8a6440', '#6e4e2e'],
    stars: false,
    lanternGlow: 0.45,
  },
};

function paintBackdrop(ctx: Ctx, pal: Palette, fallen: boolean) {
  ditherRows(ctx, 0, GROUND, pal.sky);

  // Far hills: a soft ridge along the horizon.
  for (let x = 0; x < SCENE_W; x++) {
    const top = Math.round(
      74 + Math.sin(x / 23) * 4 + Math.sin(x / 9 + 1) * 1.5,
    );
    for (let y = top; y < GROUND; y++) px(ctx, x, y, pal.hills);
  }

  // Ground, with a path forking left and right at the post.
  for (let y = GROUND; y < SCENE_H; y++) {
    for (let x = 0; x < SCENE_W; x++) {
      const depth = y - GROUND;
      const trunk = Math.abs(x - (POST_X + 1)) < 6 + depth * 1.4;
      const fork = depth < 4 && Math.abs(y - (GROUND + 2)) < 2;
      let color = hash(x >> 1, y, 3) > 0.8 ? pal.grass[1] : pal.grass[0];
      if (trunk || fork)
        color = hash(x, y, 5) > 0.75 ? pal.path[1] : pal.path[0];
      px(ctx, x, y, color);
    }
  }

  // The post, shaded on its left; or its stump, and the rest in the grass.
  for (let y = fallen ? GROUND - 5 : POST_TOP; y < GROUND + 1; y++) {
    px(ctx, POST_X, y, pal.post[1]);
    px(ctx, POST_X + 1, y, pal.post[0]);
  }
  if (fallen) {
    px(ctx, POST_X + 1, GROUND - 6, pal.post[0]);
    for (let x = 46; x < 93; x++) {
      px(ctx, x, GROUND + 6, pal.post[0]);
      px(ctx, x, GROUND + 7, pal.post[1]);
    }
  }

  for (const sign of SIGNS) {
    const standing = signBox(sign);
    const [fx, fy] = FALLEN_AT[sign.label];
    const b = fallen ? { ...standing, x: fx, y: fy } : standing;
    const body = sign.left
      ? { x: b.x + TIP, w: b.w - TIP }
      : { x: b.x, w: b.w - TIP };
    for (let y = 0; y < BOARD_H; y++) {
      for (let x = 0; x < body.w; x++) {
        let color = pal.wood[0];
        if (y === 0) color = pal.wood[1];
        if (y === BOARD_H - 1) color = pal.wood[2];
        px(ctx, body.x + x, b.y + y, color);
      }
      // The arrow point: a triangle off the free end.
      const reach =
        TIP - Math.abs(y - (BOARD_H - 1) / 2) * (TIP / ((BOARD_H - 1) / 2));
      for (let k = 0; k < Math.round(reach); k++) {
        const x = sign.left ? body.x - 1 - k : body.x + body.w + k;
        px(ctx, x, b.y + y, y === BOARD_H - 1 ? pal.wood[2] : pal.wood[0]);
      }
    }
    drawText(ctx, sign.label, body.x + 3, b.y + 2, pal.wood[3]);
  }
}

function createSignpost(ctx: Ctx, mood: Mood, fallen: boolean): Scene {
  const pal = PALETTES[mood];
  const lantern = fallen
    ? { x: POST_X + 5, y: GROUND + 2 }
    : { x: POST_X + 2, y: 77 };
  const cat = fallen ? FALLEN_CAT_BOX : CAT_BOX;
  ctx.imageSmoothingEnabled = false;
  const backdrop = layer(SCENE_W, SCENE_H, (c) =>
    paintBackdrop(c, pal, fallen),
  );
  const rng = mulberry32(404);
  const stars = Array.from({ length: pal.stars ? 40 : 0 }, () => ({
    x: Math.floor(rng() * SCENE_W),
    y: Math.floor(rng() * 64),
    phase: rng() * 6.28,
  }));
  let t = 0;

  return {
    update(dt) {
      t += dt;
    },
    render() {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(backdrop, 0, 0);
      for (const s of stars) {
        ctx.globalAlpha = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + s.phase));
        px(ctx, s.x, s.y, '#dfe6ff');
      }

      // The lantern on its hook (or on its side in the grass), and its
      // light on the post and path.
      ctx.globalAlpha = 1;
      if (!fallen) px(ctx, lantern.x, lantern.y - 1, pal.post[1]);
      const [w, h] = fallen ? [3, 2] : [2, 3];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          px(
            ctx,
            lantern.x + x,
            lantern.y + y,
            x + y === 1 ? '#fff1c4' : '#ffcf6e',
          );
        }
      }
      const flicker = 1 + Math.sin(t * 7) * 0.04 + Math.sin(t * 17) * 0.03;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = pal.lanternGlow;
      const glow = ctx.createRadialGradient(
        lantern.x + 1,
        lantern.y + 1,
        1,
        lantern.x + 1,
        lantern.y + 1,
        26 * flicker,
      );
      glow.addColorStop(0, 'rgba(255, 190, 90, 0.35)');
      glow.addColorStop(1, 'rgba(255, 150, 60, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(lantern.x - 30, lantern.y - 30, 62, 62);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      drawCat(ctx, cat.x, cat.y, t, pointerIn(ctx.canvas));
    },
  };
}

export const signpost: SceneFactory = (ctx, mood) =>
  createSignpost(ctx, mood, false);

export const fallenSignpost: SceneFactory = (ctx, mood) =>
  createSignpost(ctx, mood, true);
