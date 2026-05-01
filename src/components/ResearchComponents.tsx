import { motion, type Variants } from 'framer-motion';
import { Award, GraduationCap } from 'lucide-react';
import type { AwardItem, EducationItem } from '@/data/research';

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export function EducationCard({ item }: { item: EducationItem }) {
  return (
    <motion.article
      variants={itemVariants}
      className="group relative flex h-full flex-col justify-between rounded-3xl border border-zinc-200 bg-white/50 p-8 transition-all duration-500 md:hover:!opacity-100 md:group-hover/grid:opacity-40 dark:border-zinc-800 dark:bg-zinc-900/30"
    >
      {/* Liquid Glass Background */}
      <div className="absolute -inset-x-2 -inset-y-2 z-0 hidden rounded-[2.5rem] glass opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 scale-95 md:block" />

      <div className="z-10 relative">
        <GraduationCap className="mb-6 h-8 w-8 text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-100" />
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {item.institution}
        </h3>
        <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {item.degree}
        </p>
        <p className="mt-1 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
          {item.period}
        </p>
      </div>

      <ul className="z-10 relative mt-8 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
        {item.details.map((detail, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: pre-defined, does not change dynamically
          <li key={i} className="flex items-start gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-300 transition-colors group-hover:bg-zinc-500 dark:bg-zinc-700 dark:group-hover:bg-zinc-500" />
            <span className="leading-relaxed transition-colors group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
              {detail}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function AwardRow({ award }: { award: AwardItem }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group flex items-center justify-between border-b border-zinc-200/60 py-4 last:border-0 dark:border-zinc-800/60 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      <div className="flex items-center gap-4">
        <Award className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-100" />
        <div>
          <p className="font-bold text-zinc-900 transition-colors dark:text-zinc-50">
            {award.title}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {award.issuer}
          </p>
        </div>
      </div>
      <span className="text-sm font-medium tracking-widest text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-100">
        {award.year}
      </span>
    </motion.div>
  );
}
