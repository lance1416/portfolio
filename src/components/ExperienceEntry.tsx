import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { type ExperienceItem, roleSpan } from '@/data/experience';
import { cn } from '@/utils/cn';
import { formatDuration, formatPeriod } from '@/utils/months';
import { fadeUp, revealOnScroll } from '@/utils/variants';
import { DashList } from './DashList';
import { RAIL_GRID } from './Page';
import { SkillPill } from './SkillPill';

export function ExperienceEntry({ job }: { job: ExperienceItem }) {
  const { months } = roleSpan(job);
  const [lead, ...details] = job.description;

  return (
    <motion.article
      id={job.id}
      variants={fadeUp}
      {...revealOnScroll}
      // Focus target for the timeline's jump links; not in the tab order.
      tabIndex={-1}
      className={cn(
        RAIL_GRID,
        'role-scope scroll-mt-32 gap-5 border-t border-zinc-200 py-12 outline-none dark:border-zinc-800',
      )}
      style={{ '--role-base': job.color } as CSSProperties}
    >
      {/* Date rail: the swatch matches this role's bar in the timeline; sticky
          on desktop so the dates stay in view through a long entry. */}
      <div className="flex items-baseline gap-3 md:sticky md:top-32 md:block md:self-start">
        <span
          aria-hidden="true"
          className="block h-1.5 w-8 shrink-0 self-center rounded-full bg-(--role) md:mb-4"
        />
        <p className="font-mono text-xs tabular-nums text-zinc-700 dark:text-zinc-300">
          {formatPeriod(job.start, job.end)}
        </p>
        <p className="mono-meta md:mt-1">{formatDuration(months)}</p>
      </div>

      <div className="min-w-0">
        {job.link ? (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            // after: widens the small text to a ~40px hit area
            className="relative inline-flex items-center gap-0.5 text-sm text-zinc-500 transition-colors after:absolute after:-inset-x-2 after:-inset-y-2.5 hover:text-(--role-text) dark:text-zinc-400"
          >
            {job.company}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {job.company}
          </p>
        )}

        <h2 className="heading-entry mt-1">{job.role}</h2>

        <p className="text-lead mt-5 max-w-[62ch]">{lead}</p>

        {details.length > 0 && <DashList items={details} className="mt-4" />}

        <div className="mt-6 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <SkillPill key={skill} skill={skill} activeColor="var(--role)" />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
