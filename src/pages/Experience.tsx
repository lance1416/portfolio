import { motion } from 'motion/react';
import { ExperienceEntry } from '@/components/ExperienceEntry';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { PageHeader } from '@/components/PageHeader';
import { experienceData } from '@/data/experience';
import { usePageEntrance } from '@/utils/pageTransition';
import { stagger } from '@/utils/variants';

export default function Experience() {
  const entrance = usePageEntrance();
  return (
    <motion.main
      variants={stagger}
      initial={entrance}
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      <PageHeader chapter="§ 01" title="Experience" />

      {/* The timeline bars are this page's one entrance animation; entries stay still. */}
      <ExperienceTimeline jobs={experienceData} />

      <div className="mt-12">
        {experienceData.map((job) => (
          <ExperienceEntry key={job.id} job={job} />
        ))}
      </div>
    </motion.main>
  );
}
