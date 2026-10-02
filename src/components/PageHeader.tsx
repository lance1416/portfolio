import { motion } from 'motion/react';
import { cn } from '@/utils/cn';
import { DURATION, fadeUp, timed } from '@/utils/variants';
import { RollLine, useTurnRoll } from './RollLine';

interface PageHeaderProps {
  chapter: string;
  title: string;
  /** Less space below, for a one-screen page (the Projects ring). */
  compact?: boolean;
}

export function PageHeader({
  chapter,
  title,
  compact = false,
}: PageHeaderProps) {
  const num = chapter.replace('§ ', '');
  // After a page turn the title and ghost number roll in like an odometer;
  // first load keeps the header's fade-up instead.
  const from = useTurnRoll();

  return (
    // min-h fits the 9rem ghost number, which is taller than the title block
    <motion.header
      variants={fadeUp}
      className={cn(
        'relative overflow-hidden',
        // Compact takes the short-screen proportions everywhere.
        compact ? 'mb-4 min-h-24' : 'mb-16 min-h-36 short:mb-8 short:min-h-24',
      )}
    >
      {/* Decorative ghost number — editorial depth */}
      <motion.span
        aria-hidden="true"
        initial={from ? { y: from, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={timed(DURATION.slow, 0.12)}
        className={cn(
          'pointer-events-none absolute right-0 top-0 select-none font-display font-bold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.04]',
          compact ? 'text-[6rem]' : 'text-[9rem] short:text-[6rem]',
        )}
      >
        {num}
      </motion.span>

      <p className="label-overline mb-4">{chapter}</p>
      <h1 className="heading-page">
        <RollLine>{title}</RollLine>
      </h1>
    </motion.header>
  );
}
