import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp, revealOnScroll, stagger } from '@/utils/variants';

/**
 * A titled block of a page: a mono overline over a hairline, then content.
 * Sections below the first screen reveal as they scroll in; `first` plays
 * with the page's own entrance instead.
 */
export function Section({
  label,
  meta,
  first = false,
  className,
  children,
}: {
  label: string;
  /** Right-aligned note on the label line, e.g. a year range. */
  meta?: ReactNode;
  first?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      variants={stagger}
      {...(first ? {} : revealOnScroll)}
      className={className}
    >
      <motion.div
        variants={fadeUp}
        className="flex items-baseline justify-between gap-4 border-b border-zinc-200 pb-3 dark:border-zinc-800"
      >
        <h2 className="label-overline">{label}</h2>
        {meta && <span className="mono-meta">{meta}</span>}
      </motion.div>
      <motion.div variants={fadeUp} className="mt-8">
        {children}
      </motion.div>
    </motion.section>
  );
}
