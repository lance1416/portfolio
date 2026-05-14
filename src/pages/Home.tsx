import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBalancedText } from '@/hooks/useBalancedText';
import { fadeUp, staggerFast } from '@/utils/variants';

// ─── Data ────────────────────────────────────────────────────────────────────

const LOCATIONS = [
  { name: 'Beijing', tz: 'Asia/Shanghai' },
  { name: 'Toronto', tz: 'America/Toronto' },
  { name: 'Oxford', tz: 'Europe/London' },
];

const ELSEWHERE = [
  { label: 'github', href: 'https://github.com/lance1416', ext: true },
  { label: 'scholar', href: 'https://scholar.google.com', ext: true },
  { label: 'email', href: 'mailto:lanceli1416@gmail.com', ext: false },
  { label: 'cv.pdf', href: '/resume.pdf', ext: true },
];

const NOW_ITEMS = [
  {
    label: 'Oxford',
    detail: 'Quantum decodability dissertation',
    lightColor: '#002147',
    darkColor: '#5b8fdf',
    delay: 0,
  },
  {
    label: 'IQBank',
    detail: 'Shipping Phase 2',
    lightColor: '#3b5fb2',
    darkColor: '#7baae8',
    delay: 0.9,
  },
];

const FIELDS = [
  {
    domain: 'Research',
    detail:
      'MSc Oxford · Kissinger lab · quantum error correction & ZX-calculus',
  },
  {
    domain: 'Systems',
    detail: 'KidneyOS Rust kernel · storage subsystem lead · IDE driver & I/O',
  },
  {
    domain: 'Product',
    detail: 'IQBank co-founder · 11-person team · ~100 beta users',
  },
];

const INDEX_ENTRIES = [
  {
    number: '01',
    category: 'Research',
    title: 'Fault-equivalence rewrites & quantum decodability',
    year: '2026',
    to: '/research',
  },
  {
    number: '02',
    category: 'Systems',
    title: 'KidneyOS — Rust-based operating system kernel',
    year: '2024',
    to: '/projects',
  },
  {
    number: '03',
    category: 'Product',
    title: 'IQBank — Full-stack education platform',
    year: '2025',
    to: '/experience',
  },
];

// Plain text for pretext line-balance measurement (styled spans stripped out).
const SUBTITLE_TEXT =
  'I research quantum error correction and ZX-calculus at the University of Oxford to map the theoretical bounds of computation, and I architect robust software—from bare-metal OS kernels to intelligent web applications—to push the limits of the machine.';

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
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
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

/** Observes the `dark` class on <html> and returns a boolean. */
function useIsDark() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );
  useEffect(() => {
    const ob = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark')),
    );
    ob.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => ob.disconnect();
  }, []);
  return isDark;
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
            <Link to={entry.to} className="group block">
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
  const isDark = useIsDark();
  const { ref: subtitleRef, style: subtitleStyle } =
    useBalancedText<HTMLParagraphElement>(SUBTITLE_TEXT);

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      animate="show"
      className="mx-auto grid max-w-5xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-[210px_1fr_210px] lg:gap-0"
    >
      {/* ── LEFT: Identity sidebar ── */}
      <motion.aside
        variants={fadeUp}
        className="flex flex-col gap-10 lg:sticky lg:top-32 lg:self-start lg:border-r lg:border-zinc-200 lg:pr-10 dark:lg:border-zinc-800"
      >
        <div>
          <p className="label-overline mb-2">Portfolio</p>
          <h1 className="font-display text-2xl font-normal text-zinc-900 dark:text-zinc-100">
            Sinan Li
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
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
                  <div className="relative mt-[5px] h-1.5 w-1.5 shrink-0">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ scale: [1, 2.8], opacity: [0.5, 0] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: item.delay,
                      }}
                    />
                  </div>
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
          <ul className="flex flex-col gap-2">
            {ELSEWHERE.map(({ label, href, ext }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="link-underline font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {label}
                  {ext && <span className="ml-0.5 opacity-40">↗</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>

      {/* ── CENTER: Hero ── */}
      <main className="pb-16 lg:px-12">
        <motion.section variants={fadeUp} className="mb-20">
          <h2 className="font-display text-4xl font-normal leading-[1.15] tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Quantum research.
            <br />
            Systems architecture.
            <br />
            Product engineering.
            <br />
            <span className="text-zinc-400 dark:text-zinc-600">
              At every layer.
            </span>
          </h2>

          {/* Short rule — typographic pause between poem and prose */}
          <div className="my-8 h-px w-10 bg-zinc-300 dark:bg-zinc-700" />

          <p
            ref={subtitleRef}
            style={subtitleStyle}
            className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
          >
            I research quantum error correction and ZX-calculus at the{' '}
            <span className="font-serif italic text-[#002147] dark:text-[#6b9ae6]">
              University of Oxford
            </span>{' '}
            to map the theoretical bounds of computation, and I architect robust
            software—from{' '}
            <span className="font-mono text-sm tracking-tight text-orange-600 dark:text-orange-400">
              bare-metal OS kernels to intelligent web applications
            </span>
            —to push the limits of the machine.
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
          <div className="mb-5 flex items-baseline justify-between">
            <span className="label-overline">Selected work</span>
            <span className="mono-meta">2024 – 26</span>
          </div>
          <IndexList />
        </motion.section>
      </main>

      {/* ── RIGHT: Index sidebar — desktop only ── */}
      <motion.nav
        variants={fadeUp}
        className="hidden lg:flex lg:flex-col lg:sticky lg:top-32 lg:self-start lg:border-l lg:border-zinc-200 lg:pl-10 dark:lg:border-zinc-800"
      >
        <div className="mb-5 flex items-baseline justify-between">
          <span className="label-overline">Selected work</span>
          <span className="mono-meta">2024–26</span>
        </div>
        <IndexList compact />
      </motion.nav>
    </motion.div>
  );
}
