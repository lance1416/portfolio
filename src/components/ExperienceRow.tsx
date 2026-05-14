import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ExperienceItem } from '@/data/experience';
import { fadeUp } from '@/utils/variants';
import { NumberedList } from './NumberedList';
import { SkillPill } from './SkillPill';

export function ExperienceRow({ job }: { job: ExperienceItem }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group relative border-b border-zinc-200 py-10 pl-3 first:border-t dark:border-zinc-800"
    >
      {/* Accent left-border reveal on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100"
        style={{ backgroundColor: job.color ?? 'var(--color-accent)' }}
      />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {job.link ? (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline label-overline mb-2 inline-flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {job.company}
              <ArrowUpRight className="h-2.5 w-2.5" />
            </a>
          ) : (
            <p className="label-overline mb-2">{job.company}</p>
          )}
          <h3 className="font-display text-2xl font-normal text-zinc-900 dark:text-zinc-50">
            {job.role}
          </h3>
        </div>

        <div className="mt-1 flex shrink-0 items-center gap-3 sm:mt-0">
          {job.isActive && (
            <span className="label-overline text-accent">Active</span>
          )}
          <span className="mono-meta whitespace-nowrap">{job.period}</span>
        </div>
      </div>

      <NumberedList items={job.description} className="mb-6" />

      <div className="flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <SkillPill
            key={skill}
            skill={skill}
            activeColor={job.isActive ? job.color : undefined}
          />
        ))}
      </div>
    </motion.article>
  );
}
