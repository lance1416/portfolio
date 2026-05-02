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

      {/* The Timeline Container */}
      <div className="group/list relative space-y-8 sm:space-y-12">
        {/* The Continuous Vertical Thread */}
        <div className="absolute bottom-0 left-[19px] top-6 w-px bg-zinc-200 dark:bg-zinc-800 md:left-[23px]" />

        {experienceData.map((job) => (
          <ExperienceRow key={job.id} job={job} />
        ))}
      </div>
    </motion.main>
  );
}
