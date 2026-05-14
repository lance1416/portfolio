import { motion } from 'framer-motion';
import { fadeUp } from '@/utils/variants';

interface PageHeaderProps {
  chapter: string;
  title: string;
  subtitle: string;
}

export function PageHeader({ chapter, title, subtitle }: PageHeaderProps) {
  return (
    <motion.header variants={fadeUp} className="mb-16">
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
