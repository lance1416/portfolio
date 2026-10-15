/**
 * The floating island: a tent, two pines and a campfire above the sea, in
 * the rain. Two moods (`night`: moon and stars; `dusk`: a low sun, for the
 * light theme) and two states: the camp (404, terminal `campfire`), and
 * broken (the error page) — split along a crack, the fire out and smoking,
 * stones dropping into the sea.
 */
import {
  type Ctx,
  ditherRows,
  emitter,
  hash,
  layer,
  type Mood,
  mulberry32,
  type Particle,
  particle,
  prewarm,
  px,
  rand,
  SCENE_H,
  SCENE_W,
  type Scene,
  type SceneFactory,
  step,
} from './engine';

const SEA_Y = 94;
const WIND = 0.28; // rain slant: px left per px fallen

// Island sprite, and where it sits in the scene (before bobbing).
const ISLAND_W = 84;
const ISLAND_H = 50;
const ISLAND_TOP = 16; // sprite row of the grass line at the centre
const ISLAND_X = 54;
const ISLAND_Y = 34;
const FIRE_COL = 44;
const TENT_COL = 61;

// Broken: everything right of a jagged crack slumps down and away.
const CRACK = 53;
const CHUNK_DX = 3;
const CHUNK_DY = 6;
const cutAt = (y: number) => CRACK + Math.round(Math.sin(y * 0.9) * 1.5);

interface Palette {
  sky: string[]; // top → horizon
  body: {
    x: number;
    y: number;
    r: number;
    lit: string;
    shade: string;
    /** A moon is shaded on its left; a setting sun underneath. */
    moon: boolean;
  };
  halo: string; // rgb triple for the glow around the moon/sun
  haloAlpha: number;
  sea: { base: string; band: string; horizon: string };
  glint: string; // the moon/sun's reflection
  star: string;
  stars: number; // how many of the stars show
  cloud: { lit: string; shade: string };
  rain: string;
  rainAlpha: [far: number, near: number];
  splash: string;
  ripple: string;
  grass: [lit: string, shade: string, under: string];
  dirt: [main: string, dark: string];
  rock: [a: string, b: string, speck: string, base: string];
  rim: [lit: string, dark: string];
  crack: [dark: string, fresh: string];
  pine: [lit: string, mid: string, dark: string];
  trunk: string;
  tent: [lit: string, shade: string, edge: string, door: string];
  fireLight: number;
  smoke: string;
}

const PALETTES: Record<Mood, Palette> = {
  night: {
    sky: ['#060915', '#090e20', '#0d132b', '#121937', '#171f42', '#1e264d'],
    body: { x: 150, y: 20, r: 7, lit: '#ecebdc', shade: '#bcbba9', moon: true },
    halo: '190, 205, 255',
    haloAlpha: 0.22,
    sea: { base: '#0a1026', band: '#111a36', horizon: '#16204a' },
    glint: '#c9cde0',
    star: '#dfe6ff',
    stars: 46,
    cloud: { lit: '#36406b', shade: '#1d2446' },
    rain: '#a7bbe8',
    rainAlpha: [0.28, 0.6],
    splash: '#b9c9ee',
    ripple: '#7f92c4',
    grass: ['#73a05e', '#557f48', '#3f6638'],
    dirt: ['#5a3d2b', '#3f2a1e'],
    rock: ['#3e3747', '#332d3c', '#4a4355', '#26212d'],
    rim: ['#6d6683', '#1c1822'],
    crack: ['#15121a', '#5a5470'],
    pine: ['#3e6c50', '#1f3d2c', '#14281d'],
    trunk: '#3b2a1f',
    tent: ['#9c7b57', '#7a5a3c', '#5c4129', '#24180f'],
    fireLight: 1,
    smoke: '#59607a',
  },
  dusk: {
    sky: ['#2e2a5c', '#463871', '#694781', '#965784', '#c66d7e', '#ea9479'],
    body: {
      x: 160,
      y: 74,
      r: 9,
      lit: '#ffe6b0',
      shade: '#ffc27a',
      moon: false,
    },
    halo: '255, 190, 120',
    haloAlpha: 0.4,
    sea: { base: '#3a3563', band: '#4b4479', horizon: '#ee9f86' },
    glint: '#ffd9a0',
    star: '#fff3e0',
    stars: 10,
    cloud: { lit: '#f6b59a', shade: '#8d5f86' },
    rain: '#f1ecff',
    rainAlpha: [0.2, 0.42],
    splash: '#ffffff',
    ripple: '#c4b2de',
    grass: ['#9ccf6a', '#6f9e4c', '#4f7a3a'],
    dirt: ['#7a5236', '#5e3e28'],
    rock: ['#6b5a72', '#5c4d65', '#7d6b85', '#463a50'],
    rim: ['#e3a37f', '#3a2f45'],
    crack: ['#2a2033', '#9c8aa6'],
    pine: ['#6a9a5a', '#3c6448', '#2b4a36'],
    trunk: '#5a3e2a',
    tent: ['#d6a571', '#a87c52', '#7a5a3c', '#3a2818'],
    fireLight: 0.55,
    smoke: '#8a8098',
  },
};

const FLAME = ['#fff4b8', '#ffc53d', '#ff7a1a', '#c8361a'];

// ─── Static layers ───────────────────────────────────────────────────────────

function paintBackdrop(ctx: Ctx, pal: Palette) {
  ditherRows(ctx, 0, SEA_Y, pal.sky);

  // The moon or the sun, haloed.
  const { x: bx, y: by, r } = pal.body;
  const halo = ctx.createRadialGradient(bx, by, 2, bx, by, r * 5);
  halo.addColorStop(0, `rgba(${pal.halo}, ${pal.haloAlpha})`);
  halo.addColorStop(1, `rgba(${pal.halo}, 0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, SCENE_W, SEA_Y);
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r * r + 2 || by + y >= SEA_Y) continue;
      const shade = pal.body.moon
        ? (x + 3) ** 2 + (y + 1) ** 2 > 52
        : y > r / 3;
      px(ctx, bx + x, by + y, shade ? pal.body.shade : pal.body.lit);
    }
  }

  for (let y = SEA_Y; y < SCENE_H; y++) {
    for (let x = 0; x < SCENE_W; x++) {
      const band = (y - SEA_Y) % 3 === 0 && hash(x >> 2, y, 1) > 0.4;
      let color = band ? pal.sea.band : pal.sea.base;
      if (y === SEA_Y) color = pal.sea.horizon;
      px(ctx, x, y, color);
    }
  }
}

interface Island {
  main: HTMLCanvasElement;
  /** The slumped piece right of the crack; empty unless broken. */
  chunk: HTMLCanvasElement;
  /** Sprite row of the grass line, per column. */
  top: number[];
  bottom: number[];
}

function buildIsland(pal: Palette, broken: boolean): Island {
  const rng = mulberry32(1416);
  const top: number[] = [];
  const bottom: number[] = [];
  let jag = 0;
  for (let c = 0; c < ISLAND_W; c++) {
    const u = (c - (ISLAND_W - 1) / 2) / ((ISLAND_W - 1) / 2);
    top.push(ISLAND_TOP + Math.round(Math.abs(u) ** 5 * 4));
    jag = jag * 0.6 + (rng() - 0.5) * 5;
    const depth = (1 - u * u) ** 0.9 * 26 + jag;
    bottom.push(top[c] + 3 + Math.max(0, Math.round(depth)));
  }

  // Paint into a grid first, so both halves of a broken island share it.
  const grid: (string | undefined)[][] = Array.from({ length: ISLAND_H }, () =>
    Array(ISLAND_W),
  );
  const set = (c: number, y: number, color: string) => {
    if (c >= 0 && c < ISLAND_W && y >= 0 && y < ISLAND_H) grid[y][c] = color;
  };
  const solid = (c: number, y: number) =>
    c >= 0 && c < ISLAND_W && y >= top[c] && y <= bottom[c];

  for (let c = 0; c < ISLAND_W; c++) {
    const u = (c - (ISLAND_W - 1) / 2) / ((ISLAND_W - 1) / 2);
    for (let y = top[c]; y <= bottom[c]; y++) {
      const r = y - top[c];
      let color: string;
      if (r === 0) color = u > -0.2 ? pal.grass[0] : pal.grass[1];
      else if (r === 1) color = pal.grass[2];
      else if (r === 2) color = rng() < 0.5 ? pal.grass[2] : pal.dirt[0];
      else if (r < 6) color = rng() < 0.15 ? pal.dirt[1] : pal.dirt[0];
      else if (y > bottom[c] - 3) color = pal.rock[3];
      else {
        const band = Math.floor((y + Math.round(u * 4)) / 3) % 2;
        color = band ? pal.rock[0] : pal.rock[1];
        if (rng() < 0.06) color = pal.rock[2];
      }
      // Light from the upper right rims the right-hand edge.
      if (r > 2 && !solid(c + 1, y)) color = pal.rim[0];
      else if (r > 2 && !solid(c - 1, y)) color = pal.rim[1];
      set(c, y, color);
    }
  }

  // Roots hanging from the underside.
  for (const c of [20, 31, 47, 58, 66]) {
    const len = 2 + Math.floor(rng() * 4);
    for (let i = 1; i <= len; i++) {
      set(c + (i > 2 ? 1 : 0), bottom[c] + i, pal.trunk);
    }
  }

  // Two pines, lit on the right.
  const pine = (c: number, rows: number[]) => {
    const base = top[c] - 1;
    set(c, base, pal.trunk);
    set(c, base - 1, pal.trunk);
    rows.forEach((half, k) => {
      const y = base - 1 - rows.length + k;
      for (let dx = -half; dx <= half; dx++) {
        let color = pal.pine[1];
        if (dx === half) color = pal.pine[0];
        else if (dx === -half) color = pal.pine[2];
        set(c + dx, y, color);
      }
    });
  };
  pine(15, [0, 1, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4]);
  pine(23, [0, 1, 1, 2, 1, 2, 3]);

  // The tent, door facing the fire — or, once broken, collapsed in a heap
  // with one pole sticking out.
  const tentBase = top[TENT_COL] - 1;
  if (broken) {
    for (let k = 0; k < 3; k++) {
      for (let dx = -2 * k - 1; dx <= 2 * k + 1; dx++) {
        set(
          TENT_COL + dx,
          tentBase - 2 + k,
          dx > 0 ? pal.tent[0] : pal.tent[1],
        );
      }
    }
    set(TENT_COL + 2, tentBase - 3, pal.tent[2]);
    set(TENT_COL + 3, tentBase - 4, pal.tent[2]);
  } else {
    for (let k = 0; k < 7; k++) {
      const half = Math.round((k * 5) / 6);
      for (let dx = -half; dx <= half; dx++) {
        let color = dx > 0 ? pal.tent[0] : pal.tent[1];
        if (dx === -half || dx === half) color = pal.tent[2];
        if (dx === 0 && k > 2) color = pal.tent[3];
        set(TENT_COL + dx, tentBase - 6 + k, color);
      }
    }
  }

  // Fire pit: a ring of stones around crossed logs (charred once it's out).
  const fy = top[FIRE_COL] - 1;
  for (const dx of [-4, 4]) set(FIRE_COL + dx, fy, '#6d6d78');
  for (const dx of [-3, 3]) set(FIRE_COL + dx, fy, '#4f4f5a');
  for (const dx of [-2, -1, 0, 1, 2]) {
    const log = dx % 2 ? '#3a2416' : '#5b3a22';
    set(FIRE_COL + dx, fy, broken ? '#2a1a12' : log);
  }

  const paint = (half: 'main' | 'chunk') =>
    layer(ISLAND_W, ISLAND_H, (ctx) => {
      for (let y = 0; y < ISLAND_H; y++) {
        const cut = cutAt(y);
        for (let c = 0; c < ISLAND_W; c++) {
          let color = grid[y][c];
          if (!color) continue;
          const onMain = !broken || c <= cut;
          if (onMain !== (half === 'main')) continue;
          if (broken && solid(c, y) && y > top[c]) {
            if (c === cut) color = pal.crack[0];
            else if (c === cut + 1) color = pal.crack[1];
          }
          px(ctx, c, y, color);
        }
      }
    });

  return { main: paint('main'), chunk: paint('chunk'), top, bottom };
}

function buildCloud(pal: Palette, seed: number, w: number, h: number) {
  const rng = mulberry32(seed);
  const blobs = Array.from({ length: 7 }, () => ({
    x: 6 + rng() * (w - 12),
    y: h * 0.45 + rng() * h * 0.3,
    r: 3 + rng() * (h * 0.4),
  }));
  return layer(w, h, (ctx) => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const inside = blobs.some(
          (b) => (x - b.x) ** 2 + (y - b.y) ** 2 < b.r ** 2,
        );
        if (!inside) continue;
        const lit = blobs.every(
          (b) => (x - b.x) ** 2 + (y - 1 - b.y) ** 2 >= b.r ** 2,
        );
        px(ctx, x, y, lit ? pal.cloud.lit : pal.cloud.shade);
      }
    }
  });
}

// ─── The scene ───────────────────────────────────────────────────────────────

interface Drop {
  x: number;
  y: number;
  speed: number;
  near: boolean;
}

function createIsland(ctx: Ctx, mood: Mood, broken: boolean): Scene {
  const pal = PALETTES[mood];
  ctx.imageSmoothingEnabled = false;
  const backdrop = layer(SCENE_W, SCENE_H, (c) => paintBackdrop(c, pal));
  const island = buildIsland(pal, broken);
  const clouds = [
    { img: buildCloud(pal, 7, 54, 16), x: 20, y: 10, speed: 1.6 },
    { img: buildCloud(pal, 11, 40, 12), x: 120, y: 24, speed: 2.4 },
    { img: buildCloud(pal, 23, 64, 18), x: -40, y: 32, speed: 1.1 },
  ];

  const rng = mulberry32(42);
  const { body } = pal;
  const stars = Array.from({ length: pal.stars }, () => {
    let x: number;
    let y: number;
    do {
      x = Math.floor(rng() * SCENE_W);
      y = Math.floor(rng() * (SEA_Y - 30));
    } while ((x - body.x) ** 2 + (y - body.y) ** 2 < (body.r * 2.5) ** 2);
    return {
      x,
      y,
      phase: rng() * 6.28,
      speed: 0.6 + rng() * 2,
      big: rng() < 0.12,
    };
  });

  const spawnDrop = (near: boolean, anywhere = false): Drop => ({
    x: rand(0, SCENE_W + 30),
    y: anywhere ? rand(-10, SCENE_H) : rand(-20, -2),
    speed: near ? rand(120, 150) : rand(70, 90),
    near,
  });
  const drops = [
    ...Array.from({ length: 70 }, () => spawnDrop(false, true)),
    ...Array.from({ length: 55 }, () => spawnDrop(true, true)),
  ];

  const splashes: Particle[] = [];
  const ripples: Particle[] = [];
  const flames: Particle[] = [];
  const embers: Particle[] = [];
  const smoke: Particle[] = [];
  const water: Particle[] = [];
  const stones: Particle[] = [];
  const emit = {
    flame: emitter(),
    ember: emitter(),
    smoke: emitter(),
    water: emitter(),
    stone: emitter(),
  };

  let t = 0;
  const islandY = () => ISLAND_Y + Math.round(Math.sin(t * 0.9) * 1.6);
  const chunkY = () =>
    ISLAND_Y + CHUNK_DY + Math.round(Math.sin(t * 0.7 + 1.3) * 1.4);
  const fire = () => ({
    x: ISLAND_X + FIRE_COL,
    y: islandY() + island.top[FIRE_COL] - 2,
  });

  /** Scene y of the grass under scene column x, or null off the island. */
  const groundAt = (x: number) => {
    let c = Math.round(x) - ISLAND_X;
    const onMain = (col: number) => !broken || col <= cutAt(island.top[col]);
    if (c >= 0 && c < ISLAND_W && onMain(c)) return islandY() + island.top[c];
    if (!broken) return null;
    c -= CHUNK_DX;
    if (c >= 0 && c < ISLAND_W && !onMain(c)) return chunkY() + island.top[c];
    return null;
  };

  const ripple = (x: number, y: number, life = 0.5) =>
    ripples.push(particle(x, y, 0, 0, life));

  function update(dt: number) {
    t += dt;
    const f = fire();

    for (const d of drops) {
      d.y += d.speed * dt;
      d.x -= d.speed * dt * WIND;
      const ground = d.near ? groundAt(d.x) : null;
      const landed = ground !== null && d.y >= ground;
      const sea = d.y >= SEA_Y + (d.near ? 6 : 1) + (d.x % 7);
      if (!landed && !sea && d.x > -4) continue;
      if (landed && ground !== null) {
        // A drop in the fire hisses into a puff of steam.
        if (Math.abs(d.x - f.x) < 3) {
          smoke.push(particle(d.x, f.y - 2, rand(-3, 1), -10, 1));
        }
        for (let i = 0; i < 2; i++) {
          splashes.push(
            particle(
              d.x,
              ground - 1,
              rand(-18, 14),
              rand(-34, -18),
              rand(0.18, 0.3),
            ),
          );
        }
      } else if (sea && d.near && d.x > 0) {
        ripple(d.x, Math.round(d.y));
      }
      Object.assign(d, spawnDrop(d.near));
    }

    if (broken) {
      // The fire is out: thin smoke off the wet logs.
      emit.smoke(4, dt, () =>
        smoke.push(
          particle(
            f.x + rand(-1, 1),
            f.y,
            rand(-3, 0),
            rand(-9, -6),
            rand(2.4, 3.4),
          ),
        ),
      );
      // Stones keep crumbling from the crack.
      emit.stone(1.4, dt, () =>
        stones.push(
          particle(
            ISLAND_X + CRACK + rand(-1, 3),
            islandY() + island.bottom[CRACK] - rand(0, 8),
            rand(-4, 4),
            0,
            4,
          ),
        ),
      );
    } else {
      emit.flame(70, dt, () =>
        flames.push(
          particle(
            f.x + rand(-2, 2),
            f.y + 1,
            rand(-3, 3),
            rand(-24, -14),
            rand(0.3, 0.65),
          ),
        ),
      );
      emit.ember(5, dt, () =>
        embers.push(
          particle(
            f.x + rand(-1, 1),
            f.y - 2,
            rand(-8, 2),
            rand(-36, -22),
            rand(1, 1.8),
          ),
        ),
      );
      emit.smoke(7, dt, () =>
        smoke.push(
          particle(
            f.x + rand(-1, 1),
            f.y - 6,
            rand(-6, -2),
            rand(-12, -7),
            rand(1.8, 2.8),
          ),
        ),
      );
    }

    // Rain that collects pours off the left edge — or down the crack.
    const fallX = broken ? ISLAND_X + CRACK + 2 : ISLAND_X + 1;
    const fallY = islandY() + island.top[broken ? CRACK : 2] + 1;
    emit.water(40, dt, () =>
      water.push(
        particle(
          fallX + rand(-0.4, 0.4),
          fallY,
          broken ? rand(-1, 1) : rand(-5, -2),
          rand(0, 6),
          2,
        ),
      ),
    );

    step(splashes, dt, 140);
    step(ripples, dt);
    step(flames, dt);
    step(embers, dt);
    step(smoke, dt);
    step(water, dt, 90);
    step(stones, dt, 70);
    for (const e of embers) e.vx += Math.sin(t * 3 + e.life * 9) * 18 * dt;
    for (let i = water.length - 1; i >= 0; i--) {
      if (water[i].y >= SEA_Y + 1)
        ripple(water.splice(i, 1)[0].x, SEA_Y + 2, 0.4);
    }
    for (let i = stones.length - 1; i >= 0; i--) {
      if (stones[i].y < SEA_Y + 2) continue;
      const s = stones.splice(i, 1)[0];
      ripple(s.x, SEA_Y + 2, 0.7);
      for (let k = 0; k < 3; k++) {
        splashes.push(
          particle(s.x, SEA_Y + 1, rand(-10, 10), rand(-30, -16), 0.35),
        );
      }
    }
  }

  function drawRain(near: boolean) {
    ctx.globalAlpha = pal.rainAlpha[near ? 1 : 0];
    const len = near ? 4 : 2;
    for (const d of drops) {
      if (d.near !== near) continue;
      for (let i = 0; i < len; i++) px(ctx, d.x + WIND * i, d.y - i, pal.rain);
    }
  }

  /** A shimmering column on the sea under a light source. */
  function reflect(
    x: number,
    color: string,
    alpha: number,
    spread: number,
    seed: number,
  ) {
    const frame = Math.floor(t * 5);
    for (let y = SEA_Y + 1; y < SCENE_H; y++) {
      const k = y - SEA_Y;
      const half = 1 + k * spread + Math.sin(t * 1.7 + k * 1.3) * 1.2;
      ctx.globalAlpha = alpha * (1 - k / (SCENE_H - SEA_Y + 4));
      for (let dx = -Math.round(half); dx <= Math.round(half); dx++) {
        if (hash(x + dx, y, frame + seed) > 0.55) px(ctx, x + dx, y, color);
      }
    }
  }

  function render() {
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(backdrop, 0, 0);

    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      ctx.globalAlpha = 0.25 + 0.75 * tw;
      px(ctx, s.x, s.y, pal.star);
      if (s.big && tw > 0.75) {
        ctx.globalAlpha = 0.35;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          px(ctx, s.x + dx, s.y + dy, pal.star);
        }
      }
    }

    ctx.globalAlpha = 0.92;
    for (const c of clouds) {
      const span = SCENE_W + c.img.width;
      const x = ((((c.x + t * c.speed) % span) + span) % span) - c.img.width;
      ctx.drawImage(c.img, Math.round(x), c.y);
    }

    const f = fire();
    const flicker = Math.sin(t * 13) * 0.6 + Math.sin(t * 29) * 0.4;

    reflect(body.x, pal.glint, 0.75, mood === 'dusk' ? 0.8 : 0.5, 0);
    if (!broken) {
      reflect(f.x, '#ff9a3c', (0.22 + flicker * 0.04) * pal.fireLight, 0.25, 7);
    }
    ctx.globalAlpha = 0.55;
    for (const r of ripples) {
      const w = Math.round(1 + (r.age / r.life) * 3);
      px(ctx, r.x - w, r.y, pal.ripple);
      px(ctx, r.x + w, r.y, pal.ripple);
    }

    drawRain(false);

    ctx.globalAlpha = 1;
    ctx.drawImage(island.main, ISLAND_X, islandY());
    if (broken) ctx.drawImage(island.chunk, ISLAND_X + CHUNK_DX, chunkY());

    for (const s of stones) px(ctx, s.x, s.y, pal.rock[1]);
    ctx.globalAlpha = 0.5;
    for (const p of water)
      px(ctx, p.x, p.y, p.age < 0.15 ? pal.splash : pal.rain);

    if (broken) {
      // One last coal, breathing.
      ctx.globalAlpha = 0.45 + 0.35 * Math.sin(t * 1.8);
      px(ctx, f.x + 1, f.y + 1, '#c8361a');
    } else {
      // Firelight on the camp.
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = pal.fireLight;
      const glow = ctx.createRadialGradient(
        f.x,
        f.y,
        1,
        f.x,
        f.y,
        24 + flicker * 2,
      );
      glow.addColorStop(0, 'rgba(255, 150, 60, 0.42)');
      glow.addColorStop(0.4, 'rgba(255, 110, 40, 0.14)');
      glow.addColorStop(1, 'rgba(255, 90, 30, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(f.x - 30, f.y - 30, 60, 60);
      ctx.globalCompositeOperation = 'source-over';
    }

    for (const p of smoke) {
      ctx.globalAlpha = 0.4 * (1 - p.age / p.life);
      px(ctx, p.x, p.y, pal.smoke);
    }
    ctx.globalAlpha = 1;
    for (const p of flames) {
      const k = Math.min(
        FLAME.length - 1,
        Math.floor((p.age / p.life) * FLAME.length),
      );
      px(ctx, p.x + Math.sin(t * 20 + p.life * 40) * 0.6, p.y, FLAME[k]);
    }
    for (const p of embers) {
      ctx.globalAlpha =
        (1 - p.age / p.life) * (Math.sin(p.age * 25) > -0.3 ? 1 : 0.3);
      px(ctx, p.x, p.y, '#ffb347');
    }

    drawRain(true);
    ctx.globalAlpha = 0.7;
    for (const p of splashes) px(ctx, p.x, p.y, pal.splash);
    ctx.globalAlpha = 1;
  }

  const scene = { update, render };
  // Start mid-scene: rain already falling, the fire already going.
  prewarm(scene, 2);
  return scene;
}

export const campIsland: SceneFactory = (ctx, mood) =>
  createIsland(ctx, mood, false);

export const brokenIsland: SceneFactory = (ctx, mood) =>
  createIsland(ctx, mood, true);

export const CAMP_LABEL =
  'Pixel art: a campfire on a small floating island, in the rain';

export const BROKEN_LABEL =
  'Pixel art: the floating island has cracked in two, and its campfire is out';
