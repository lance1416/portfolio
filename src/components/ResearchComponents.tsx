import { motion, type Variants } from 'framer-motion';
import { Award, GraduationCap } from 'lucide-react';
import type { AwardItem, EducationItem } from '@/data/research';

export const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export function EducationCard({ item }: { item: EducationItem }) {
  const accentColor = item.color || '#71717a';

  return (
    <motion.article
      variants={itemVariants}
      className="group/item relative flex gap-6 md:gap-8 transition-all duration-500 md:hover:opacity-100! md:group-hover/list:opacity-40"
    >
      {/* 1. The Timeline Node (Unchanged) */}
      <div className="relative z-20 mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-950 md:mt-6 md:h-12 md:w-12">
        <div
          className="h-2.5 w-2.5 rounded-full ring-4 ring-zinc-50 transition-transform duration-500 group-hover/item:scale-150 dark:ring-zinc-950"
          style={{ backgroundColor: item.isActive ? accentColor : '#a1a1aa' }}
        />
        {item.isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: accentColor }}
            animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </div>

      {/* 2. The Content Card */}
      <div className="relative flex-1 overflow-hidden rounded-4xl border border-transparent p-6 transition-all duration-500 group-hover/item:border-zinc-200/60 group-hover/item:bg-white/40 group-hover/item:shadow-apple dark:group-hover/item:border-zinc-700/50 dark:group-hover/item:bg-zinc-900/40 md:p-8">
        {/* Constrained Aura Glow */}
        <div
          className="absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full blur-[100px] opacity-0 transition-opacity duration-700 group-hover/item:opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Header Layout: Left (Text) vs Right (Seal & Date) */}
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
            {/* Left: Cap, Institution, Degree */}
            <div className="flex-1">
              <GraduationCap
                className="mb-5 h-6 w-6 text-zinc-400 transition-colors duration-500 group-hover/item:text-(--accent)!"
                style={{ '--accent': accentColor } as React.CSSProperties}
              />
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
                {item.institution}
              </h3>
              <p className="mt-2 text-lg font-medium text-zinc-600 dark:text-zinc-400">
                {item.degree}
              </p>
            </div>

            {/* Right: Date Badge & Large Coat of Arms */}
            <div className="flex shrink-0 flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-6 w-full sm:w-auto">
              {/* Date Badge */}
              <span className="inline-flex rounded-full border border-zinc-200/60 bg-white/50 px-3 py-1 text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400">
                {item.period}
              </span>

              {/* Scaled-up Coat of Arms */}
              {item.logoUrl && (
                <img
                  src={item.logoUrl}
                  alt={`${item.institution} Coat of Arms`}
                  // Scaled up to h-16/w-16 on mobile, h-20/w-20 on desktop
                  className="h-16 w-16 object-contain grayscale opacity-30 transition-all duration-700 group-hover/item:scale-110 group-hover/item:grayscale-0 group-hover/item:opacity-100 sm:h-20 sm:w-20"
                />
              )}
            </div>
          </div>

          {/* Details List */}
          <ul className="mt-2 space-y-4 text-zinc-600 dark:text-zinc-400">
            {item.details.map((detail, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: pre-defined, does not change dynamically
              <li key={i} className="flex items-start gap-4">
                <svg
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 transition-colors duration-300"
                  viewBox="0 0 6 6"
                  style={{ fill: item.isActive ? accentColor : '#d4d4d8' }}
                >
                  <title>
                    {item.isActive
                      ? 'Current Academic Pursuit'
                      : 'Past Academic Pursuit'}
                  </title>
                  <circle cx="3" cy="3" r="3"></circle>
                </svg>
                <span className="leading-relaxed transition-colors group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-200">
                  {detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
