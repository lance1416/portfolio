import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { type ExperienceItem, roleSpan } from '@/data/experience';
import { formatDuration, formatPeriod } from '@/utils/months';
import { SkillPill } from './SkillPill';

export function ExperienceEntry({ job }: { job: ExperienceItem }) {
  const { months } = roleSpan(job);
  const [lead, ...details] = job.description;

  return (
    <article
      id={job.id}
      // Focus target for the timeline's jump links; not in the tab order.
      tabIndex={-1}
      className="role-scope grid scroll-mt-32 outline-none gap-5 border-t border-zinc-200 py-12 md:grid-cols-[10rem_1fr] md:gap-10 dark:border-zinc-800"
      style={{ '--role-base': job.color } as CSSProperties}
    >
      {/* Date rail: the swatch matches this role's bar in the timeline; sticky
          on desktop so the dates stay in view through a long entry. */}
      <div className="flex items-baseline gap-3 md:sticky md:top-32 md:block md:self-start">
        <span
          aria-hidden="true"
          className="block h-1.5 w-8 shrink-0 self-center rounded-full bg-(--role) md:mb-4"
        />
        <p className="font-mono text-xs tabular-nums text-zinc-600 dark:text-zinc-300">
          {formatPeriod(job.start, job.end)}
        </p>
        <p className="text-xs text-zinc-500 md:mt-1 dark:text-zinc-400">
          {formatDuration(months)}
        </p>
      </div>

      <div className="min-w-0">
        {job.link ? (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            // after: widens the small text to a ~40px hit area
            className="relative inline-flex items-center gap-0.5 text-sm text-zinc-500 transition-colors after:absolute after:-inset-x-2 after:-inset-y-2.5 hover:text-(--role) dark:text-zinc-400"
          >
            {job.company}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {job.company}
          </p>
        )}

        <h2 className="mt-1 font-display text-3xl font-normal leading-tight text-zinc-900 dark:text-zinc-50">
          {job.role}
        </h2>

        <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {lead}
        </p>

        {details.length > 0 && (
          <ul className="mt-4 max-w-[62ch] space-y-2.5">
            {details.map((detail) => (
              <li
                key={detail}
                className="relative pl-4 text-sm leading-relaxed text-zinc-600 before:absolute before:left-0 before:text-(--role) before:content-['–'] dark:text-zinc-400"
              >
                {detail}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <SkillPill key={skill} skill={skill} activeColor="var(--role)" />
          ))}
        </div>
      </div>
    </article>
  );
}
