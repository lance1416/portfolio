import { motion } from 'framer-motion';

export function SkillPill({ skill }: { skill: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex cursor-default items-center rounded-full glass px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      {skill}
    </motion.span>
  );
}
