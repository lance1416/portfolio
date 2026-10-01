import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import {
  ELSEWHERE,
  FIELDS,
  INDEX_ENTRIES,
  LOCATIONS,
  NOW_ITEMS,
  SELECTED_WORK_PERIOD,
} from '@/data/home';
import { profile } from '@/data/profile';
import { usePageEntrance } from '@/utils/pageTransition';
import { fadeUp, staggerFast } from '@/utils/variants';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
        <li key={loc.name} className="flex justify-between gap-8">
          <span>{loc.name}</span>
          <span className="tabular-nums">{times[loc.name] ?? '--:--'}</span>
        </li>
      ))}
    </ul>
  );
}

function SelectedWorkHeader() {
  return (
    <div className="mb-5 flex items-baseline justify-between">
      <span className="label-overline">Selected work</span>
      <span className="mono-meta">{SELECTED_WORK_PERIOD}</span>
    </div>
  );
}

// ─── Index list — shared between mobile inline + desktop right column ─────────

function IndexList({ compact = false }: { compact?: boolean }) {
  return (
    <ol
      className={
        compact ? 'space-y-6' : 'border-t border-zinc-200 dark:border-zinc-800'
      }
    >
      {INDEX_ENTRIES.map((entry) =>
        compact ? (
          // Right-column compact layout
          <li key={entry.number}>
            <Link to={entry.to} viewTransition className="group block">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-accent">
                  {entry.number}
                </span>
                <span className="label-overline">{entry.category}</span>
              </div>
              <p className="text-xs leading-snug text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100">
                {entry.title}
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
              className="group flex items-baseline gap-5 border-b border-zinc-200 px-1 py-5 transition-colors hover:bg-zinc-100/60 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
            >
              <span className="w-5 shrink-0 font-mono text-xs text-accent">
                {entry.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="label-overline mb-1">{entry.category}</p>
                <p className="text-sm font-medium leading-snug text-zinc-900 transition-colors group-hover:text-accent dark:text-zinc-100">
                  {entry.title}
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
  const entrance = usePageEntrance();
  const { isDark } = useTheme();
  return (
    <motion.div
      variants={staggerFast}
      initial={entrance}
      animate="show"
      className="mx-auto grid max-w-5xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-[210px_1fr_210px] lg:gap-0"
    >
      {/* ── LEFT: Identity sidebar ── */}
      <motion.aside
        variants={fadeUp}
        className="order-2 flex flex-col gap-10 lg:order-none lg:sticky lg:top-32 lg:self-start lg:border-r lg:border-zinc-200 lg:pr-10 dark:lg:border-zinc-800"
      >
        <div>
          <p className="label-overline mb-2">Portfolio</p>
          <h1 className="font-display text-2xl font-normal text-zinc-900 dark:text-zinc-100">
            {profile.name}
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            Research · Systems · Product
          </p>
        </div>

        <div>
          <p className="label-overline mb-3">Local time</p>
          <LocalTime />
        </div>

        <div>
          <p className="label-overline mb-3">Now</p>
          <ul className="space-y-3">
            {NOW_ITEMS.map((item) => {
              const color = isDark ? item.darkColor : item.lightColor;
              return (
                <li key={item.label} className="flex items-start gap-2.5">
                  <div
                    className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {item.label}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="label-overline mb-3">Elsewhere</p>
          {/* Each link is a 40px-tall block (py-3 around 16px text); -my-3 keeps the section's outer spacing. */}
          <ul className="-my-3 flex flex-col">
            {ELSEWHERE.map(({ label, href, ext }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(ext && { target: '_blank', rel: 'noreferrer' })}
                  className="group block py-3 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <span className="link-underline">{label}</span>
                  {ext && <span className="ml-0.5 opacity-40">↗</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>

      {/* ── CENTER: Hero ── */}
      <main className="order-1 pb-16 lg:order-none lg:px-12">
        <motion.section variants={fadeUp} className="mb-20">
          <h2 className="font-display text-4xl font-normal leading-[1.15] tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Quantum research.
            <br />
            Systems architecture.
            <br />
            Product engineering.
            <br />
            <span className="text-zinc-500">At every layer.</span>
          </h2>

          {/* Short rule — typographic pause between poem and prose */}
          <div className="my-8 h-px w-10 bg-zinc-300 dark:bg-zinc-700" />

          <p
            // Balanced lines from sm up; browsers only balance ≤6 lines, so
            // phones (~9 lines) just avoid a lone last word.
            className="text-pretty text-base leading-relaxed text-zinc-600 sm:text-balance dark:text-zinc-400"
          >
            I did my MSc at the{' '}
            <span className="font-serif italic text-[#002147] dark:text-[#6b9ae6]">
              University of Oxford
            </span>{' '}
            on quantum error correction, then spent the summer pointing the same
            diagrams at neural networks. Outside research I build software,
            anything from{' '}
            <span className="font-mono text-sm tracking-tight text-orange-700 dark:text-orange-400">
              Rust kernel drivers to the course platform
            </span>{' '}
            I run with my team.
          </p>
        </motion.section>

        {/* Field credentials — unpacks "at every layer" with concrete context */}
        <motion.section variants={fadeUp} className="mb-20">
          <div className="space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            {FIELDS.map(({ domain, detail }) => (
              <div key={domain} className="flex items-baseline gap-4">
                <span className="label-overline min-w-[4.5rem] shrink-0">
                  {domain}
                </span>
                <span className="text-sm leading-snug text-zinc-500 dark:text-zinc-400">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Index — mobile / tablet only; desktop shows it in the right column */}
        <motion.section variants={fadeUp} className="lg:hidden">
          <SelectedWorkHeader />
          <IndexList />
        </motion.section>
      </main>

      {/* ── RIGHT: Index sidebar — desktop only ── */}
      <motion.nav
        variants={fadeUp}
        className="hidden lg:flex lg:flex-col lg:sticky lg:top-32 lg:self-start lg:border-l lg:border-zinc-200 lg:pl-10 dark:lg:border-zinc-800"
      >
        <SelectedWorkHeader />
        <IndexList compact />
      </motion.nav>
    </motion.div>
  );
}
