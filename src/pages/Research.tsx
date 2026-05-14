import { motion } from 'framer-motion';
import type { RefObject } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { AwardRow, EducationCard } from '@/components/ResearchComponents';
import { SkillPill } from '@/components/SkillPill';
import {
  type AwardItem,
  awardsData,
  dissertationData,
  educationData,
} from '@/data/research';
import { useBalancedText } from '@/hooks/useBalancedText';
import { fadeUp, stagger } from '@/utils/variants';

export default function Research() {
  const { ref: titleRef, style: titleStyle } =
    useBalancedText<HTMLHeadingElement>(dissertationData.title);

  return (
    <motion.main
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      <PageHeader
        chapter="§ 03"
        title="Research"
        subtitle="Academic background and current investigations in quantum computation."
      />

      <div className="space-y-24">
        {/* Dissertation — journal abstract style */}
        <motion.section variants={fadeUp}>
          <p className="label-overline mb-8">Current Dissertation</p>

          <div className="border-l-2 border-accent pl-6">
            <h2
              ref={titleRef as RefObject<HTMLHeadingElement>}
              style={titleStyle}
              className="font-display text-3xl font-normal leading-snug text-zinc-900 dark:text-zinc-50 sm:text-4xl"
            >
              {dissertationData.title}
            </h2>
          </div>

          <div className="mt-8 border-l border-zinc-200 pl-6 dark:border-zinc-800">
            <p className="label-overline mb-3">Abstract</p>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {dissertationData.abstract}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {dissertationData.tags.map((tag) => (
              <SkillPill
                key={tag}
                skill={tag}
                activeColor="var(--color-accent)"
              />
            ))}
          </div>
        </motion.section>

        {/* Academic Background */}
        <section>
          <motion.p variants={fadeUp} className="label-overline mb-0">
            Academic Background
          </motion.p>
          <div>
            {educationData.map((item) => (
              <EducationCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Awards & Honours */}
        <section>
          <motion.p variants={fadeUp} className="label-overline mb-6">
            Awards & Honours
          </motion.p>
          <div className="border-t border-zinc-200 dark:border-zinc-800">
            {awardsData.map((award: AwardItem) => (
              <AwardRow key={award.id} award={award} />
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
