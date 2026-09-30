export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  link?: string;
  description: string[];
  skills: string[];
  color?: string;
  isActive?: boolean;
}
export const experienceData: ExperienceItem[] = [
  {
    id: 'fabrial',
    role: 'Research Engineer',
    company: 'Fabrial Labs Ltd.',
    period: 'Jun 2026 – Aug 2026',
    link: 'https://www.fabrialcomputing.com/',
    description: [
      'Applied diagrammatic methods from category theory, a formalism that came out of quantum computing, to modelling machine learning processes at an early-stage AI research startup (stealth).',
      'Extended open-source diagrammatic rewriting tools with the group’s own constructions, and wrote the Python verification code that tested theoretical claims against AI models and training methods.',
      'Validated the formalism symbolically against small MLPs, turning up counterexamples that sent the theory back.',
    ],
    skills: [
      'AI Interpretability',
      'Category Theory',
      'Diagrammatic Rewriting',
      'Python',
    ],
    color: '#6b7280',
  },
  {
    id: 'iqbank',
    role: 'Co-founder, Development Lead & Product Manager',
    company: 'IQBank',
    period: 'Apr 2025 – Present',
    link: 'https://iqbank.teach.cs.toronto.edu',
    description: [
      'Built the study platform in TypeScript, React, and PostgreSQL for 379 users. Remain its largest code contributor and run it in production on university infrastructure with Docker and CI.',
      'Designed the access-control model: orthogonal platform-wide (admin / staff / regular) and per-course (instructor / TA / student) role hierarchies.',
      'Lead the 10-person development team directly and an education-research team through its lead, handle developer interviews and onboarding, and coordinate from the UK across Toronto working hours.',
      'Run the user-research loop that sets the roadmap: a colour-blind user reporting unreadable text led to a rebuilt colour system, and requests for personalisation became question bookmarks and personal notes.',
    ],
    skills: [
      'TypeScript',
      'React',
      'PostgreSQL',
      'Docker',
      'CI',
      'Access Control',
      'User Research',
    ],
    isActive: true,
    color: '#3b5fb2',
  },
  {
    id: 'uoft-ta',
    role: 'Teaching Assistant, CSC309: Programming on the Web',
    company: 'University of Toronto',
    period: 'Jan 2025 – Apr 2025',
    description: [
      'Owned one of the course’s major assignments for a cohort of 300+ students: designed it with the professor, then wrote the spec, rubric, reference solution, and automated test suite for a RESTful loyalty-program backend. It has been reused in later terms.',
      'Held weekly office hours across the full syllabus: front-end and back-end web development, REST APIs, and debugging.',
    ],
    skills: [
      'REST APIs',
      'Backend Architecture',
      'Automated Testing',
      'Technical Writing',
      'Mentorship',
    ],
    color: '#1E3765',
  },
];
