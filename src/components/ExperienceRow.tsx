import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SkillPill } from '@/components/SkillPill';
import type { ExperienceItem } from '@/data/experience';

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export function ExperienceRow({ job }: { job: ExperienceItem }) {
  return (
    <motion.article
      variants={rowVariants}
      className="group relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 transition-all duration-500 md:hover:!opacity-100 md:group-hover/list:opacity-30"
    >
      {/* Liquid Glass Background */}
      <div className="absolute -inset-x-6 -inset-y-6 z-0 hidden rounded-[2rem] glass opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 scale-95 md:block" />

      {/* Left Column: Dates & Company */}
      <div className="z-10 md:col-span-1 pt-1">
        <p className="text-sm font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
          {job.period}
        </p>

        {/* Conditional rendering for the company link */}
        {job.link ? (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link mt-2 md:mt-4 inline-flex items-center gap-1 font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {job.company}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        ) : (
          <p className="mt-2 font-medium text-zinc-900 dark:text-zinc-100 md:mt-4 transition-colors group-hover:text-black dark:group-hover:text-white">
            {job.company}
          </p>
        )}
      </div>

      {/* Right Column: Role, Description, Skills */}
      <div className="z-10 md:col-span-3">
        {/* Role Title (High contrast Zinc instead of purple) */}
        <h3 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 transition-colors duration-300 group-hover:text-zinc-950 dark:group-hover:text-white">
          {job.role}
        </h3>

        {/* Bullet Points */}
        <ul className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
          {job.description.map((point, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: pre-defined, does not change dynamically
            <li key={index} className="flex items-start gap-4">
              <svg
                className="mt-2.5 h-1.5 w-1.5 shrink-0 fill-zinc-300 dark:fill-zinc-700 transition-colors duration-300 group-hover:fill-zinc-500 dark:group-hover:fill-zinc-400"
                viewBox="0 0 6 6"
                aria-hidden="true"
              >
                <circle cx="3" cy="3" r="3"></circle>
              </svg>
              <span className="leading-relaxed transition-colors duration-300 group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* Skills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <SkillPill key={skill} skill={skill} />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
