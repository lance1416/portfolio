import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ExperienceItem } from '@/data/experience';
import { SkillPill } from './SkillPill';

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export function ExperienceRow({ job }: { job: ExperienceItem }) {
  return (
    <motion.article
      variants={rowVariants}
      className="group/item relative flex gap-6 md:gap-8 transition-all duration-500 md:hover:opacity-100! md:group-hover/list:opacity-40"
    >
      {/* 1. The Timeline Node */}
      <div className="relative z-20 mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-950 md:mt-6 md:h-12 md:w-12">
        {/* The Dot */}
        <div
          className="h-2.5 w-2.5 rounded-full ring-4 ring-zinc-50 transition-transform duration-500 group-hover/item:scale-150 dark:ring-zinc-950"
          style={{ backgroundColor: job.isActive ? job.color : '#a1a1aa' }}
        />

        {/* The New Soft Pulse (Replaces the old animate-ping div) */}
        {job.isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: job.color }}
            animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </div>

      {/* 2. The Content Card */}
      <div className="relative flex-1 overflow-hidden rounded-4xl border border-transparent p-6 transition-all duration-500 group-hover/item:border-zinc-200/60 group-hover/item:bg-white/40 group-hover/item:shadow-apple dark:group-hover/item:border-zinc-700/50 dark:group-hover/item:bg-zinc-900/40 md:p-8">
        {/* The Constrained Aura Glow (Only visible on hover) */}
        <div
          className="absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full blur-[100px] opacity-0 transition-opacity duration-700 group-hover/item:opacity-20 pointer-events-none"
          style={{ backgroundColor: job.color || '#71717a' }}
        />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header: Role, Company & Period */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {job.role}
              </h3>

              {/* Company with Link */}
              {job.link ? (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link mt-2 inline-flex items-center gap-1 font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {job.company}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              ) : (
                <p className="mt-2 font-medium text-zinc-600 dark:text-zinc-400">
                  {job.company}
                </p>
              )}
            </div>

            {/* Period encapsulated in a sleek badge */}
            <div className="shrink-0">
              <span className="inline-flex rounded-full border border-zinc-200/60 bg-white/50 px-3 py-1 font-mono text-xs font-medium text-zinc-500 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400">
                {job.period}
              </span>
            </div>
          </div>

          {/* Description */}
          <ul className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
            {job.description.map((point, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: pre-defined, does not change dynamically
              <li key={index} className="flex items-start gap-4">
                <svg
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 transition-colors duration-300"
                  viewBox="0 0 6 6"
                  style={{ fill: job.isActive ? job.color : '#d4d4d8' }}
                >
                  <title>{job.isActive ? 'Active Role' : 'Past Role'}</title>
                  <circle cx="3" cy="3" r="3"></circle>
                </svg>
                <span className="leading-relaxed group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-200 transition-colors">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* Skills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <SkillPill key={skill} skill={skill} activeColor={job.color} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
