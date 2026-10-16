import { lazy, Suspense } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { CatPaws } from '@/components/CatPaws';
import { PAGE_COLUMN } from '@/components/Page';
import { profile } from '@/data/profile';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CAT_SPOTS, useCatsFound } from '@/utils/cats';
import { cn } from '@/utils/cn';
import { useOneScreen } from '@/utils/oneScreen';

// Only once every hiding place is found, so it loads on demand.
const NappingCat = lazy(() => import('@/components/NappingCat'));

/** Mirrors the floating dock's visibility (`sm:flex short:hidden`). */
const DOCK_SHOWN = '(min-width: 640px) and (min-height: 481px)';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: profile.links.github, icon: FaGithub, ext: true },
  {
    label: 'LinkedIn',
    href: profile.links.linkedin,
    icon: FaLinkedin,
    ext: true,
  },
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: FaEnvelope,
    ext: false,
  },
];

export function Footer() {
  const found = useCatsFound();
  const hasDock = useMediaQuery(DOCK_SHOWN);
  // Where there's no dock to nap on, the cat naps here.
  const napsHere = found.length === CAT_SPOTS.length && !hasDock;
  // On a one-screen page (the Projects ring) there's no "below the page":
  // the footer becomes a slim row in the dock's band, the dock between its
  // two halves (64px tall, 24px up, like the dock).
  const oneScreen = useOneScreen();

  return (
    <footer
      className={
        oneScreen
          ? 'pointer-events-none fixed inset-x-0 bottom-6 z-40 h-16'
          : 'mt-auto border-t border-zinc-200 py-10 dark:border-zinc-800'
      }
    >
      <div
        className={cn(
          PAGE_COLUMN,
          'flex flex-col items-center justify-between gap-6 sm:flex-row',
          oneScreen && 'h-full [&>*]:pointer-events-auto',
        )}
      >
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <CatPaws />
          {napsHere && (
            <Suspense fallback={null}>
              <NappingCat className="relative -my-4" />
            </Suspense>
          )}
        </div>

        {/* 40x40 hit areas: -m-3 cancels the box padding so the visible row keeps its bounds; gap-0 keeps centers 40px apart (adjacent, never overlapping) */}
        <div className="-m-3 flex items-center">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon, ext }) => (
            <a
              key={label}
              href={href}
              {...(ext && { target: '_blank', rel: 'noopener noreferrer' })}
              className="flex h-10 w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
