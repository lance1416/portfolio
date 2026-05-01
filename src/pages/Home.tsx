import { motion, type Variants } from 'framer-motion';
import { ArrowRight, BookOpen, Cpu } from 'lucide-react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { SocialButton } from '../components/SocialButton';
import { StatusBadge } from '../components/StatusBadge';

// Animation configurations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function Home() {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl px-6"
    >
      {/* Hero Section */}
      <section className="text-center pt-12">
        <motion.div variants={itemVariants}>
          <StatusBadge
            icon={<BookOpen className="h-4 w-4" />}
            text="Oxford MSc Advanced Computer Science Candidate"
            className="mb-8"
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl font-bold tracking-tight sm:text-7xl"
        >
          Bridging quantum theory <br className="hidden sm:block" />
          <span className="text-zinc-400 dark:text-zinc-500">
            and production systems.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-8 prose-academic"
        >
          I am a systems engineer and researcher currently investigating quantum
          decodability using ZX-calculus. I specialize in bridging the gap
          between theoretical mathematics, low-level systems programming, and
          scalable full-stack product development.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/experience"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-apple-lg dark:bg-zinc-100 dark:text-zinc-950"
              >
                View Experience
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/resume.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-white/80 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
                rel="noopener"
              >
                Read CV
              </a>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 sm:border-l sm:border-zinc-300/50 sm:pl-6 dark:sm:border-zinc-700/50">
            <SocialButton
              href="https://github.com/lance1416"
              icon={<FaGithub className="h-5 w-5" />}
              label="GitHub"
            />
            <SocialButton
              href="https://linkedin.com/in/sinanli"
              icon={<FaLinkedin className="h-5 w-5" />}
              label="LinkedIn"
            />
            <SocialButton
              href="mailto:lanceli1416@gmail.com"
              icon={<FaEnvelope className="h-5 w-5" />}
              label="Email"
            />
          </div>
        </motion.div>
      </section>

      {/* Current Focus / Highlights Section */}
      <motion.section
        variants={itemVariants}
        className="mt-32 border-t border-zinc-200/50 pt-16 dark:border-zinc-800/50"
      >
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Current Focus
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* Highlight 1 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="group rounded-3xl glass p-8 transition-shadow hover:shadow-apple-lg hover:bg-white/80 dark:hover:bg-zinc-800/60"
          >
            <Cpu className="h-8 w-8 text-zinc-400 dark:text-zinc-500 mb-6 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Quantum Research
            </h3>
            <p className="mt-3 font-serif text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Investigating the effect of fault-equivalence rewrites on quantum
              decodability using ZX-calculus under Professor Aleks Kissinger.
            </p>
          </motion.div>

          {/* Highlight 2 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="group rounded-3xl glass p-8 transition-shadow hover:shadow-apple-lg hover:bg-white/80 dark:hover:bg-zinc-800/60"
          >
            <BookOpen className="h-8 w-8 text-zinc-400 dark:text-zinc-500 mb-6 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              IQBank Engineering
            </h3>
            <p className="mt-3 font-serif text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Co-founding and leading development for a TypeScript & PostgreSQL
              study platform, serving an active beta user base of over 100
              students.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
}
