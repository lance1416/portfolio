import { profile } from './profile';

export interface Location {
  name: string;
  /** IANA time zone. */
  tz: string;
}

export interface ElsewhereLink {
  label: string;
  href: string;
  /** Opens in a new tab and shows the ↗ marker. */
  ext: boolean;
}

export interface NowItem {
  label: string;
  detail: string;
  lightColor: string;
  darkColor: string;
}

export interface Field {
  domain: string;
  detail: string;
}

export interface IndexEntry {
  number: string;
  category: string;
  title: string;
  year: string;
  /** Internal route the entry links to. */
  to: string;
}

export const LOCATIONS: Location[] = [
  { name: 'Beijing', tz: 'Asia/Shanghai' },
  { name: 'Toronto', tz: 'America/Toronto' },
  { name: 'Oxford', tz: 'Europe/London' },
];

export const ELSEWHERE: ElsewhereLink[] = [
  { label: 'github', href: profile.links.github, ext: true },
  { label: 'scholar', href: profile.links.scholar, ext: true },
  { label: 'email', href: `mailto:${profile.email}`, ext: false },
  { label: 'cv.pdf', href: profile.resumeUrl, ext: true },
];

export const NOW_ITEMS: NowItem[] = [
  {
    label: 'Oxford',
    detail: 'Quantum decodability dissertation',
    lightColor: '#002147',
    darkColor: '#5b8fdf',
  },
  {
    label: 'IQBank',
    detail: 'Shipping Phase 2',
    lightColor: '#3b5fb2',
    darkColor: '#7baae8',
  },
];

export const FIELDS: Field[] = [
  {
    domain: 'Research',
    detail:
      'MSc Oxford · Quantum Group · quantum error correction & ZX-calculus',
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

export const SELECTED_WORK_PERIOD = '2024 – 26';

export const INDEX_ENTRIES: IndexEntry[] = [
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
