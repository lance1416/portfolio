import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { AwardRow, EducationEntry } from '@/components/ResearchComponents';
import { Section } from '@/components/Section';
import { SkillPill } from '@/components/SkillPill';
import { awardsData, dissertationData, educationData } from '@/data/research';

export default function Research() {
  return (
    <Page>
      <PageHeader chapter="§ 03" title="Research" />

      <div className="space-y-24">
        <Section label="MSc dissertation" first>
          <h3 className="heading-feature max-w-[30ch]">
            {dissertationData.title}
          </h3>
          <p className="text-lead mt-6 max-w-[62ch]">
            {dissertationData.abstract}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {dissertationData.tags.map((tag) => (
              <SkillPill
                key={tag}
                skill={tag}
                activeColor="var(--color-accent)"
              />
            ))}
          </div>
        </Section>

        <Section label="Education">
          {educationData.map((item) => (
            <EducationEntry key={item.id} item={item} />
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
