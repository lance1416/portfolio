import { nowMonthPosition, toMonthIndex } from '@/utils/months';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  /** Short name for the timeline strip. */
  label: string;
  /** 'YYYY-MM', inclusive. */
  start: string;
  /** 'YYYY-MM', inclusive; omitted while the role is ongoing. */
  end?: string;
  link?: string;
  /** First entry is shown as the lead paragraph. */
  description: string[];
  skills: string[];
  color: string;
}

/**
 * Month-index span of a role: `from` is the start of its first month, `to` the
 * end of its last month (or today, if ongoing). `months` counts whole months.
 */
export function roleSpan(item: ExperienceItem, now = nowMonthPosition()) {
  const from = toMonthIndex(item.start);
  const to = item.end ? toMonthIndex(item.end) + 1 : now;
  const months =
    (item.end ? toMonthIndex(item.end) : Math.floor(now)) - from + 1;
  return { from, to, months };
}
export const experienceData: ExperienceItem[] = [
  {
    id: 'fabrial',
    role: 'Research Engineer',
    company: 'Fabrial Labs Ltd.',
    label: 'Fabrial Labs',
    start: '2026-06',
    end: '2026-08',
    link: 'https://www.fabrialcomputing.com/',
    description: [
      'Applied diagrammatic methods from category theory to modelling machine learning processes at an early-stage AI research startup (stealth).',
      'Developed the theory day to day with the research scientists, and turned each new claim into a concrete case that would confirm it or break it.',
      'Extended open-source diagrammatic rewriting tools with the group’s own constructions, and wrote the Python verification code that ran those cases against AI models and training methods.',
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
    label: 'IQBank',
    start: '2025-04',
    link: 'https://iqbank.teach.cs.toronto.edu',
    description: [
      'Built the study platform in TypeScript, React, and PostgreSQL for 379 users. Remain its largest code contributor and run it in production on university infrastructure with Docker and CI/CD pipelines.',
      'Designed the access-control model: orthogonal platform-wide (admin / staff / regular) and per-course (instructor / TA / student) role hierarchies.',
      'Lead the 10-person development team directly and an education-research team through its lead, handle developer interviews and onboarding, and coordinate from the UK across Toronto working hours.',
      'Run the user-research loop that sets the roadmap: a colour-blind user reporting unreadable text led to a rebuilt colour system, and requests for personalisation became question bookmarks and personal notes.',
    ],
    skills: [
      'TypeScript',
      'React',
      'PostgreSQL',
      'Docker',
      'CI/CD',
      'Access Control',
      'User Research',
    ],
    color: '#3b5fb2',
  },
  {
    id: 'uoft-ta',
    role: 'Teaching Assistant, CSC309: Programming on the Web',
    company: 'University of Toronto',
    label: 'UofT TA',
    start: '2025-01',
    end: '2025-04',
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
