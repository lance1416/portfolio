import { motion, type Variants } from 'framer-motion';
import { ExperienceRow } from '@/components/ExperienceRow';
import { experienceData } from '@/data/experience';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function Experience() {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      <header className="mb-20 text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Experience
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          A chronological ledger of my professional and academic roles.
        </p>
      </header>

      {/* The group/list triggers the spotlight dimming effect on the children */}
      <div className="group/list space-y-12 sm:space-y-20">
        {experienceData.map((job) => (
          <ExperienceRow key={job.id} job={job} />
        ))}
      </div>
    </motion.main>
  );
}
