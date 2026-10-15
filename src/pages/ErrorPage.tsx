import { RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { type ComponentType, lazy, Suspense } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { fadeUp } from '@/utils/variants';

/**
 * The broken island, loaded on demand to keep it out of the main bundle.
 * This page may be up *because* a chunk failed to load (e.g. after a
 * deploy), so a failed load renders nothing rather than throwing again.
 */
const BrokenIsland = lazy<ComponentType>(() =>
  Promise.all([import('@/components/PixelScene'), import('@/scene/island')])
    .then(([{ PixelScene }, { brokenIsland, BROKEN_LABEL }]) => ({
      default: () => <PixelScene scene={brokenIsland} label={BROKEN_LABEL} />,
    }))
    .catch(() => ({ default: () => null })),
);

/**
 * Replaces the whole layout when a route throws, so it has no navbar; it
 * keeps the page column, header and type so it still reads as this site.
 */
export default function ErrorPage() {
  const error = useRouteError();

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
    errorMessage = 'Unknown error.';
  }

  return (
    <div className="min-h-screen py-32">
      <Page>
        <PageHeader chapter="§ Error" title="Something broke" />

        <motion.div variants={fadeUp}>
          <p className="text-lead">
            This page crashed. Reloading usually fixes it.
          </p>

          <div className="mt-8 max-w-[62ch] rounded-2xl p-4 shadow-border">
            <p className="label-overline mb-2">Details</p>
            <p className="break-all font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {errorMessage}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reload
            </button>
            <Link to="/" className="btn-secondary">
              Back to home
            </Link>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16">
          <Suspense fallback={null}>
            <BrokenIsland />
          </Suspense>
        </motion.div>
      </Page>
    </div>
  );
}
