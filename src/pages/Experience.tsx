import { motion } from 'motion/react';
import { ExperienceEntry } from '@/components/ExperienceEntry';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { experienceData } from '@/data/experience';
import { fadeUp } from '@/utils/variants';

export default function Experience() {
  return (
    <Page>
      <PageHeader chapter="§ 01" title="Experience" />

      <motion.div variants={fadeUp}>
        <ExperienceTimeline jobs={experienceData} />
      </motion.div>

      <div className="mt-12">
        {experienceData.map((job) => (
          <ExperienceEntry key={job.id} job={job} />
        ))}
      </div>
    </Page>
  );
}
