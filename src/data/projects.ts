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
  imageUrl?: string;
  color?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: 'kidneyos',
    title: 'KidneyOS',
    subtitle: 'Rust-Based Toy Operating System',
    year: '2024',
    color: '#d34516',
    imageUrl: 'projects/kidney-os.png',
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
    imageUrl: 'projects/evogami.png',
    description: [
      'Programming Lead on a 12-person team of computer science, art, and music students across the University of Toronto and Sheridan College, shipping an original game in Unity for Windows and macOS.',
      'Wrote 94% of the game’s C# gameplay code: the origami transformation state machine behind the core mechanic, character movement with ground and wall detection, the UI, and an input layer covering keyboard, mouse, and Xbox and PlayStation controllers.',
      'Directed the programming team and worked out technical decisions with the design and audio groups.',
    ],
    skills: ['Unity', 'C#', 'Game Development', 'Technical Leadership'],
    links: [{ type: 'itch', url: 'https://tenfold-games.itch.io/evogami' }],
  },
];
