import { motion, useReducedMotion, type Variants } from 'motion/react';
import { DURATION, SPRING, stagger, timed } from '@/utils/variants';

/**
 * Fig. 1 on Research: a CNOT gate, as a circuit and as a ZX-diagram — a Z
 * spider on the control wire joined to an X spider on the target.
 *
 * Spiders keep the ZX-calculus's own colours (as PyZX draws them: Z green
 * #ccffcc, X red #ff8888) in both themes; only wires and outlines follow the
 * theme. Inherits `hidden` / `show` from its section, so it plays with the
 * page: wires draw in, then the gates settle, left side before right.
 */
export function CnotFigure() {
  const reduce = useReducedMotion();

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
      <motion.svg
        variants={stagger}
        viewBox="0 0 560 140"
        role="img"
        aria-label="A CNOT gate: the circuit symbol, with a control dot on the top wire and a target on the bottom wire, equals a ZX-diagram with a green Z spider on the top wire connected to a red X spider on the bottom wire."
        className="w-full max-w-xl overflow-visible"
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
          x="280"
          y="80"
          textAnchor="middle"
          className={`fill-zinc-500 font-display text-[32px] dark:fill-zinc-400 ${origin}`}
        >
          =
        </motion.text>

        {/* ZX-diagram: Z spider (green) on control, X spider (red) on target */}
        <motion.g variants={side}>
          <motion.path variants={wire} d="M 340 40 H 540" className={ink} />
          <motion.path variants={wire} d="M 340 100 H 540" className={ink} />
          <motion.path variants={wire} d="M 440 40 V 100" className={ink} />
          <motion.circle
            variants={node}
            cx="440"
            cy="40"
            r="11"
            fill="#ccffcc"
            className={`${ink} ${origin}`}
          />
          <motion.circle
            variants={node}
            cx="440"
            cy="100"
            r="11"
            fill="#ff8888"
            className={`${ink} ${origin}`}
          />
        </motion.g>
      </motion.svg>

      <figcaption className="mono-meta mt-4 max-w-[62ch]">
        Fig. 1 — A CNOT gate in the ZX-calculus: a Z spider (green) on the
        control wire, joined to an X spider (red) on the target.
      </figcaption>
    </figure>
  );
}
