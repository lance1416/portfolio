export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  details: string[];
  logoUrl?: string;
  isActive?: boolean;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export const educationData: EducationItem[] = [
  {
    id: 'oxford',
    institution: 'University of Oxford',
    degree: 'MSc in Advanced Computer Science (awaiting conferral)',
    period: '2025 – 2026',
    logoUrl:
      'https://public.lance1416.com/portfolio/coat/Arms_of_University_of_Oxford.svg',
    details: [
      'Dissertation: The Effect of Fault-Equivalence Rewrites on Quantum Error Decodability. Supervisor: Professor Aleks Kissinger.',
      'Areas: Quantum computing, formal verification, databases, uncertainty in deep learning, geometric deep learning.',
    ],
  },
  {
    id: 'uoft',
    institution: 'University of Toronto',
    degree: 'BSc, Computer Science Specialist; Mathematics Minor',
    period: '2021 – 2025',
    logoUrl: 'https://public.lance1416.com/portfolio/coat/Utoronto_coa.svg',
    details: [
      'Graduated with High Distinction; GPA: 3.94 / 4.0.',
      'Areas: Operating systems, machine learning, artificial intelligence, deep learning.',
    ],
  },
];

export const awardsData: AwardItem[] = [
  {
    id: 'deans-list',
    title: 'Dean’s List Scholar',
    issuer: 'University of Toronto',
    year: '2021 – 2025',
  },
  {
    id: 'later-life',
    title: 'Later Life Learning Scholarship',
    issuer: 'University of Toronto',
    year: '2021, 2024',
  },
  {
    id: 'innis',
    title: 'Innis College Exceptional Achievement Award',
    issuer: 'University of Toronto',
    year: '2023',
  },
];

export const dissertationData = {
  title:
    'The Effect of Fault-Equivalence Rewrites on Quantum Error Decodability',
  abstract:
    'My MSc dissertation bridges the gap between diagrammatic reasoning and practical quantum error correction. Using the ZX-calculus, it investigates how fault-equivalence rewrites can improve or harm the decodability of quantum circuits, pushing toward fault-tolerant quantum computation.',
  tags: [
    'Quantum Computing',
    'ZX-Calculus',
    'Quantum Error Correction',
    'Diagrammatic Reasoning',
  ],
};
