import { motion } from 'motion/react';
import { PageHeader } from '@/components/PageHeader';
import { AwardRow, EducationCard } from '@/components/ResearchComponents';
import { SkillPill } from '@/components/SkillPill';
import { awardsData, dissertationData, educationData } from '@/data/research';
import { useBalancedText } from '@/hooks/useBalancedText';
import { fadeUp, revealOnScroll, stagger } from '@/utils/variants';

export default function Research() {
  const { ref: titleRef, style: titleStyle } =
    useBalancedText<HTMLHeadingElement>();

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
        subtitle="Academic background and research in quantum computation."
      />

      <div className="space-y-24">
        {/* Dissertation — journal abstract style */}
        <motion.section variants={fadeUp}>
          <p className="label-overline mb-8">MSc Dissertation</p>

          <div className="border-l-2 border-accent pl-6">
            <h2
              ref={titleRef}
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
        <motion.div variants={stagger} {...revealOnScroll}>
          <motion.p variants={fadeUp} className="label-overline mb-0">
            Academic Background
          </motion.p>
          <div>
            {educationData.map((item) => (
              <EducationCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>

        {/* Awards & Honours */}
        <motion.div variants={stagger} {...revealOnScroll}>
          <motion.p variants={fadeUp} className="label-overline mb-6">
            Awards & Honours
          </motion.p>
          <div className="border-t border-zinc-200 dark:border-zinc-800">
            {awardsData.map((award) => (
              <AwardRow key={award.id} award={award} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
