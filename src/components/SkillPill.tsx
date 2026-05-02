import { motion } from 'framer-motion';

// 1. Explicitly define the props interface
interface SkillPillProps {
  skill: string;
  activeColor?: string;
}

export function SkillPill({ skill, activeColor }: SkillPillProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      // 2. Map the dynamic color to a CSS variable
      style={
        { '--hover-color': activeColor || '#71717a' } as React.CSSProperties
      }
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex cursor-default items-center rounded-full glass px-3 py-1 font-mono text-xs font-medium text-zinc-600 border border-zinc-200/50 hover:border-[var(--hover-color)] transition-colors dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-[var(--hover-color)] hover:text-zinc-900 dark:hover:text-zinc-100"
    >
      {skill}
    </motion.span>
  );
}
