/**
 * Fig. 1: the distance-3 rotated surface code, and a state of it as a
 * phase-free ZX-diagram. The lattice has nine data qubits and eight checks:
 * four faces inside, one half-face on each side. The ZX-diagram puts a green
 * Z spider on every data qubit (with its output wire) and a red X spider on
 * every Z-check, joined to that check's qubits: the Z spiders copy each
 * qubit's value to the X spiders, which only allow even parity, so the
 * diagram is the even superposition of every string the Z-checks accept (the
 * code's logical |+⟩). The X-checks hold of it without being drawn.
 *
 * The animation: an X error lands on a qubit. In the ZX-diagram the π on its
 * output wire copies through the qubit's spider onto every other leg and
 * fuses into the checks it reaches, giving them phase π; on the lattice the
 * same checks light up. Coordinates are the figure's SVG units, per panel.
 */

export type Point = [x: number, y: number];
export type Pauli = 'X' | 'Z';

const S = 50; // qubit spacing
const X0 = 80;
const Y0 = 60;

export interface Qubit {
  r: number;
  c: number;
  at: Point;
}

export const QUBITS: Qubit[] = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3);
  const c = i % 3;
  return { r, c, at: [X0 + c * S, Y0 + r * S] };
});

const q = (r: number, c: number) => r * 3 + c;

export type Face =
  | { kind: 'square'; centre: Point }
  | { kind: 'half'; centre: Point; side: 'up' | 'down' | 'left' | 'right' };

export interface Check {
  type: Pauli;
  /** Indices into QUBITS. */
  qubits: number[];
  face: Face;
  /** Where its X spider sits in the ZX panel (Z-checks only). */
  spider?: Point;
}

const square = (a: number, b: number): Face => ({
  kind: 'square',
  centre: [X0 + (b + 0.5) * S, Y0 + (a + 0.5) * S],
});
const corners = (a: number, b: number) => [
  q(a, b),
  q(a, b + 1),
  q(a + 1, b),
  q(a + 1, b + 1),
];

/**
 * Faces alternate like a chessboard; each side carries one half-face, of the
 * type opposite its inner neighbour: X on top and bottom, Z left and right.
 */
export const CHECKS: Check[] = [
  {
    type: 'Z',
    qubits: corners(0, 0),
    face: square(0, 0),
    spider: square(0, 0).centre,
  },
  { type: 'X', qubits: corners(0, 1), face: square(0, 1) },
  { type: 'X', qubits: corners(1, 0), face: square(1, 0) },
  {
    type: 'Z',
    qubits: corners(1, 1),
    face: square(1, 1),
    spider: square(1, 1).centre,
  },
  {
    type: 'X',
    qubits: [q(0, 0), q(0, 1)],
    face: { kind: 'half', centre: [X0 + 0.5 * S, Y0], side: 'up' },
  },
  {
    type: 'X',
    qubits: [q(2, 1), q(2, 2)],
    face: { kind: 'half', centre: [X0 + 1.5 * S, Y0 + 2 * S], side: 'down' },
  },
  {
    type: 'Z',
    qubits: [q(1, 0), q(2, 0)],
    face: { kind: 'half', centre: [X0, Y0 + 1.5 * S], side: 'left' },
    spider: [X0 - 22, Y0 + 1.5 * S],
  },
  {
    type: 'Z',
    qubits: [q(0, 2), q(1, 2)],
    face: { kind: 'half', centre: [X0 + 2 * S, Y0 + 0.5 * S], side: 'right' },
    spider: [X0 + 2 * S + 22, Y0 + 0.5 * S],
  },
];

/** Where a qubit's output wire ends in the ZX panel (straight up). */
export const outputEnd = (i: number): Point => [
  QUBITS[i].at[0],
  QUBITS[i].at[1] - 18,
];

/** The Z-checks an X error on qubit `i` trips, as indices into CHECKS. */
export const trippedBy = (i: number) =>
  CHECKS.flatMap((check, k) =>
    check.type === 'Z' && check.qubits.includes(i) ? [k] : [],
  );

/** Traces a face's outline (no fill or stroke). */
export function tracePath(ctx: CanvasRenderingContext2D, face: Face) {
  const [cx, cy] = face.centre;
  ctx.beginPath();
  if (face.kind === 'square') {
    ctx.rect(cx - S / 2, cy - S / 2, S, S);
    return;
  }
  const r = S / 2;
  const [start, end] = {
    up: [Math.PI, 2 * Math.PI],
    down: [0, Math.PI],
    left: [Math.PI / 2, (3 * Math.PI) / 2],
    right: [-Math.PI / 2, Math.PI / 2],
  }[face.side];
  ctx.arc(cx, cy, r, start, end);
  ctx.closePath();
}

/** The same outline as an SVG path. */
export function facePath(face: Face) {
  const [cx, cy] = face.centre;
  const r = S / 2;
  if (face.kind === 'square') {
    return `M ${cx - r} ${cy - r} h ${S} v ${S} h ${-S} Z`;
  }
  switch (face.side) {
    case 'up':
      return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`;
    case 'down':
      return `M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy} Z`;
    case 'left':
      return `M ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r} Z`;
    case 'right':
      return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`;
  }
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export interface FigureLayout {
  w: number;
  h: number;
  /** Offsets of the lattice panel and the ZX panel. */
  lattice: Point;
  zx: Point;
}

/** Side by side. */
export const ROW: FigureLayout = {
  w: 560,
  h: 200,
  lattice: [0, 0],
  zx: [300, 0],
};

/** On phones: the ZX-diagram under the lattice. */
export const STACK: FigureLayout = {
  w: 240,
  h: 400,
  lattice: [-10, 0],
  zx: [-10, 200],
};

// ─── Animation ───────────────────────────────────────────────────────────────

const APPEAR = 0.25;
const SLIDE = 0.45; // down the output wire into the qubit's spider
const COPY = 0.55; // along each edge to a check
const HOLD = 1.4;
const FADE = 0.5;

const tSpider = APPEAR + SLIDE;
const tFuse = tSpider + COPY;

/** Seconds until the copies have fused into their checks. */
export const settleTime = tFuse;
export const duration = tFuse + HOLD + FADE;

export interface Ink {
  ink: string;
  /** Spider colours, as PyZX draws them. */
  fill: Record<Pauli, string>;
  /** The error's trail, ripples and lit faces: deep enough for the page. */
  glow: string;
  font: string;
}

const lerp = (a: Point, b: Point, k: number): Point => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
];
const ease = (k: number) => k * k * (3 - 2 * k);
const clamp01 = (k: number) => Math.min(1, Math.max(0, k));

function ripple(
  ctx: CanvasRenderingContext2D,
  at: Point,
  k: number,
  color: string,
  from = 9,
) {
  if (k < 0 || k > 1) return;
  ctx.globalAlpha = (1 - k) * 0.8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 * (1 - k) + 0.5;
  ctx.beginPath();
  ctx.arc(at[0], at[1], from + k * 14, 0, Math.PI * 2);
  ctx.stroke();
}

function token(
  ctx: CanvasRenderingContext2D,
  at: Point,
  label: string,
  square: boolean,
  ink: Ink,
) {
  ctx.fillStyle = ink.fill.X;
  ctx.strokeStyle = ink.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (square) ctx.roundRect(at[0] - 7, at[1] - 7, 14, 14, 2);
  else ctx.arc(at[0], at[1], 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#18181b'; // dark on the pale fill, in either theme
  ctx.font = `600 ${square ? 9 : 10}px ${ink.font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, at[0], at[1] + 0.5);
}

/**
 * Draws an X error on qubit `qubit`, `t` seconds after it lands. The
 * context must already be scaled to SVG units and cleared.
 */
export function drawError(
  ctx: CanvasRenderingContext2D,
  qubit: number,
  t: number,
  ink: Ink,
  layout: FigureLayout = ROW,
) {
  const fade = 1 - clamp01((t - tFuse - HOLD) / FADE);
  const alpha = clamp01(t / APPEAR) * fade;
  const tripped = trippedBy(qubit).map((k) => CHECKS[k]);
  const home = QUBITS[qubit].at;

  // The lattice: the error on its qubit, then the faces it trips.
  ctx.save();
  ctx.translate(...layout.lattice);
  if (t >= tFuse) {
    for (const check of tripped) {
      ctx.globalAlpha = 0.35 * fade;
      ctx.fillStyle = ink.glow;
      tracePath(ctx, check.face);
      ctx.fill();
      ctx.globalAlpha = fade;
      ctx.strokeStyle = ink.glow;
      ctx.lineWidth = 2;
      tracePath(ctx, check.face);
      ctx.stroke();
      ripple(ctx, check.face.centre, (t - tFuse) / 0.6, ink.glow, 14);
    }
  }
  ctx.globalAlpha = alpha;
  token(ctx, home, 'X', true, ink);
  ctx.restore();

  // The ZX-diagram: down the output wire, through the spider, out to the
  // checks, where the copies fuse and leave phase π.
  ctx.save();
  ctx.translate(...layout.zx);
  ripple(ctx, home, (t - tSpider) / 0.5, ink.glow);
  if (t < tSpider) {
    ctx.globalAlpha = alpha;
    const at = lerp(
      outputEnd(qubit),
      home,
      ease(clamp01((t - APPEAR) / SLIDE)),
    );
    token(ctx, at, 'π', false, ink);
  } else if (t < tFuse) {
    const k = ease((t - tSpider) / COPY);
    for (const check of tripped) {
      const spider = check.spider as Point;
      // A short fading trail behind each copy.
      for (let s = 0; s < 1; s += 0.08) {
        const back = Math.max(0, k - 0.25 * (1 - s));
        const [x, y] = lerp(home, spider, back);
        ctx.globalAlpha = 0.35 * s * s;
        ctx.fillStyle = ink.glow;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      token(ctx, lerp(home, spider, k), 'π', false, ink);
    }
  } else {
    for (const check of tripped) {
      const spider = check.spider as Point;
      ripple(ctx, spider, (t - tFuse) / 0.6, ink.glow);
      // The check's spider now carries phase π, written inside it as ZX
      // diagrams write phases.
      ctx.globalAlpha = fade;
      ctx.fillStyle = '#18181b'; // dark on the red fill, in either theme
      ctx.font = `600 10px ${ink.font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('π', spider[0], spider[1] + 0.5);
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}
