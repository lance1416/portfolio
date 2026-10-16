import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  CHECKS,
  drawError,
  duration,
  type FigureLayout,
  facePath,
  type Ink,
  outputEnd,
  type Point,
  QUBITS,
  ROW,
  STACK,
  settleTime,
  trippedBy,
} from '@/scene/surfaceCode';
import { cn } from '@/utils/cn';
import { DURATION, SPRING, stagger, timed } from '@/utils/variants';

/** ZX spider colours, as PyZX draws them. */
const SPIDER = { Z: '#ccffcc', X: '#ff8888' };

/**
 * How strongly the lattice's faces take their spider colour: stronger on
 * dark, where a faint pastel tint over near-black turns muddy.
 */
const FACE_OPACITY = {
  light: { Z: 0.3, X: 0.45 },
  dark: { Z: 0.65, X: 0.55 },
};

/** The order the button walks the qubits in: centre first, then about. */
const ORDER = [4, 0, 5, 7, 3, 2, 8, 1, 6];

const status = (qubit: number) =>
  trippedBy(qubit).length === 1
    ? 'An X error trips the one Z-check it touches.'
    : 'An X error trips the two Z-checks it touches.';

type Fault = { qubit: number; run: number };

/**
 * The canvas over Fig. 1 that plays an X error through it
 * (`scene/surfaceCode`). With reduced motion it shows where it ends up.
 */
function ErrorLayer({
  error,
  layout,
}: {
  error: Fault | null;
  layout: FigureLayout;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const ink: Ink = {
      ink: isDark ? '#e4e4e7' : '#18181b',
      fill: SPIDER,
      glow: isDark ? '#ff8888' : '#e0524f',
      font: getComputedStyle(canvas).fontFamily,
    };
    const draw = (t: number | null) => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (t === null || !error) return;
      ctx.setTransform(w / layout.w, 0, 0, h / layout.h, 0, 0);
      drawError(ctx, error.qubit, t, ink, layout);
    };

    if (!error) {
      draw(null);
      return;
    }
    if (reduce) {
      draw(settleTime + 0.6);
      return;
    }
    let start = 0;
    let frame = 0;
    const loop = (now: number) => {
      start ||= now;
      const t = (now - start) / 1000;
      if (t >= duration) {
        draw(null);
        return;
      }
      draw(t);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [error, isDark, reduce, layout]);

  return (
    // Hidden from screen readers on a wrapper: Biome counts a canvas as
    // interactive. The status line under the button says what it shows.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={ref} className="block h-full w-full font-mono" />
    </div>
  );
}

/**
 * Fig. 1 on Research: the distance-3 surface code, and a state of it as a
 * phase-free ZX-diagram — a green Z spider per data qubit, a red X spider per
 * Z-check joined to that check's qubits. The lattice tints each face in the
 * colour its check takes in the diagram (Z-checks red, X-checks green), so
 * the two panels line up.
 *
 * The button (or a click on a qubit) puts an X error on a qubit: its Z-checks
 * light up on the lattice while, in the diagram, the π copies through the
 * qubit's spider into theirs. One plays by itself when the figure first
 * comes into view. Inherits `hidden` / `show` from its section: the lattice
 * and wires draw in, then the spiders settle.
 */
export function SurfaceCodeFigure() {
  const reduce = useReducedMotion();
  const { isDark } = useTheme();
  // Side by side, both panels shrink to slivers on a phone: stack them there.
  const layout = useMediaQuery('(max-width: 639px)') ? STACK : ROW;
  const [error, setError] = useState<Fault | null>(null);
  const put = (qubit: number) =>
    setError((e) => ({ qubit, run: (e?.run ?? 0) + 1 }));
  const next = () =>
    put(
      error ? ORDER[(ORDER.indexOf(error.qubit) + 1) % ORDER.length] : ORDER[0],
    );

  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!inView || reduce) return;
    // After the lattice and wires have drawn in.
    const timer = setTimeout(() => {
      setError((e) => e ?? { qubit: ORDER[0], run: 1 });
    }, 1400);
    return () => clearTimeout(timer);
  }, [inView, reduce]);

  // Path drawing isn't covered by MotionConfig's reduced motion; with it on,
  // both states are the finished drawing.
  const line: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { pathLength: 0, opacity: 0 },
        show: { pathLength: 1, opacity: 1, transition: timed(DURATION.slow) },
      };
  const node: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { scale: 0.4, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: SPRING.content },
      };
  const panel: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.03 } },
  };

  // Ink: near-black on light, near-white on dark.
  const ink = 'stroke-zinc-900 dark:stroke-zinc-200';
  const origin = '[transform-box:fill-box] [transform-origin:center]';
  const label = 'fill-zinc-500 font-mono text-[11px] dark:fill-zinc-400';
  const at = ([x, y]: Point) => `translate(${x} ${y})`;

  return (
    <figure className="mt-12">
      <div
        ref={frame}
        className={cn('relative', layout === STACK ? 'max-w-64' : 'max-w-xl')}
      >
        <motion.svg
          variants={stagger}
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          role="img"
          aria-label="The distance-3 surface code: nine data qubits on a lattice whose faces alternate between X-checks and Z-checks. Beside it, the same code as a ZX-diagram: a green Z spider on each qubit, and a red X spider for each Z-check, joined to that check's qubits."
          className="block w-full overflow-visible"
          fill="none"
          strokeWidth={1.5}
        >
          {/* The lattice: faces tinted by the colour their check takes in
              the diagram, qubits on the corners. */}
          <motion.g variants={panel} transform={at(layout.lattice)}>
            <text x={130} y={14} textAnchor="middle" className={label}>
              surface code, d = 3
            </text>
            {CHECKS.map((check, k) => (
              <motion.path
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list
                key={k}
                variants={line}
                d={facePath(check.face)}
                fill={check.type === 'Z' ? SPIDER.X : SPIDER.Z}
                fillOpacity={
                  FACE_OPACITY[isDark ? 'dark' : 'light'][check.type]
                }
                className={cn(ink, 'stroke-1')}
              />
            ))}
            {QUBITS.map((qubit, i) => (
              <motion.circle
                key={`${qubit.r}-${qubit.c}`}
                variants={node}
                cx={qubit.at[0]}
                cy={qubit.at[1]}
                r={5}
                // A pointer-only shortcut; the button is the real control.
                onClick={() => put(i)}
                className={cn('cursor-pointer fill-(--page-bg)', ink, origin)}
              />
            ))}
          </motion.g>

          {/* The ZX-diagram: a Z spider per qubit with its output, an X
              spider per Z-check joined to that check's qubits. */}
          <motion.g variants={panel} transform={at(layout.zx)}>
            <text x={130} y={14} textAnchor="middle" className={label}>
              as a ZX-diagram
            </text>
            {CHECKS.flatMap((check) =>
              check.spider
                ? check.qubits.map((i) => (
                    <motion.path
                      key={`${check.spider?.join()}-${i}`}
                      variants={line}
                      d={`M ${check.spider?.join(' ')} L ${QUBITS[i].at.join(' ')}`}
                      className={ink}
                    />
                  ))
                : [],
            )}
            {QUBITS.map((qubit, i) => (
              <motion.path
                key={`out-${qubit.r}-${qubit.c}`}
                variants={line}
                d={`M ${qubit.at.join(' ')} L ${outputEnd(i).join(' ')}`}
                className={ink}
              />
            ))}
            {QUBITS.map((qubit) => (
              <motion.circle
                key={`z-${qubit.r}-${qubit.c}`}
                variants={node}
                cx={qubit.at[0]}
                cy={qubit.at[1]}
                r={8}
                fill={SPIDER.Z}
                className={cn(ink, origin)}
              />
            ))}
            {CHECKS.map((check, k) =>
              check.spider ? (
                <motion.circle
                  // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list
                  key={`x-${k}`}
                  variants={node}
                  cx={check.spider[0]}
                  cy={check.spider[1]}
                  r={8}
                  fill={SPIDER.X}
                  className={cn(ink, origin)}
                />
              ) : null,
            )}
          </motion.g>
        </motion.svg>
        <ErrorLayer error={error} layout={layout} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={next} className="btn-secondary">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full border border-zinc-900/40 dark:border-zinc-200/60"
            style={{ background: SPIDER.X }}
          />
          Put an X error on a qubit
        </button>
      </div>
      <p aria-live="polite" className="mono-meta mt-3 min-h-4">
        {error && status(error.qubit)}
      </p>

      <figcaption className="mono-meta mt-4 max-w-[62ch]">
        Fig. 1 — The distance-3 surface code, and a state of it as a phase-free
        ZX-diagram: a green Z spider per data qubit, and a red X spider joined
        to the qubits of each Z-check (the red faces). An X error copies through
        its qubit’s spider into exactly the checks it trips.
      </figcaption>
    </figure>
  );
}
