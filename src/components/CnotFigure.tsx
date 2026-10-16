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
  drawFaults,
  duration,
  type FaultInk,
  type FigureLayout,
  type Pauli,
  ROW,
  STACK,
  travelTime,
} from '@/scene/faultFlow';
import { cn } from '@/utils/cn';
import { DURATION, SPRING, stagger, timed } from '@/utils/variants';

/** ZX spider colours, as PyZX draws them. */
const SPIDER: Record<Pauli, string> = { Z: '#ccffcc', X: '#ff8888' };

const STATUS: Record<Pauli, string> = {
  X: 'An X error on the control is copied onto the target.',
  Z: 'A Z error on the target is copied onto the control.',
};

/**
 * The canvas over Fig. 1 that plays a fault through it (`scene/faultFlow`).
 * With reduced motion it shows where the copies end up, without the trip.
 */
function FaultLayer({
  fault,
  layout,
}: {
  fault: { kind: Pauli; run: number } | null;
  layout: FigureLayout;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const ink: FaultInk = {
      ink: isDark ? '#e4e4e7' : '#18181b',
      fill: SPIDER,
      glow: isDark
        ? { X: '#ff8888', Z: '#9be89b' }
        : { X: '#e0524f', Z: '#2f9e44' },
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
      if (t === null || !fault) return;
      ctx.setTransform(w / layout.w, 0, 0, h / layout.h, 0, 0);
      drawFaults(ctx, fault.kind, t, ink, layout);
    };

    if (!fault) {
      draw(null);
      return;
    }
    if (reduce) {
      draw(travelTime(fault.kind));
      return;
    }
    let start = 0;
    let frame = 0;
    const loop = (now: number) => {
      start ||= now;
      const t = (now - start) / 1000;
      if (t >= duration(fault.kind)) {
        draw(null);
        return;
      }
      draw(t);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [fault, isDark, reduce, layout]);

  return (
    // Hidden from screen readers on a wrapper: Biome counts a canvas as
    // interactive. The status line under the buttons says what it shows.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={ref} className="block h-full w-full font-mono" />
    </div>
  );
}

/**
 * Fig. 1 on Research: a CNOT gate, as a circuit and as a ZX-diagram — a Z
 * spider on the control wire joined to an X spider on the target.
 *
 * Spiders keep the ZX-calculus's own colours (as PyZX draws them: Z green
 * #ccffcc, X red #ff8888) in both themes; only wires and outlines follow the
 * theme. Inherits `hidden` / `show` from its section, so it plays with the
 * page: wires draw in, then the gates settle, left side before right.
 *
 * The buttons send an X or Z error through both halves (`FaultLayer`); an X
 * error plays once by itself when the figure first comes into view.
 */
export function CnotFigure() {
  const reduce = useReducedMotion();
  // Side by side, both halves shrink to slivers on a phone: stack them there.
  const layout = useMediaQuery('(max-width: 639px)') ? STACK : ROW;
  const [zxX, zxY] = layout.diagrams[1];
  const [fault, setFault] = useState<{ kind: Pauli; run: number } | null>(null);
  const play = (kind: Pauli) =>
    setFault((f) => ({ kind, run: (f?.run ?? 0) + 1 }));

  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!inView || reduce) return;
    // After the wires have drawn in.
    const timer = setTimeout(() => {
      setFault((f) => f ?? { kind: 'X', run: 1 });
    }, 1400);
    return () => clearTimeout(timer);
  }, [inView, reduce]);

  // Path drawing isn't covered by MotionConfig's reduced motion; with it on,
  // both states are the finished drawing.
  const wire: Variants = reduce
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
  const side: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  // Ink: near-black on light, near-white on dark.
  const ink = 'stroke-zinc-900 dark:stroke-zinc-200';
  const origin = '[transform-box:fill-box] [transform-origin:center]';

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
          aria-label="A CNOT gate: the circuit symbol, with a control dot on the top wire and a target on the bottom wire, equals a ZX-diagram with a green Z spider on the top wire connected to a red X spider on the bottom wire."
          className="block w-full overflow-visible"
          fill="none"
          strokeWidth={1.5}
        >
          {/* Circuit notation: control dot, target ⊕ */}
          <motion.g variants={side}>
            <motion.path variants={wire} d="M 20 40 H 220" className={ink} />
            <motion.path variants={wire} d="M 20 100 H 220" className={ink} />
            <motion.path variants={wire} d="M 120 40 V 114" className={ink} />
            <motion.circle
              variants={node}
              cx="120"
              cy="40"
              r="6"
              className={`fill-zinc-900 dark:fill-zinc-200 ${origin}`}
            />
            <motion.g variants={node} className={origin}>
              <circle
                cx="120"
                cy="100"
                r="14"
                className={`fill-(--page-bg) ${ink}`}
              />
              <path d="M 106 100 H 134 M 120 86 V 114" className={ink} />
            </motion.g>
          </motion.g>

          <motion.text
            variants={node}
            x={layout.equals[0]}
            y={layout.equals[1]}
            textAnchor="middle"
            className={`fill-zinc-500 font-display text-[32px] dark:fill-zinc-400 ${origin}`}
          >
            =
          </motion.text>

          {/* ZX-diagram: Z spider (green) on control, X spider (red) on target.
              Drawn at x 340–540; the layout moves it (under the circuit on phones). */}
          <motion.g
            variants={side}
            transform={`translate(${zxX - 320} ${zxY})`}
          >
            <motion.path variants={wire} d="M 340 40 H 540" className={ink} />
            <motion.path variants={wire} d="M 340 100 H 540" className={ink} />
            <motion.path variants={wire} d="M 440 40 V 100" className={ink} />
            <motion.circle
              variants={node}
              cx="440"
              cy="40"
              r="11"
              fill={SPIDER.Z}
              className={`${ink} ${origin}`}
            />
            <motion.circle
              variants={node}
              cx="440"
              cy="100"
              r="11"
              fill={SPIDER.X}
              className={`${ink} ${origin}`}
            />
          </motion.g>
        </motion.svg>
        <FaultLayer fault={fault} layout={layout} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {(['X', 'Z'] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => play(kind)}
            className="btn-secondary"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full border border-zinc-900/40 dark:border-zinc-200/60"
              style={{ background: SPIDER[kind] }}
            />
            {kind === 'X' ? 'X error on the control' : 'Z error on the target'}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mono-meta mt-3 min-h-4">
        {fault && STATUS[fault.kind]}
      </p>

      <figcaption className="mono-meta mt-4 max-w-[62ch]">
        Fig. 1 — A CNOT gate in the ZX-calculus: a Z spider (green) on the
        control wire, joined to an X spider (red) on the target.
      </figcaption>
    </figure>
  );
}
