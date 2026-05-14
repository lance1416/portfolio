import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface SkillPillProps {
  skill: string;
  activeColor?: string;
}

export function SkillPill({ skill, activeColor }: SkillPillProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      style={{ '--hover-color': activeColor ?? '#71717a' } as CSSProperties}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex cursor-default items-center rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-500 transition-colors hover:border-(--hover-color) hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      {skill}
    </motion.span>
  );
}
