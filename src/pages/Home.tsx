import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  type ComponentType,
  type CSSProperties,
  lazy,
  Suspense,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@/components/Page';
import { RollLine } from '@/components/RollLine';
import { Section } from '@/components/Section';
import {
  ELSEWHERE,
  FIELDS,
  INDEX_ENTRIES,
  LOCATIONS,
  type Location,
  NOW_ITEMS,
  SELECTED_WORK_PERIOD,
} from '@/data/home';
import { profile } from '@/data/profile';
import { fadeUp } from '@/utils/variants';

/** Inline `role-scope` colour, lightened in dark mode like every item colour. */
const tint = (color: string | undefined) =>
  ({ '--role-base': color }) as CSSProperties;

const NBSP = String.fromCodePoint(0xa0);
const NB_HYPHEN = String.fromCodePoint(0x2011);

/**
 * Keeps short lines from breaking in odd places: each " · " separator sticks
 * to the word before it (no line starts with a dot) and hyphenated words
 * ("10-person", "ZX-calculus") never split at the hyphen.
 */
const noBreaks = (text: string) =>
  text.replaceAll(' · ', `${NBSP}· `).replace(/(\w)-(\w)/g, `$1${NB_HYPHEN}$2`);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Where a city's sky goes until it loads (or if it can't). */
const SkySlot = () => <span className="block h-4 w-16" />;

// Decoration, so it stays out of the main bundle.
const CitySky = lazy<ComponentType<Location>>(() =>
  import('@/components/CitySky').catch(() => ({ default: SkySlot })),
);

function LocalTime() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const next: Record<string, string> = {};
      for (const loc of LOCATIONS) {
        next[loc.name] = now.toLocaleTimeString('en-GB', {
          timeZone: loc.tz,
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      setTimes(next);
    };
    // Only minutes are shown, so re-render on each minute boundary.
    let timer: number;
    const tick = () => {
      update();
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <ul className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
      {LOCATIONS.map((loc) => (
        // Fixed columns, so the skies line up whatever the city's name.
        <li
          key={loc.name}
          className="grid grid-cols-[1fr_auto_auto] items-center gap-3"
        >
          <span>{loc.name}</span>
          <Suspense fallback={<SkySlot />}>
            <CitySky {...loc} />
          </Suspense>
          <span className="tabular-nums">{times[loc.name] ?? '--:--'}</span>
        </li>
      ))}
    </ul>
  );
}

/** What's happening now: one line per thing, dotted in its colour. */
function NowList({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {NOW_ITEMS.map((item) => (
        <li
          key={item.label}
          className="role-scope flex items-start gap-2.5"
          style={tint(item.color)}
        >
          <span
            aria-hidden="true"
            className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-(--role)"
          />
          <div>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {item.label}
            </p>
            <p className="text-balance text-xs text-zinc-500 dark:text-zinc-400">
              {noBreaks(item.detail)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SelectedWorkHeader() {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="label-overline">Selected work</h2>
      <span className="mono-meta">{SELECTED_WORK_PERIOD}</span>
    </div>
  );
}

// ─── Index list — shared between mobile inline + desktop right column ─────────

function IndexList({ compact = false }: { compact?: boolean }) {
  return (
    <ol
      className={
        compact
          ? 'space-y-6'
          : 'divide-y divide-zinc-200 dark:divide-zinc-800 [&>li:first-child>a]:pt-0'
      }
    >
      {INDEX_ENTRIES.map((entry) =>
        compact ? (
          // Right-column compact layout
          <li key={entry.number}>
            <Link to={entry.to} viewTransition className="group block">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="font-mono text-[10px] tabular-nums text-accent">
                  {entry.number}
                </span>
                <span className="label-overline">{entry.category}</span>
              </div>
              <p className="text-balance text-xs leading-snug text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100">
                {noBreaks(entry.title)}
              </p>
              <span className="mono-meta mt-1 block">{entry.year}</span>
            </Link>
          </li>
        ) : (
          // Full inline layout (mobile / tablet)
          <li key={entry.number}>
            <Link
              to={entry.to}
              viewTransition
              className="group flex items-baseline gap-5 py-5"
            >
              <span className="w-5 shrink-0 font-mono text-xs tabular-nums text-accent">
                {entry.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="label-overline mb-1">{entry.category}</p>
                <p className="text-sm font-medium leading-snug text-zinc-900 transition-colors group-hover:text-accent dark:text-zinc-100">
                  {noBreaks(entry.title)}
                </p>
              </div>
              <span className="mono-meta shrink-0">{entry.year}</span>
            </Link>
          </li>
        ),
      )}
    </ol>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <Page className="grid grid-cols-1 gap-16 lg:grid-cols-[13rem_minmax(0,1fr)_14.5rem] lg:gap-0">
      {/* ── LEFT: Identity sidebar ── */}
      <motion.aside
        variants={fadeUp}
        // Below lg it follows the content, holding just Elsewhere then Local
        // time (side by side on tablets): the name block stays for screen
        // readers only — the navbar and the hello already say who this is —
        // and Now moves up under the intro.
        className="order-2 grid gap-10 sm:grid-cols-2 sm:gap-x-12 lg:order-none lg:sticky lg:top-32 lg:flex lg:flex-col lg:self-start lg:border-r lg:border-zinc-200 lg:pr-8 dark:lg:border-zinc-800"
      >
        <div className="sr-only lg:not-sr-only">
          <p className="label-overline mb-3">Portfolio</p>
          <h1 className="font-display text-2xl font-normal text-zinc-900 dark:text-zinc-50">
            {profile.name}
          </h1>
          <p className="mono-meta mt-1">{profile.role}</p>
        </div>

        <div>
          <h2 className="label-overline mb-3">Local time</h2>
          <LocalTime />
        </div>

        {/* Desktop only; smaller screens show it under the intro. */}
        <div className="hidden lg:block">
          <h2 className="label-overline mb-3">Now</h2>
          <NowList className="space-y-3" />
        </div>

        <div className="order-first lg:order-none">
          <h2 className="label-overline mb-3">Elsewhere</h2>
          {/* Each link is a 40px-tall block (py-3 around 16px text); -my-3 keeps the section's outer spacing.
              A wrapping row below lg, a column in the desktop sidebar. */}
          <ul className="-my-3 flex flex-wrap gap-x-6 lg:flex-col lg:gap-x-0">
            {ELSEWHERE.map(({ label, href, ext }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(ext && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group flex items-center gap-0.5 py-3 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <span className="link-underline">{label}</span>
                  {ext && (
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>

      {/* ── CENTER: Hero ── */}
      <div className="order-1 lg:order-none lg:px-10">
        {/* Closer to Now below it on smaller screens; desktop has the fields next. */}
        <motion.section variants={fadeUp} className="mb-10 lg:mb-24">
          {/* Home's title: a plain hello; the paragraph says the rest. It
              rolls in after a page turn like every PageHeader title. */}
          {/* The role, shown here while the sidebar's name block is hidden
              (screen readers get it from that block). */}
          <p aria-hidden="true" className="label-overline mb-4 lg:hidden">
            {profile.role}
          </p>
          <h2 className="font-display text-4xl font-normal leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            <RollLine>Hi, I’m Sinan.</RollLine>
          </h2>

          {/* Short rule — typographic pause between poem and prose */}
          <div className="my-8 h-px w-10 bg-zinc-300 dark:bg-zinc-700" />

          <p
            // Balanced lines from sm up; browsers only balance ≤6 lines, so
            // phones (~9 lines) just avoid a lone last word.
            className="text-lead text-pretty sm:text-balance"
          >
            I did my MSc at the{' '}
            {/* Brand colours: Oxford blue and Rust's orange (index.css) */}
            <span className="font-display italic text-oxford">
              University of Oxford
            </span>{' '}
            on quantum error correction, then spent the summer pointing the same
            diagrams at neural networks. Outside research I build software,
            anything from{' '}
            <span className="font-mono text-sm tracking-tight text-rust">
              Rust kernel drivers to the course platform
            </span>{' '}
            I run with my team.
          </p>
        </motion.section>

        {/* Now — below lg, straight after the intro; desktop keeps it in the
            sidebar */}
        <motion.section variants={fadeUp} className="mb-16 sm:mb-24 lg:hidden">
          <h2 className="label-overline mb-3">Now</h2>
          <NowList className="grid gap-3 sm:grid-cols-2" />
        </motion.section>

        {/* Field credentials: one line of specifics per area */}
        <motion.section variants={fadeUp} className="mb-16 sm:mb-24">
          <div className="space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            {FIELDS.map(({ domain, detail }) => (
              <div key={domain} className="flex items-baseline gap-4">
                <span className="label-overline min-w-[4.5rem] shrink-0">
                  {domain}
                </span>
                <span className="text-body text-pretty">
                  {noBreaks(detail)}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Index — mobile / tablet only; desktop shows it in the right column */}
        <Section
          label="Selected work"
          meta={SELECTED_WORK_PERIOD}
          className="lg:hidden"
        >
          <IndexList />
        </Section>
      </div>

      {/* ── RIGHT: Index sidebar — desktop only ── */}
      <motion.nav
        variants={fadeUp}
        aria-label="Selected work"
        className="hidden lg:flex lg:flex-col lg:sticky lg:top-32 lg:self-start lg:border-l lg:border-zinc-200 lg:pl-8 dark:lg:border-zinc-800"
      >
        <SelectedWorkHeader />
        <IndexList compact />
      </motion.nav>
    </Page>
  );
}
