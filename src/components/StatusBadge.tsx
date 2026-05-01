import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
  icon: ReactNode;
  text: string;
  className?: string;
}

export function StatusBadge({ icon, text, className }: StatusBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex cursor-default items-center gap-2 rounded-full border border-zinc-200 bg-white/40 px-3 py-1 text-sm font-medium text-zinc-600 shadow-sm backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-800/40 dark:text-zinc-300 dark:shadow-none',
        className,
      )}
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  );
}
