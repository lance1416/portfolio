/**
 * Fig. 1's fault animation: a Pauli error enters the CNOT and spreads. An X
 * error on the control is copied onto the target; a Z error on the target is
 * copied onto the control. It plays on both halves of the figure at once —
 * as a Pauli box on the circuit, as a π spider on the ZX-diagram, where the
 * copy is the π-copy rule through the other colour's spider.
 *
 * Coordinates are the figure's SVG units; the caller scales the canvas to
 * match its layout (side by side, or stacked on phones).
 */

export type Pauli = 'X' | 'Z';
export type Point = [x: number, y: number];

/** How the figure is laid out: its viewBox, and where each half sits. */
export interface FigureLayout {
  w: number;
  h: number;
  /** Offsets of the circuit, then the ZX-diagram, from the circuit's own place. */
  diagrams: Point[];
  /** Where the "=" between them goes. */
  equals: Point;
}

/** Side by side: circuit, "=", ZX-diagram. */
export const ROW: FigureLayout = {
  w: 560,
  h: 140,
  diagrams: [
    [0, 0],
    [320, 0],
  ],
  equals: [280, 80],
};

/** On phones: the ZX-diagram under the circuit, so both draw larger. */
export const STACK: FigureLayout = {
  w: 240,
  h: 300,
  diagrams: [
    [0, 0],
    [0, 170],
  ],
  equals: [120, 168],
};

const CONTROL = 40;
const TARGET = 100;
const IN = 20;
const GATE = 120;
const OUT = 220;

const SPEED = 170; // SVG units per second
const HOLD = 1.2; // seconds the copies rest on the outputs
const FADE = 0.5;
const TRAIL = 56;

/** The two copies' routes through the circuit, from the input to an output. */
export function routes(kind: Pauli): Point[][] {
  const [from, to] = kind === 'X' ? [CONTROL, TARGET] : [TARGET, CONTROL];
  return [
    [
      [IN, from],
      [GATE, from],
      [OUT, from],
    ],
    [
      [IN, from],
      [GATE, from],
      [GATE, to],
      [OUT, to],
    ],
  ];
}

const dist = ([ax, ay]: Point, [bx, by]: Point) => Math.hypot(bx - ax, by - ay);

export const routeLength = (route: Point[]) =>
  route.slice(1).reduce((sum, p, i) => sum + dist(route[i], p), 0);

/** The point `d` along a route, clamped to its ends. */
export function pointAt(route: Point[], d: number): Point {
  let left = Math.max(0, d);
  for (let i = 1; i < route.length; i++) {
    const [a, b] = [route[i - 1], route[i]];
    const len = dist(a, b);
    if (left <= len) {
      const k = len ? left / len : 0;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    }
    left -= len;
  }
  return route[route.length - 1];
}

/** Distance along each route to the gate's near node, where the error splits. */
const splitAt = (kind: Pauli) => routeLength(routes(kind)[0].slice(0, 2));

/**
 * Seconds from the split until the copies reach their outputs — together.
 * It's how long the average copy would take at SPEED, so the copy with
 * further to go speeds up as much as the other slows down.
 */
function afterSplit(kind: Pauli) {
  const split = splitAt(kind);
  const rest = routes(kind).map((r) => routeLength(r) - split);
  return rest.reduce((a, b) => a + b, 0) / rest.length / SPEED;
}

/**
 * How far along `route` the error is `t` seconds in: a single point at SPEED
 * until it splits, then each copy at its own steady pace so that both reach
 * their outputs at the same moment.
 */
export function distanceAt(kind: Pauli, route: Point[], t: number) {
  const split = splitAt(kind);
  const tSplit = split / SPEED;
  if (t <= tSplit) return Math.max(0, t) * SPEED;
  const k = Math.min(1, (t - tSplit) / afterSplit(kind));
  return split + (routeLength(route) - split) * k;
}

/** When the error is `d` along `route` (the inverse of `distanceAt`). */
function timeAt(kind: Pauli, route: Point[], d: number) {
  const split = splitAt(kind);
  if (d <= split) return d / SPEED;
  return (
    split / SPEED +
    ((d - split) / (routeLength(route) - split)) * afterSplit(kind)
  );
}

/** Seconds until the copies reach their outputs. */
export const travelTime = (kind: Pauli) =>
  splitAt(kind) / SPEED + afterSplit(kind);

export const duration = (kind: Pauli) => travelTime(kind) + HOLD + FADE;

/** Where the error meets each of the gate's nodes, and when. */
export function meetings(kind: Pauli): { at: Point; time: number }[] {
  const via = routes(kind)[1];
  return [1, 2].map((i) => ({
    at: via[i],
    time: timeAt(kind, via, routeLength(via.slice(0, i + 1))),
  }));
}

export interface FaultInk {
  /** Outlines and letters: the figure's ink colour. */
  ink: string;
  /** The error's fill: the ZX colour of its spider. */
  fill: Record<Pauli, string>;
  /** Its trail and ripples, deep enough to read on the page background. */
  glow: Record<Pauli, string>;
  font: string;
}

/**
 * Draws the error `t` seconds after it enters. The context must already be
 * scaled to SVG units and cleared.
 */
export function drawFaults(
  ctx: CanvasRenderingContext2D,
  kind: Pauli,
  t: number,
  ink: FaultInk,
  layout: FigureLayout = ROW,
) {
  const travel = travelTime(kind);
  const fadeOut = Math.min(1, Math.max(0, (t - travel - HOLD) / FADE));
  const alpha = Math.min(1, t / 0.15) * (1 - fadeOut);
  const [main, copy] = routes(kind);
  const split = splitAt(kind);
  const tSplit = split / SPEED;

  for (const [index, [ox, oy]] of layout.diagrams.entries()) {
    ctx.save();
    ctx.translate(ox, oy);

    // A ripple where the error reaches each node.
    for (const m of meetings(kind)) {
      const k = (t - m.time) / 0.6;
      if (k < 0 || k > 1) continue;
      ctx.globalAlpha = (1 - k) * 0.8;
      ctx.strokeStyle = ink.glow[kind];
      ctx.lineWidth = 2 * (1 - k) + 0.5;
      ctx.beginPath();
      ctx.arc(m.at[0], m.at[1], 11 + k * 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const [i, route] of [main, copy].entries()) {
      const head = distanceAt(kind, route, t);
      // Fading trail, longer the faster this copy goes; the copy's starts at
      // the split so the shared stretch isn't drawn twice.
      const pace =
        t > tSplit
          ? (routeLength(route) - split) / afterSplit(kind) / SPEED
          : 1;
      const trail = TRAIL * pace;
      const tail = Math.max(head - trail, i ? split : 0);
      for (let s = tail; s < head; s += 1.5) {
        const [x, y] = pointAt(route, s);
        ctx.globalAlpha = alpha * 0.45 * ((s - head + trail) / trail) ** 2;
        ctx.fillStyle = ink.glow[kind];
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const [x, y] = pointAt(route, head);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ink.fill[kind];
      ctx.strokeStyle = ink.ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (index === 0) ctx.roundRect(x - 8, y - 8, 16, 16, 2);
      else ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#18181b'; // dark on both pale fills, in either theme
      ctx.font = `600 ${index === 0 ? 10 : 11}px ${ink.font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(index === 0 ? kind : 'π', x, y + 0.5);
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
