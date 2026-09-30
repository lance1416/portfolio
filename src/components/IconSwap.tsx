import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

const HIDDEN = { opacity: 0, scale: 0.25, filter: 'blur(4px)' };
const SHOWN = { opacity: 1, scale: 1, filter: 'blur(0px)' };

/**
 * Cross-fades its child whenever `swapKey` changes (e.g. Copy → Check).
 * Skips the animation on first render.
 */
export function IconSwap({
  swapKey,
  children,
}: {
  swapKey: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={swapKey}
        className="inline-flex"
        initial={HIDDEN}
        animate={SHOWN}
        exit={HIDDEN}
        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
