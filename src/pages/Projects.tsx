import { motion, useReducedMotion } from 'motion/react';
import { PageHeader } from '@/components/PageHeader';
import { ProjectRing } from '@/components/ProjectRing';
import { ProjectStrip } from '@/components/ProjectStrip';
import { projectsData } from '@/data/projects';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePageEntrance } from '@/utils/pageTransition';
import { stagger } from '@/utils/variants';

export default function Projects() {
  const entrance = usePageEntrance();
  // The one-screen 3D ring needs a landscape screen with room for two columns
  // and ~740px of height (its content plus the navbar and dock), which covers
  // MacBooks (~790px tall in Safari) and landscape iPads. Phones, portrait
  // tablets, short windows and reduced motion get a regular page with a swipe
  // strip instead.
  const roomyScreen = useMediaQuery(
    '(min-width: 1024px) and (min-height: 740px) and (orientation: landscape)',
  );
  const prefersReducedMotion = useReducedMotion();

  if (roomyScreen && !prefersReducedMotion) {
    return <ProjectRing projects={projectsData} />;
  }

  return (
    <motion.main
      variants={stagger}
      initial={entrance}
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      <PageHeader chapter="§ 02" title="Projects" />
      <ProjectStrip projects={projectsData} />
    </motion.main>
  );
}
