import { motion } from 'motion/react';
import { usePageTransition } from '@/utils/pageTransition';
import { fadeUp } from '@/utils/variants';

interface PageHeaderProps {
  chapter: string;
  title: string;
}

/** Odometer roll: a snappy settle, landing as the page turn does. */
const ROLL = { duration: 0.48, ease: [0.22, 1, 0.36, 1] } as const;

export function PageHeader({ chapter, title }: PageHeaderProps) {
  const num = chapter.replace('§ ', '');
  const { entrance, direction } = usePageTransition();

  // After a navigation, the title and ghost number roll into place like an
  // odometer: up from below when turning forward, down from above when
  // turning back. First load keeps the header's fade-up instead.
  const roll = entrance === false;
  const from = direction === 'forward' ? '100%' : '-100%';

  return (
    // min-h fits the 9rem ghost number, which is taller than the title block
    <motion.header
      variants={fadeUp}
      className="relative mb-16 min-h-36 overflow-hidden"
    >
      {/* Decorative ghost number — editorial depth */}
      <motion.span
        aria-hidden="true"
        initial={roll ? { y: from, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...ROLL, delay: 0.12 }}
        className="pointer-events-none absolute right-0 top-0 select-none font-display text-[9rem] font-bold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.04]"
      >
        {num}
      </motion.span>

      <p className="label-overline mb-4">{chapter}</p>
      <h1 className="font-display text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
        {/* The mask clips the roll to the line box; the padding pair keeps
            descenders inside it without shifting the layout. */}
        <span className="-mb-[0.2em] block overflow-clip pb-[0.2em]">
          <motion.span
            className="block"
            initial={roll ? { y: from } : false}
            animate={{ y: 0 }}
            transition={{ ...ROLL, delay: 0.06 }}
          >
            {title}
          </motion.span>
        </span>
      </h1>
    </motion.header>
  );
}
