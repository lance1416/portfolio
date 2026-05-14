import { motion } from 'framer-motion';
import { PageHeader } from '@/components/PageHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { projectsData } from '@/data/projects';
import { stagger } from '@/utils/variants';

export default function Projects() {
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

      <div>
        {projectsData.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </motion.main>
  );
}
