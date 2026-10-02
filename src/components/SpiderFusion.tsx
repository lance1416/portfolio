import { motion, useReducedMotion, type Variants } from 'motion/react';
import { DURATION, SPRING, stagger, timed } from '@/utils/variants';

/**
 * Fig. 1 on Research: spider fusion, the simplest ZX-calculus rewrite — two
 * connected Z spiders merge into one, adding their phases. Drawn in the
 * site's palette (Z spiders in the accent) and played with the house motion:
 * wires draw in, spiders settle, then the right-hand side follows.
 *
 * Inherits `hidden` / `show` from its section, so it plays with the page.
 */
export function SpiderFusion() {
  const reduce = useReducedMotion();

  // Path drawing isn't covered by MotionConfig's reduced motion; with it on,
  // both states are the finished drawing.
  const wire: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { pathLength: 0, opacity: 0 },
        show: { pathLength: 1, opacity: 1, transition: timed(DURATION.slow) },
      };
  const spider: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { scale: 0.4, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: SPRING.content },
      };
  const side: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const wireClass = 'stroke-zinc-400 dark:stroke-zinc-600';
  const spiderClass =
    'fill-accent-subtle stroke-accent [transform-box:fill-box] [transform-origin:center]';
  const phaseClass =
    'fill-zinc-600 font-mono text-[16px] [transform-box:fill-box] [transform-origin:center] dark:fill-zinc-400';

  return (
    <figure className="mt-12">
      <motion.svg
        variants={stagger}
        viewBox="0 0 560 120"
        role="img"
        aria-label="Two connected Z spiders with phases alpha and beta equal one Z spider with phase alpha plus beta."
        className="w-full max-w-xl overflow-visible"
        fill="none"
        strokeWidth={1.5}
      >
        {/* Left: two Z spiders joined by a wire */}
        <motion.g variants={side}>
          <motion.path
            variants={wire}
            d="M 10 64 H 230"
            className={wireClass}
          />
          <motion.circle
            variants={spider}
            cx="80"
            cy="64"
            r="16"
            className={spiderClass}
          />
          <motion.circle
            variants={spider}
            cx="160"
            cy="64"
            r="16"
            className={spiderClass}
          />
          <motion.text
            variants={spider}
            x="80"
            y="30"
            textAnchor="middle"
            className={phaseClass}
          >
            α
          </motion.text>
          <motion.text
            variants={spider}
            x="160"
            y="30"
            textAnchor="middle"
            className={phaseClass}
          >
            β
          </motion.text>
        </motion.g>

        <motion.text
          variants={spider}
          x="280"
          y="72"
          textAnchor="middle"
          className="fill-zinc-500 font-display text-[32px] [transform-box:fill-box] [transform-origin:center] dark:fill-zinc-400"
        >
          =
        </motion.text>

        {/* Right: the fused spider */}
        <motion.g variants={side}>
          <motion.path
            variants={wire}
            d="M 330 64 H 550"
            className={wireClass}
          />
          <motion.circle
            variants={spider}
            cx="440"
            cy="64"
            r="16"
            className={spiderClass}
          />
          <motion.text
            variants={spider}
            x="440"
            y="30"
            textAnchor="middle"
            className={phaseClass}
          >
            α + β
          </motion.text>
        </motion.g>
      </motion.svg>

      <figcaption className="mono-meta mt-4 max-w-[62ch]">
        Fig. 1 — Spider fusion, the simplest ZX rewrite: two connected Z spiders
        merge into one, and their phases add.
      </figcaption>
    </figure>
  );
}
