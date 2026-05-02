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
    id: 'iqbank',
    role: 'Co-founder, Development Lead & Product Manager',
    company: 'IQBank',
    period: 'Apr 2025 – Present',
    link: 'https://iqbank.teach.cs.toronto.edu',
    description: [
      'Architected and shipped the full-stack MVP—TypeScript, React, Express.js, Prisma ORM, and PostgreSQL—reaching ~100 beta users.',
      'Led an 11-person cross-functional team through sprint planning, code review, and technical decision-making, coordinating engineering, testing, and UX workstreams.',
      'Iterated from MVP to Phase 2 through structured user research, shipping targeted improvements to discussion workflows, accessibility, and content discovery.',
      'Scoped a microservices migration strategy and defined the AI-features roadmap, aligning engineering capacity with product growth targets.',
    ],
    skills: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'Prisma',
      'System Architecture',
    ],
    isActive: true,
    color: '#3b5fb2',
  },
  {
    id: 'uoft-ta',
    role: 'Teaching Assistant, CSC309: Web Programming',
    company: 'University of Toronto',
    period: 'Jan 2025 – Apr 2025',
    description: [
      'Designed a full-stack programming assignment requiring students to build a RESTful loyalty-program backend with production-grade API constraints.',
      'Authored end-to-end technical specifications covering API contract design, server-side logic, and data modelling.',
      'Ran weekly office hours guiding students through REST API design, backend architecture, and debugging.',
      'Conceived the assignment brief later adopted as the foundation of PointPulse, the CSSU Loyalty Program.',
    ],
    skills: [
      'REST APIs',
      'Backend Architecture',
      'Technical Writing',
      'Mentorship',
    ],
    color: '#1E3765',
  },
];
