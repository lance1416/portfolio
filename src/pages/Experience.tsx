import { motion } from 'framer-motion';
import { ExperienceRow } from '@/components/ExperienceRow';
import { PageHeader } from '@/components/PageHeader';
import { experienceData } from '@/data/experience';
import { stagger } from '@/utils/variants';

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

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {experienceData.map((job) => (
          <ExperienceRow key={job.id} job={job} />
        ))}
      </motion.div>
    </motion.main>
  );
}
