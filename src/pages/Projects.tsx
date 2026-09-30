import { motion, useReducedMotion } from 'motion/react';
import { PageHeader } from '@/components/PageHeader';
import { ProjectRing } from '@/components/ProjectRing';
import { ProjectStrip } from '@/components/ProjectStrip';
import { projectsData } from '@/data/projects';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { stagger } from '@/utils/variants';

export default function Projects() {
  // The one-screen 3D ring needs room; small or short screens and reduced
  // motion get a regular page with a swipe strip instead.
  const roomyScreen = useMediaQuery(
    '(min-width: 768px) and (min-height: 800px)',
  );
  const prefersReducedMotion = useReducedMotion();

  if (roomyScreen && !prefersReducedMotion) {
    return <ProjectRing projects={projectsData} />;
  }

  return (
    <motion.main
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      <PageHeader
        chapter="§ 02"
        title="Projects"
        subtitle="Engineering challenges spanning low-level systems to multidisciplinary game design."
      />
      <ProjectStrip projects={projectsData} />
    </motion.main>
  );
}
