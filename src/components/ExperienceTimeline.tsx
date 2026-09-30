import { motion } from 'motion/react';
import type { CSSProperties, MouseEvent } from 'react';
import { type ExperienceItem, roleSpan } from '@/data/experience';
import {
  formatPeriod,
  monthName,
  nowMonthPosition,
  yearOf,
} from '@/utils/months';

/**
 * Jump to a role's entry. Handled manually because the router's
 * ScrollRestoration resets the scroll on a plain hash navigation. Focus moves
 * to the entry so keyboard users continue from there; scrollIntoView follows
 * the CSS scroll-behavior, which already respects reduced motion.
 */
function jumpToEntry(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const entry = document.getElementById(id);
  if (!entry) return;
  e.preventDefault();
  entry.focus({ preventScroll: true });
  entry.scrollIntoView();
  history.replaceState(history.state, '', `#${id}`);
}

/**
 * Horizontal time axis with one bar per role, placed by real start/end month,
 * so overlapping roles read at a glance. Each bar links to its entry below.
 */
export function ExperienceTimeline({ jobs }: { jobs: ExperienceItem[] }) {
  const now = nowMonthPosition();
  const spans = jobs.map((job) => roleSpan(job, now));

  // Axis runs from the January before the earliest role to the end of the
  // current month (or the latest end date, if that is later).
  const axisStart = yearOf(Math.min(...spans.map((s) => s.from))) * 12;
  const axisEnd = Math.max(Math.floor(now) + 1, ...spans.map((s) => s.to));
  const pct = (month: number) =>
    ((month - axisStart) / (axisEnd - axisStart)) * 100;

  const months = Array.from(
    { length: axisEnd - axisStart },
    (_, i) => axisStart + i,
  );
  const januaries = months.filter((m) => m % 12 === 0);

  return (
    <figure className="relative mb-4 select-none">
      <figcaption className="sr-only">
        Timeline of roles from {monthName(axisStart)} {yearOf(axisStart)} to now
      </figcaption>

      {/* Axis: ticks on month boundaries (taller at January, with the year);
          month initials centred within each month. */}
      <div aria-hidden="true" className="relative h-8">
        {months.map((m) => (
          <span
            key={`tick-${m}`}
            className={
              m % 12 === 0
                ? 'absolute bottom-0 h-3 w-px bg-zinc-400 dark:bg-zinc-500'
                : 'absolute bottom-0 h-1.5 w-px bg-zinc-300 dark:bg-zinc-700'
            }
            style={{ left: `${pct(m)}%` }}
          />
        ))}
        {januaries.map((m) => (
          <span
            key={`year-${m}`}
            className="absolute bottom-4 pl-1.5 font-mono text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400"
            style={{ left: `${pct(m)}%` }}
          >
            {yearOf(m)}
          </span>
        ))}
        {months
          .filter((m) => m % 12 !== 0)
          .map((m) => (
            <span
              key={`month-${m}`}
              className="absolute bottom-2.5 hidden -translate-x-1/2 font-mono text-[9px] text-zinc-400 sm:block dark:text-zinc-600"
              style={{ left: `${pct(m + 0.5)}%` }}
            >
              {monthName(m)[0]}
            </span>
          ))}
      </div>

      <div className="relative border-t border-zinc-300 pt-3 dark:border-zinc-700">
        {/* Year boundaries carried down through the rows */}
        {januaries.slice(1).map((m) => (
          <span
            key={`grid-${m}`}
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"
            style={{ left: `${pct(m)}%` }}
          />
        ))}

        {/* Today */}
        <div
          aria-hidden="true"
          className="absolute -top-8 bottom-0 w-px bg-accent/60"
          style={{ left: `${pct(now)}%` }}
        >
          <span className="absolute -top-1 right-1.5 whitespace-nowrap text-[11px] font-medium text-accent">
            Now
          </span>
        </div>

        <ol className="relative space-y-1">
          {jobs.map((job, i) => {
            const span = spans[i];
            const left = pct(span.from);
            const width = pct(span.to) - left;
            // Bars in the right half label from their end so text stays in view.
            const labelFromEnd = left > 50;

            return (
              <li key={job.id}>
                <a
                  href={`#${job.id}`}
                  onClick={(e) => jumpToEntry(e, job.id)}
                  aria-label={`${job.company}, ${formatPeriod(job.start, job.end)}: jump to details`}
                  className="role-scope group relative block h-11 rounded-sm outline-offset-4"
                  style={{ '--role-base': job.color } as CSSProperties}
                >
                  <span
                    className="absolute top-1 whitespace-nowrap text-xs font-medium text-zinc-600 transition-colors group-hover:text-(--role) dark:text-zinc-400"
                    style={
                      labelFromEnd
                        ? { right: `${100 - left - width}%` }
                        : { left: `${left}%` }
                    }
                  >
                    {job.label}
                  </span>
                  <motion.span
                    className="absolute bottom-2 h-2 origin-left rounded-full bg-(--role) transition-[height] duration-150 ease-out group-hover:h-2.5"
                    style={{ left: `${left}%`, width: `${width}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.25 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}
