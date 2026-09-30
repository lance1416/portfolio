import type { Variants } from 'motion/react';

/** Standard fade-up for individual items inside a stagger container. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
};

/** Stagger container — orchestrates children only; container itself has no opacity animation. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/** Spread onto a stagger container to play it once as it scrolls into view. */
export const revealOnScroll = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-80px' },
} as const;

/** Faster stagger for home page where content appears on first load. */
export const staggerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
