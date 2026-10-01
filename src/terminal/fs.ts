import { experienceData } from '@/data/experience';
import { profile } from '@/data/profile';
import { projectsData } from '@/data/projects';
import { awardsData, dissertationData, educationData } from '@/data/research';
import { formatPeriod } from '@/utils/months';

export interface FileNode {
  kind: 'file';
  /** Printed by `cat`, as JSON. */
  data?: unknown;
  /** Opened in a new tab by `open`; `cat` refuses (it's a binary). */
  url?: string;
}

export interface DirNode {
  kind: 'dir';
  /** The site page this directory is; `cd` navigates there. */
  route: string;
  children: Record<string, Node>;
}

export type Node = FileNode | DirNode;

const file = (data: unknown): FileNode => ({ kind: 'file', data });

const dir = (route: string, children: Record<string, Node>): DirNode => ({
  kind: 'dir',
  route,
  children,
});

const byId = <T extends { id: string }>(
  items: T[],
  view: (item: T) => unknown,
) =>
  Object.fromEntries(
    items.map((item) => [`${item.id}.json`, file(view(item))]),
  );

/** The site as a home directory: one directory per page, one file per entry. */
export const ROOT = dir('/', {
  'experience/': dir(
    '/experience',
    byId(
      experienceData,
      ({ role, company, start, end, link, description, skills }) => ({
        role,
        company,
        period: formatPeriod(start, end),
        link,
        description,
        skills,
      }),
    ),
  ),
  'projects/': dir(
    '/projects',
    byId(
      projectsData,
      ({ title, subtitle, year, links, description, skills }) => ({
        title,
        subtitle,
        year,
        links: links?.map((l) => l.url),
        description,
        skills,
      }),
    ),
  ),
  'research/': dir('/research', {
    'dissertation.json': file(dissertationData),
    ...byId(educationData, ({ institution, degree, period, details }) => ({
      institution,
      degree,
      period,
      details,
    })),
    'awards.json': file(
      awardsData.map(({ title, issuer, year }) => ({ title, issuer, year })),
    ),
  }),
  'whoami.json': file({
    name: profile.name,
    role: profile.role,
    location: profile.location,
    status: profile.status,
    email: profile.email,
    links: profile.links,
  }),
  'resume.pdf': { kind: 'file', url: profile.resumeUrl },
});

/** Directory names are stored with a trailing slash, as `ls -p` shows them. */
const childOf = (node: DirNode, name: string) =>
  node.children[`${name}/`] ?? node.children[name];

/** A path as segments from the root: [] is ~, ['projects'] is ~/projects. */
export type Path = string[];

/**
 * Resolves `arg` against `cwd` (`~`, `/`, `.`, `..` and trailing slashes all
 * work as in a shell). Returns the normalised path and node, or null.
 */
export function resolve(
  cwd: Path,
  arg = '~',
): { path: Path; node: Node } | null {
  const absolute = arg.startsWith('~') || arg.startsWith('/');
  const path = absolute ? [] : [...cwd];
  for (const part of arg.replace(/^~/, '').split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') path.pop();
    else path.push(part);
  }

  let node: Node = ROOT;
  for (const part of path) {
    if (node.kind !== 'dir') return null;
    const next = childOf(node, part);
    if (!next) return null;
    node = next;
  }
  return { path, node };
}

export const display = (path: Path) => ['~', ...path].join('/');

/** The directory for a page, so the terminal opens where the visitor was. */
export function pathForRoute(pathname: string): Path {
  const route = pathname.replace(/\/+$/, '') || '/';
  for (const [name, node] of Object.entries(ROOT.children)) {
    if (node.kind === 'dir' && node.route === route) return [name.slice(0, -1)];
  }
  return [];
}
