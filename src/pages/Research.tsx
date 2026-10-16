import { Page, RAIL_GRID } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { RadcliffeCamera } from '@/components/RadcliffeCamera';
import { AwardRow, EducationEntry } from '@/components/ResearchComponents';
import { Section } from '@/components/Section';
import { SkillPill } from '@/components/SkillPill';
import { SurfaceCodeFigure } from '@/components/SurfaceCodeFigure';
import { awardsData, dissertationData, educationData } from '@/data/research';
import { cn } from '@/utils/cn';

export default function Research() {
  const { institution, year, supervisor, title, abstract, tags } =
    dissertationData;

  return (
    <Page>
      <PageHeader chapter="§ 03" title="Research" />

      <div className="space-y-16 sm:space-y-24">
        <Section label="MSc dissertation" first>
          <article className={cn(RAIL_GRID, 'gap-5')}>
            {/* The paper's front matter, in the same rail as every entry:
                the year set like Experience's dates, then the details. */}
            <div className="space-y-1">
              <p className="font-mono text-xs tabular-nums text-zinc-700 dark:text-zinc-300">
                {year}
              </p>
              <p className="mono-meta">{institution}</p>
              <p className="mono-meta">Supervised by {supervisor}</p>
            </div>

            <div className="min-w-0">
              <h3 className="heading-feature max-w-[30ch]">{title}</h3>
              <p className="text-lead mt-6 max-w-[62ch]">{abstract}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <SkillPill
                    key={tag}
                    skill={tag}
                    activeColor="var(--color-accent)"
                  />
                ))}
              </div>
              <SurfaceCodeFigure />
            </div>
          </article>
        </Section>

        <Section label="Education">
          {educationData.map((item) => (
            <EducationEntry
              key={item.id}
              item={item}
              // The cat waits out Oxford's drizzle in the Radcliffe Camera.
              rail={item.id === 'oxford' && <RadcliffeCamera />}
            />
          ))}
        </Section>

        <Section label="Awards & honours">
          {awardsData.map((award) => (
            <AwardRow key={award.id} award={award} />
          ))}
        </Section>
      </div>
    </Page>
  );
}
