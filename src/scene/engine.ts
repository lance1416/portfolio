/**
 * The shared pieces of the site's pixel scenes. Every scene draws on a
 * 192×108 canvas scaled up by CSS (`image-rendering: pixelated`), so one
 * canvas pixel is one "pixel" of the art. Static parts are painted once into
 * offscreen layers; each frame composites them and draws particles.
 */

export const SCENE_W = 192;
export const SCENE_H = 108;

export type Ctx = CanvasRenderingContext2D;

/** `night` in the dark theme, `dusk` in the light one. */
export type Mood = 'night' | 'dusk';

export interface Scene {
  update(dt: number): void;
  render(): void;
}

/** A rectangle in scene pixels (e.g. where the cat sits). */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Builds a scene; `<PixelScene>` calls it again when the theme changes. */
export type SceneFactory = (ctx: Ctx, mood: Mood) => Scene;

/** Seeded noise, so static art looks the same on every load. */
export function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable hash noise in [0, 1) for per-frame shimmer. */
export function hash(x: number, y: number, z: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

export const rand = (min: number, max: number) =>
  min + Math.random() * (max - min);

/** An offscreen canvas, painted once by `draw`. */
export function layer(w: number, h: number, draw: (ctx: Ctx) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx);
  return canvas;
}

export function px(ctx: Ctx, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

const BAYER = [0, 0.5, 0.75, 0.25];

/** A vertical gradient through `colors` over rows y0…y1, 2×2-dithered. */
export function ditherRows(ctx: Ctx, y0: number, y1: number, colors: string[]) {
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < SCENE_W; x++) {
      const v =
        ((y - y0) / (y1 - y0)) * (colors.length - 1) +
        BAYER[(x & 1) + (y & 1) * 2];
      px(ctx, x, y, colors[Math.min(colors.length - 1, Math.floor(v))]);
    }
  }
}

// ─── Particles ───────────────────────────────────────────────────────────────

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
}

export const particle = (
  x: number,
  y: number,
  vx: number,
  vy: number,
  life: number,
): Particle => ({ x, y, vx, vy, age: 0, life });

/** Ages and moves every particle, dropping the ones past their life. */
export function step(list: Particle[], dt: number, gravity = 0) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.age += dt;
    if (p.age >= p.life) {
      list.splice(i, 1);
      continue;
    }
    p.vy += gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
}

/** Calls `make` `rate` times a second, carrying fractional calls over. */
export function emitter() {
  let debt = 0;
  return (rate: number, dt: number, make: () => void) => {
    debt += rate * dt;
    while (debt >= 1) {
      debt -= 1;
      make();
    }
  };
}

/** Runs a scene for a while before its first frame, so it starts mid-scene. */
export function prewarm(scene: Scene, seconds: number) {
  for (let i = 0; i < seconds * 60; i++) scene.update(1 / 60);
}
