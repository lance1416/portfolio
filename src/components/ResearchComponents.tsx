import { motion } from 'framer-motion';
import type * as React from 'react';
import type { AwardItem, EducationItem } from '@/data/research';
import { cn } from '@/utils/cn';
import { fadeUp } from '@/utils/variants';

export function EducationCard({ item }: { item: EducationItem }) {
  const accentColor = item.color ?? '#71717a';

  return (
    <motion.article
      variants={fadeUp}
      className="group border-b border-zinc-200 py-10 first:border-t dark:border-zinc-800"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: institution details */}
        <div className="flex-1">
          {item.isActive && (
            <p className="label-overline mb-2 text-accent">Current</p>
          )}
          <h3 className="font-display text-2xl font-normal text-zinc-900 dark:text-zinc-50">
            {item.institution}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {item.degree}
          </p>
          <p className="mt-1 mono-meta">{item.period}</p>

          <ul className="mt-6 space-y-2.5">
            {item.details.map((detail) => (
              <li
                key={detail}
                className={cn(
                  'border-l-2 pl-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400',
                  item.isActive
                    ? 'border-accent'
                    : 'border-zinc-200 dark:border-zinc-700',
                )}
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: coat of arms — grayscale until hover */}
        {item.logoUrl && (
          <div className="shrink-0">
            <img
              src={item.logoUrl}
              alt={`${item.institution} seal`}
              className="h-20 w-20 object-contain opacity-20 grayscale transition-[opacity,filter] duration-500 group-hover:opacity-60 group-hover:grayscale-0"
              style={{ '--accent': accentColor } as React.CSSProperties}
            />
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function AwardRow({ award }: { award: AwardItem }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-baseline justify-between border-b border-zinc-200/60 py-4 last:border-0 dark:border-zinc-800/60"
    >
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {award.title}
        </p>
        <p className="mono-meta mt-0.5">{award.issuer}</p>
      </div>
      <span className="mono-meta ml-8 shrink-0">{award.year}</span>
    </motion.div>
  );
}
