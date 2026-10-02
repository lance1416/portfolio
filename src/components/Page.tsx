import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { usePageEntrance } from '@/utils/pageTransition';
import { stagger } from '@/utils/variants';

/** The column every page sits in: the same width and gutters as the footer. */
export const PAGE_COLUMN = 'mx-auto w-full max-w-5xl px-6 sm:px-8';

/**
 * An entry with a metadata rail: dates, places and marks in a 10rem column
 * on the left from md up, the entry itself on the right. Experience and
 * Research share it, so their rails line up page to page. Callers add the
 * stacked (mobile) gap they need.
 */
export const RAIL_GRID = 'grid md:grid-cols-[10rem_1fr] md:gap-10';

/**
 * A page's `<main>`: the shared column, plus the stagger that plays its
 * children's entrances on first load (skipped after a page turn, which
 * animates the page in already).
 */
export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const entrance = usePageEntrance();
  return (
    <motion.main
      variants={stagger}
      initial={entrance}
      animate="show"
      className={cn(PAGE_COLUMN, className)}
    >
      {children}
    </motion.main>
  );
}
