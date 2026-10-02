import type { AwardItem, EducationItem } from '@/data/research';
import { DashList } from './DashList';

/** A degree, laid out like a role on the Experience page. */
export function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <article className="group border-t border-zinc-200 py-12 first:border-t-0 first:pt-0 last:pb-0 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {item.institution}
          </p>
          <h3 className="heading-entry mt-1">{item.degree}</h3>
          <p className="mono-meta mt-2">{item.period}</p>
        </div>

        {/* Coat of arms — greyed until hover */}
        {item.logoUrl && (
          <img
            src={item.logoUrl}
            alt={`${item.institution} coat of arms`}
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            className="h-14 w-14 shrink-0 object-contain opacity-30 grayscale transition-[opacity,filter] duration-300 ease-out group-hover:opacity-70 group-hover:grayscale-0"
          />
        )}
      </div>

      <DashList items={item.details} className="mt-5" />
    </article>
  );
}

export function AwardRow({ award }: { award: AwardItem }) {
  return (
    <div className="flex items-baseline justify-between gap-8 border-t border-zinc-200 py-5 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {award.title}
        </p>
        <p className="mono-meta mt-1">{award.issuer}</p>
      </div>
      <span className="mono-meta shrink-0">{award.year}</span>
    </div>
  );
}
