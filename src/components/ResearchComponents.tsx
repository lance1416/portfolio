import type { AwardItem, EducationItem } from '@/data/research';
import { cn } from '@/utils/cn';
import { DashList } from './DashList';
import { RAIL_GRID } from './Page';

/** Rows in a Research section: hairline between, none above the first. */
const ROW = 'border-t border-zinc-200 first:border-t-0 dark:border-zinc-800';

/**
 * A degree, laid out like a role on Experience: crest and dates in the rail,
 * institution, degree and details beside them.
 */
export function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <article
      className={cn(RAIL_GRID, ROW, 'group gap-5 py-12 first:pt-0 last:pb-0')}
    >
      <div className="flex items-center gap-4 md:block">
        {item.logoUrl && (
          <img
            src={item.logoUrl}
            alt={`${item.institution} coat of arms`}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            // Greyed until the entry is hovered, then in its own colours.
            className="h-12 w-12 shrink-0 object-contain opacity-40 grayscale transition-[opacity,filter] duration-300 ease-out group-hover:opacity-90 group-hover:grayscale-0 md:mb-4"
          />
        )}
        <p className="font-mono text-xs tabular-nums text-zinc-700 dark:text-zinc-300">
          {item.period}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {item.institution}
        </p>
        <h3 className="heading-entry mt-1">{item.degree}</h3>
        <DashList items={item.details} className="mt-5" />
      </div>
    </article>
  );
}

/** An award: year in the rail, title and issuer beside it. */
export function AwardRow({ award }: { award: AwardItem }) {
  return (
    <div className={cn(RAIL_GRID, ROW, 'gap-1 py-5 first:pt-0 last:pb-0')}>
      <p className="font-mono text-xs tabular-nums text-zinc-700 md:pt-0.5 dark:text-zinc-300">
        {award.year}
      </p>
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {award.title}
        </p>
        <p className="mono-meta mt-1">{award.issuer}</p>
      </div>
    </div>
  );
}
