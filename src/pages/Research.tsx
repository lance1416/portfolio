import { motion, type Variants } from 'framer-motion';
import { Microscope } from 'lucide-react';
import {
  AwardRow,
  EducationCard,
  itemVariants,
} from '@/components/ResearchComponents';
import { SkillPill } from '@/components/SkillPill';
import { awardsData, dissertationData, educationData } from '@/data/research';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function Research() {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      <header className="mb-20 text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Research & Education
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Academic background and current investigations in quantum computation.
        </p>
      </header>

      <div className="space-y-24">
        {/* SECTION 1: Dissertation Spotlight */}
        <section>
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 sm:p-12 transition-all duration-500 hover:shadow-apple-lg dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:shadow-none"
          >
            {/* Soft background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-zinc-800/20" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-sm font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                <Microscope className="h-5 w-5" />
                <span>Current Dissertation</span>
              </div>

              <h2 className="mt-6 text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl transition-colors duration-300">
                {dissertationData.title}
              </h2>

              {/* Note: the abstract uses your 'prose-academic' styling for high legibility */}
              <p className="mt-8 prose-academic max-w-3xl">
                {dissertationData.abstract}
              </p>

              <div className="mt-10 flex flex-wrap gap-2">
                {dissertationData.tags.map((tag) => (
                  <SkillPill key={tag} skill={tag} />
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: Education Bento Grid */}
        <section>
          <motion.h2
            variants={itemVariants}
            className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Academic Background
          </motion.h2>
          <div className="group/grid grid grid-cols-1 gap-6 sm:grid-cols-2">
            {educationData.map((item) => (
              <EducationCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* SECTION 3: Awards & Honours */}
        <section>
          <motion.h2
            variants={itemVariants}
            className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Awards & Honours
          </motion.h2>
          <div className="rounded-3xl border border-zinc-200 bg-white/50 px-6 py-2 dark:border-zinc-800 dark:bg-zinc-900/30">
            {awardsData.map((award) => (
              <AwardRow key={award.id} award={award} />
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
