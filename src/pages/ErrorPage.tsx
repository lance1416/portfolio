import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  // Determine the error message
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    errorMessage =
      error.statusText ||
      error.data?.message ||
      'An unexpected routing error occurred.';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unknown technical error occurred.';
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-zinc-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
          <AlertCircle className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Systems Error
        </h1>

        <p className="mt-4 text-zinc-600 dark:text-zinc-400 prose-academic">
          The application encountered an unexpected exception while processing
          your request.
        </p>

        {/* Technical details box */}
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-100/50 p-4 text-left font-mono text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
          <p className="uppercase tracking-widest opacity-50 mb-2">Error Log</p>
          <p className="break-all">{errorMessage}</p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-apple-lg transition-all hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-950"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Application
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Return Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
