import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { usePageTransition } from '@/utils/pageTransition';
import { DURATION, timed } from '@/utils/variants';

/**
 * Where a page's big type rolls in from after a page turn — up from below
 * when turning forward, down from above when turning back — or `null` on
 * first load, where the page's own fade-up plays instead.
 */
export function useTurnRoll() {
  const { entrance, direction } = usePageTransition();
  if (entrance !== false) return null;
  return direction === 'forward' ? '100%' : '-100%';
}

/**
 * One line of display type that rolls into place like an odometer after a
 * page turn. Every page's title uses it (PageHeader, Home's headline), so a
 * page turn always lands the same way.
 */
export function RollLine({
  children,
  delay = 0.06,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const from = useTurnRoll();
  return (
    // The mask clips the roll to the line box; the padding pair keeps
    // descenders inside it without shifting the layout.
    <span className="-mb-[0.2em] block overflow-clip pb-[0.2em]">
      <motion.span
        className="block"
        initial={from ? { y: from } : false}
        animate={{ y: 0 }}
        transition={timed(DURATION.slow, delay)}
      >
        {children}
      </motion.span>
    </span>
  );
}
