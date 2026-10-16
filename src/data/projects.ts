// Define the allowed link types
export type LinkType = 'github' | 'itch' | 'live';

export interface ProjectLink {
  type: LinkType;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  links?: ProjectLink[];
  description: string[];
  skills: string[];
  /**
   * Screenshot in public/projects as `${name}-${width}.webp`, one file per
   * width (ascending); the browser picks one via srcset.
   */
  image?: { name: string; widths: number[] };
  color?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: 'ctws',
    title: 'CTWS',
    subtitle: 'Self-Hosted Workspace for One Person',
    year: '2026',
    color: '#c08a1e',
    image: { name: 'ctws', widths: [640, 1280] },
    description: [
      'Designed and built on my own a workspace where one person’s tasks, meetings, people and reading link to each other: a React app and a Fastify API over PostgreSQL, in one TypeScript monorepo.',
      'Built nested tasks that reorder by drag and roll progress up the tree, repeating meetings that split into this one, this and later, or all, and birthdays kept in both the solar and lunar calendars.',
      'Every push runs type checks, unit tests and a Playwright suite; a release tag only publishes the Docker image once that commit’s suite has passed.',
    ],
    skills: ['TypeScript', 'React', 'Fastify', 'PostgreSQL', 'Playwright'],
    links: [{ type: 'github', url: 'https://github.com/lance1416/ctws' }],
  },
  {
    id: 'kidneyos',
    title: 'KidneyOS',
    subtitle: 'PintOS-Inspired Teaching Operating System in Rust',
    year: '2024',
    color: '#d34516',
    image: { name: 'kidney-os', widths: [640, 1280] },
    description: [
      'Principal author of the storage subsystem below the VFS layer in a from-scratch Rust kernel built by eight people, and sole author of its PS/2 keyboard driver. Supervised by Professor Kuei Sun at the University of Toronto.',
      'Wrote an ATA driver whose interrupt handlers wake semaphore-blocked threads, a block-device layer that hid hardware specifics from the filesystem above, and MBR partition parsing and registration.',
      'Built the disk-image tooling the kernel boots against, generating partitioned images formatted as FAT16, ext2, or ext4.',
    ],
    skills: [
      'Rust',
      'Systems Programming',
      'OS Kernel',
      'Device Drivers',
      'Filesystems',
      'Concurrency',
    ],
    links: [
      {
        type: 'github',
        url: 'https://github.com/KidneyOS/KidneyOS',
      },
    ],
  },
  {
    id: 'evogami',
    title: 'Evogami',
    subtitle: '3D Puzzle Platformer',
    year: '2024',
    color: '#fa5c5c',
    image: { name: 'evogami', widths: [640, 960] },
    description: [
      'Programming Lead on a 12-person team of computer science, art, and music students across the University of Toronto and Sheridan College, shipping an original game in Unity for Windows and macOS.',
      'Wrote 94% of the game’s C# gameplay code: the origami transformation state machine behind the core mechanic, character movement with ground and wall detection, the UI, and an input layer covering keyboard, mouse, and Xbox and PlayStation controllers.',
      'Directed the programming team and worked out technical decisions with the design and audio groups.',
    ],
    skills: ['Unity', 'C#', 'Game Development', 'Technical Leadership'],
    links: [{ type: 'itch', url: 'https://tenfold-games.itch.io/evogami' }],
  },
];
