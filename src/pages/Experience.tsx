import { motion } from 'motion/react';
import { ExperienceRow } from '@/components/ExperienceRow';
import { PageHeader } from '@/components/PageHeader';
import { experienceData } from '@/data/experience';
import { revealOnScroll, stagger } from '@/utils/variants';

export default function Experience() {
  return (
    <motion.main
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      <PageHeader
        chapter="§ 01"
        title="Experience"
        subtitle="A chronological record of professional and academic roles."
      />

      <motion.div variants={stagger} {...revealOnScroll}>
        {experienceData.map((job) => (
          <ExperienceRow key={job.id} job={job} />
        ))}
      </motion.div>
    </motion.main>
  );
}
