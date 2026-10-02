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
  /** Base colour; `role-scope` lightens it in dark mode. */
  color: string;
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
  { label: 'linkedin', href: profile.links.linkedin, ext: true },
  { label: 'email', href: `mailto:${profile.email}`, ext: false },
  { label: 'cv.pdf', href: profile.resumeUrl, ext: true },
];

export const NOW_ITEMS: NowItem[] = [
  {
    label: 'IQBank',
    detail: 'Leading the 10-person dev team',
    color: '#3b5fb2',
  },
  {
    label: 'Oxford',
    detail: 'MSc awaiting conferral',
    color: '#002147',
  },
];

export const FIELDS: Field[] = [
  {
    domain: 'Research',
    detail:
      'MSc Oxford · quantum error correction & ZX-calculus · AI interpretability at Fabrial Labs',
  },
  {
    domain: 'Systems',
    detail:
      'KidneyOS Rust kernel · storage subsystem author · ATA driver & block layer',
  },
  {
    domain: 'Product',
    detail: 'IQBank co-founder · 10-person team · 379 users',
  },
];

export const SELECTED_WORK_PERIOD = '2024 – 26';

export const INDEX_ENTRIES: IndexEntry[] = [
  {
    number: '01',
    category: 'Research',
    title: 'Fault-equivalence rewrites & quantum error decodability',
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
    title: 'IQBank — Course study platform',
    year: '2025',
    to: '/experience',
  },
];
