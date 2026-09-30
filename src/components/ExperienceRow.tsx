import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { ExperienceItem } from '@/data/experience';
import { cn } from '@/utils/cn';
import { fadeUp } from '@/utils/variants';
import { NumberedList } from './NumberedList';
import { SkillPill } from './SkillPill';

export function ExperienceRow({ job }: { job: ExperienceItem }) {
  const accentColor = job.color ?? 'var(--color-accent)';

  return (
    <motion.article
      variants={fadeUp}
      className="group relative border-b border-zinc-200 py-10 pl-3 first:border-t dark:border-zinc-800"
      style={
        job.isActive
          ? { backgroundColor: `${job.color ?? '#6366f1'}14` }
          : undefined
      }
    >
      {/* Left border: always visible for active, hover-only for inactive */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 left-0 w-[3px] origin-top transition-transform duration-300 ease-out',
          job.isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100',
        )}
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {job.link ? (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              // after: widens the 10px label to a ~40px hit area
              className="link-underline label-overline relative mb-2 inline-flex items-center gap-1 transition-colors after:absolute after:-inset-x-2 after:-inset-y-3.5 hover:text-zinc-900 dark:hover:text-zinc-100"
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
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping"
                  style={{ backgroundColor: accentColor }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </span>
              <span className="label-overline" style={{ color: accentColor }}>
                Live
              </span>
            </span>
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
