import { motion, type Variants } from 'motion/react';
import { Fragment } from 'react';

const CHAR: Variants = {
  hidden: { opacity: 0, y: '0.35em', filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 420, damping: 32 },
  },
};

/**
 * Text whose characters enter one after another. It inherits `hidden` /
 * `show` from the nearest animating ancestor, so the parent decides when it
 * plays. Words stay unbroken; screen readers get the plain string.
 */
export function SplitText({
  text,
  stagger = 0.03,
  delay = 0,
}: {
  text: string;
  /** Seconds between characters. */
  stagger?: number;
  delay?: number;
}) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {text.split(' ').map((word, w) => (
          <Fragment
            // biome-ignore lint/suspicious/noArrayIndexKey: words of a static string
            key={w}
          >
            {/* A plain space between words keeps normal line breaking */}
            {w > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((char, c) => (
                <motion.span
                  // biome-ignore lint/suspicious/noArrayIndexKey: characters of a static string
                  key={c}
                  variants={CHAR}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </Fragment>
        ))}
      </motion.span>
    </>
  );
}
