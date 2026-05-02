import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        {/* Large stylized 404 */}
        <h1 className="text-9xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800/50">
          404
        </h1>

        <div className="relative -mt-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Page not found
          </h2>
          <p className="mt-4 mx-auto max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            The page you are looking for doesn't exist or has been moved to a
            new digital coordinate.
          </p>
        </div>

        <motion.div
          className="mt-10"
          whileHover={{ x: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-apple-lg transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
