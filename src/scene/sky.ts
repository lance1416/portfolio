/**
 * The little skies beside Home's local times: each city's real sky right
 * now — the sun where it actually is (from the city's latitude/longitude and
 * the time), a moon and stars at night, and the city's skyline with its
 * windows lit after dark. Oxford drizzles.
 */
import {
  type Ctx,
  mulberry32,
  type Particle,
  particle,
  px,
  rand,
  type SceneFactory,
  step,
} from './engine';

export const SKY_W = 32;
export const SKY_H = 8;

const RAD = Math.PI / 180;

/**
 * The sun's elevation above the horizon and its azimuth (clockwise from
 * north), in degrees — the usual low-precision almanac formulas, good to a
 * fraction of a degree, which is far finer than one pixel here.
 */
export function sunPosition(date: Date, lat: number, lon: number) {
  const d = date.getTime() / 86_400_000 - 10_957.5; // days since J2000
  const g = (357.529 + 0.98560028 * d) * RAD; // mean anomaly
  const q = 280.459 + 0.98564736 * d; // mean longitude
  const ecl = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const tilt = (23.439 - 0.00000036 * d) * RAD;
  const ra = Math.atan2(Math.cos(tilt) * Math.sin(ecl), Math.cos(ecl));
  const dec = Math.asin(Math.sin(tilt) * Math.sin(ecl));
  const gmst = 18.697374558 + 24.06570982441908 * d; // hours
  const hourAngle = (gmst * 15 + lon) * RAD - ra;
  const phi = lat * RAD;
  const elevation = Math.asin(
    Math.sin(phi) * Math.sin(dec) +
      Math.cos(phi) * Math.cos(dec) * Math.cos(hourAngle),
  );
  const azimuth = Math.atan2(
    -Math.sin(hourAngle),
    Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(hourAngle),
  );
  return {
    elevation: elevation / RAD,
    azimuth: (azimuth / RAD + 360) % 360,
  };
}

type RGB = [number, number, number];

const hex = (h: string): RGB =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, k: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;

/**
 * Sky top and horizon colours by the sun's elevation, blended between. Night
 * skies keep a glow of city light low down, so the near-black skylines stand
 * out against them.
 */
const SKY_KEYS: { e: number; top: RGB; low: RGB }[] = [
  { e: -18, top: hex('#0d1330'), low: hex('#2e3a74') },
  { e: -8, top: hex('#1b2356'), low: hex('#5d4b82') },
  { e: -1, top: hex('#34407e'), low: hex('#ee8a66') },
  { e: 6, top: hex('#5a8ad0'), low: hex('#f7c48a') },
  { e: 18, top: hex('#4f97e2'), low: hex('#b9def6') },
];

function skyAt(elevation: number, row: number) {
  const k = row / (SKY_H - 1);
  const i = SKY_KEYS.findIndex((key) => key.e > elevation);
  if (i === 0 || i === -1) {
    const key = SKY_KEYS[i === 0 ? 0 : SKY_KEYS.length - 1];
    return mix(key.top, key.low, k);
  }
  const [a, b] = [SKY_KEYS[i - 1], SKY_KEYS[i]];
  const t = (elevation - a.e) / (b.e - a.e);
  const top: RGB = a.top.map((v, j) => v + (b.top[j] - v) * t) as RGB;
  const low: RGB = a.low.map((v, j) => v + (b.low[j] - v) * t) as RGB;
  return mix(top, low, k);
}

/**
 * Skylines, top row first: `#` building, `o` a window (lit after dark).
 * Beijing: a Forbidden City hall. Toronto: the CN Tower. Oxford: spires and
 * the Radcliffe Camera's dome.
 */
const SKYLINES: Record<string, string[]> = {
  Beijing: [
    '',
    '',
    '..........#..........#',
    '.......#..############..#',
    '........################',
    '..........#o#o#o#o#o#',
    '.........#############',
    '##..#######################..###',
  ],
  Toronto: [
    '......................#',
    '......................#',
    '.....................###',
    '.....................###',
    '......................#',
    '...##..........##.....#...##',
    '..#o##.##o....#o#.....#..#o###',
    '################################',
  ],
  Oxford: [
    '.....#....................#',
    '.....#..........#.........#',
    '....###........###.......###',
    '....#o#.......#####......#o#',
    '....#o#.......#o#o#......#o#.#',
    '....###.......#####......###.#',
    '..#######..###########.#######',
    '################################',
  ],
};

const DRIZZLE = new Set(['Oxford']);

/** The sky over one city; `lat`/`lon` place its sun. */
export function citySky(name: string, lat: number, lon: number): SceneFactory {
  return (ctx: Ctx) => {
    const rng = mulberry32(name.length * 7919 + Math.round(lat * 100));
    const skyline = (SKYLINES[name] ?? []).map((row) => row.padEnd(SKY_W, '.'));
    // About half the windows are lit at night.
    const lit = skyline.map((row) => [...row].map(() => rng() < 0.6));
    const stars = Array.from({ length: 6 }, () => ({
      x: Math.floor(rng() * SKY_W),
      y: Math.floor(rng() * 4),
      phase: rng() * 6.28,
    }));
    const drops: Particle[] = [];
    const rains = DRIZZLE.has(name);

    let t = 0;
    let sun = sunPosition(new Date(), lat, lon);
    let since = 0;

    function update(dt: number) {
      t += dt;
      since += dt;
      if (since >= 5 || dt === 0) {
        since = 0;
        sun = sunPosition(new Date(), lat, lon);
      }
      if (rains && drops.length < 4 && Math.random() < dt * 3) {
        drops.push(particle(rand(2, SKY_W + 4), -1, -6, rand(12, 16), 1.2));
      }
      step(drops, dt);
    }

    /** A disc's column for an azimuth: east on the left, west on the right. */
    const column = (azimuth: number) => {
      const k = ((((azimuth - 45) % 360) + 360) % 360) / 270;
      return Math.round(Math.min(1, k) * (SKY_W - 2));
    };
    /** Its row: the horizon at the bottom, ~50° up at the top. */
    const row = (elevation: number) =>
      Math.round((SKY_H - 2) * (1 - elevation / 50));

    function render() {
      ctx.globalAlpha = 1;
      for (let y = 0; y < SKY_H; y++) {
        ctx.fillStyle = skyAt(sun.elevation, y);
        ctx.fillRect(0, y, SKY_W, 1);
      }

      const dark = Math.min(1, Math.max(0, (-sun.elevation - 2) / 8));
      for (const s of stars) {
        ctx.globalAlpha = dark * (0.45 + 0.4 * Math.sin(t * 1.6 + s.phase));
        px(ctx, s.x, s.y, '#e6ecff');
      }

      // Sun by day; at night a moon, roughly opposite.
      ctx.globalAlpha = 1;
      if (sun.elevation > -1) {
        const x = column(sun.azimuth);
        const y = row(sun.elevation);
        ctx.fillStyle = sun.elevation < 6 ? '#ffd27a' : '#fff6cc';
        ctx.fillRect(x, y, 2, 2);
      } else if (sun.elevation < -6) {
        const x = column((sun.azimuth + 180) % 360);
        const y = Math.max(0, row(-sun.elevation * 0.8));
        ctx.fillStyle = '#e9e9f2';
        ctx.fillRect(x, y, 2, 2);
        px(ctx, x, y + 1, '#b9b9cc');
      }

      const shade = mix(hex('#2c3b4c'), hex('#020309'), dark);
      skyline.forEach((line, y) => {
        [...line].forEach((ch, x) => {
          if (ch === '.') return;
          const lamp = ch === 'o' && dark > 0.3 && lit[y][x];
          px(ctx, x, y, lamp ? '#ffcf6e' : shade);
        });
      });

      ctx.globalAlpha = 0.55;
      for (const d of drops) {
        px(ctx, d.x, d.y, '#c9d6ff');
        px(ctx, d.x + 0.5, d.y - 1, '#c9d6ff');
      }
      ctx.globalAlpha = 1;
    }

    update(0);
    return { update, render };
  };
}
