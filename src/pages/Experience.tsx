import { motion } from 'motion/react';
import { ExperienceEntry } from '@/components/ExperienceEntry';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { LateDesk } from '@/components/LateDesk';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { experienceData } from '@/data/experience';
import { fadeUp } from '@/utils/variants';

// The first role that's still going (no end date).
const current = experienceData.find((job) => !job.end);

export default function Experience() {
  return (
    <Page>
      <PageHeader chapter="§ 01" title="Experience" />

      <motion.div variants={fadeUp}>
        <ExperienceTimeline jobs={experienceData} />
      </motion.div>

      <div className="mt-12">
        {experienceData.map((job) => (
          <ExperienceEntry
            key={job.id}
            job={job}
            // The cat keeps the current role company, late at its desk.
            rail={job.id === current?.id && <LateDesk />}
          />
        ))}
      </div>
    </Page>
  );
}
