import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SocialButtonProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export function SocialButton({ href, icon, label }: SocialButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      // Spring physics for hover and tap
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md text-zinc-600 shadow-sm dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-50 hover:text-zinc-900"
    >
      {icon}
    </motion.a>
  );
}
