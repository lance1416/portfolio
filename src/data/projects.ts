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
    id: 'archive-tools',
    title: 'Archive Tools',
    subtitle: 'Open source archive manager with advanced functionalities',
    year: '2026',
    color: '#ff3e00',
    imageUrl: 'projects/archive-tools.png',
    description: [
      'Archive management tool written in Python, Tauri, and SevletKit',
      'Supports a wide range of archive formats, including ZIP, RAR, 7z, and TAR, with seamless cross-platform compatibility.',
      'Advanced features including password manager, filename encoding, password encoding, and more to come.',
    ],
    skills: [
      'Python',
      'Rust',
      'Tauri',
      'SevletKit',
      'Cross-Platform Development',
    ],
    links: [
      {
        type: 'github',
        url: 'https://github.com/CheesyToast1416/archive-tools',
      },
    ],
  },
  {
    id: 'kidneyos',
    title: 'KidneyOS',
    subtitle: 'Rust-Based Toy Operating System',
    year: '2024',
    color: '#d34516',
    imageUrl: 'projects/kidney-os.png',
    description: [
      'Took sole ownership of the complete storage subsystem beneath the VFS layer in a from-scratch Rust OS kernel.',
      'Built the IDE device driver, block layer, and I/O scheduler from the ground up, bringing full disk access and storage management to the kernel.',
      'Designed a block-device abstraction layer to cleanly decouple hardware-level IDE interactions from the filesystem.',
    ],
    skills: [
      'Rust',
      'Systems Programming',
      'OS Kernel',
      'Async I/O',
      'Device Drivers',
    ],
    links: [
      {
        type: 'github',
        url: 'https://github.com/kidneyos/kidneyos',
      },
    ],
  },
  {
    id: 'evogami',
    title: 'Evogami',
    subtitle: 'Multidisciplinary Game Design Project',
    year: '2024',
    color: '#fa5c5c',
    imageUrl: 'projects/evogami.png',
    description: [
      'Co-led a 13-person multidisciplinary team—CS students, music composers, and game designers—through the full development lifecycle of an original game.',
      'Directed the programming team and personally implemented core gameplay systems, including character movement mechanics and multi-stage puzzle interactions.',
    ],
    skills: [
      'Game Development',
      'Technical Leadership',
      'C#',
      'Project Management',
    ],
    links: [{ type: 'itch', url: 'https://tenfold-games.itch.io/evogami' }],
  },
];
