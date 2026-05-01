import { motion, type Variants } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { projectsData } from '@/data/projects';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Projects() {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-5xl px-6" // Slightly wider container than Experience for the side-by-side layout
    >
      <header className="mb-20 text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Selected Projects
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Engineering challenges spanning low-level operating systems to
          multidisciplinary game design.
        </p>
      </header>

      {/* Project Showcase List */}
      <div className="space-y-12 divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
        {projectsData.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </motion.main>
  );
}
