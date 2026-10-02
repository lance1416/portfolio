import type { Transition, Variants } from 'motion/react';

// ─── Motion tokens ───────────────────────────────────────────────────────────
// Every animation on the site draws from these, so the whole thing moves with
// one hand. Physical exceptions (the 3D ring, the scroll-progress filter) keep
// their own tuned springs where they live.

/** Decelerating curve for anything timed: page turns, reveals, exits. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  /** Leaving: quick, so the next thing isn't kept waiting. */
  exit: 0.15,
  /** Small state changes: panels, menus, details. */
  base: 0.3,
  /** Larger moves: the title roll, drawn bars. */
  slow: 0.5,
} as const;

export const SPRING = {
  /** Content settling into place: page sections, titles, letters. */
  content: { type: 'spring', stiffness: 320, damping: 28 },
  /** Interface chrome: navbar, dock, palette, pills, tooltips. */
  ui: { type: 'spring', stiffness: 400, damping: 32 },
} as const satisfies Record<string, Transition>;

/** A timed transition on the house curve. */
export const timed = (
  duration: number = DURATION.base,
  delay = 0,
): Transition => ({ duration, delay, ease: EASE_OUT });

// ─── Variants ────────────────────────────────────────────────────────────────

/** Standard fade-up for individual items inside a stagger container. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: SPRING.content },
};

/** Stagger container — orchestrates children only; container itself has no opacity animation. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/**
 * Spread onto a section (with `variants={stagger}` or `fadeUp`) to play it
 * once as it scrolls into view. Everything below the first screen uses this.
 */
export const revealOnScroll = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-80px' },
} as const;
