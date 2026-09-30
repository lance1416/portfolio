import { motion } from 'motion/react';
import { fadeUp } from '@/utils/variants';

interface PageHeaderProps {
  chapter: string;
  title: string;
  subtitle: string;
}

export function PageHeader({ chapter, title, subtitle }: PageHeaderProps) {
  const num = chapter.replace('§ ', '');

  return (
    <motion.header variants={fadeUp} className="relative mb-16 overflow-hidden">
      {/* Decorative ghost number — editorial depth */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 select-none font-display text-[9rem] font-bold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.04]"
      >
        {num}
      </span>

      <p className="label-overline mb-4">{chapter}</p>
      <h1 className="font-display text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-lg text-base text-zinc-500 dark:text-zinc-400">
        {subtitle}
      </p>
    </motion.header>
  );
}
