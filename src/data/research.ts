export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  details: string[];
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
    degree: 'MSc in Advanced Computer Science',
    period: '2025 – 2026',
    details: [
      'Supervisor: Professor Aleks Kissinger.',
      'Focus Areas: Quantum Computing, Formal Verification, DBMS, Uncertainty in Deep Learning, Geometric Deep Learning.',
    ],
  },
  {
    id: 'uoft',
    institution: 'University of Toronto',
    degree: 'BSc Computer Science Specialist, Mathematics Minor',
    period: '2021 – 2025',
    details: [
      'Graduated with High Distinction.',
      'Cumulative GPA: 3.94 / 4.0.',
      'Focus Areas: Operating Systems, Machine Learning, Deep Learning, Artificial Intelligence.',
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
    title: 'Innis College Exceptional Achievement',
    issuer: 'University of Toronto',
    year: '2023',
  },
];

export const dissertationData = {
  title:
    'Investigating the Effect of Fault-Equivalence Rewrites on Quantum Decodability Using ZX-Calculus',
  abstract:
    'My current research bridges the gap between diagrammatic reasoning and practical quantum error correction. By leveraging the ZX-calculus, I investigate how fault-equivalence rewrites can improve or harm the decodability of quantum circuits, pushing toward fault-tolerant quantum computation.',
  tags: [
    'Quantum Computing',
    'ZX-Calculus',
    'Quantum Error Correction',
    'Diagrammatic Reasoning',
  ],
};
