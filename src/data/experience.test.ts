import { describe, expect, it } from 'vitest';
import { toMonthIndex } from '@/utils/months';
import { type ExperienceItem, experienceData, roleSpan } from './experience';

const role = (start: string, end?: string): ExperienceItem => ({
  id: 'test',
  role: 'Role',
  company: 'Company',
  label: 'Label',
  start,
  end,
  description: ['Lead'],
  skills: [],
  color: '#000000',
});

describe('roleSpan', () => {
  it('counts both the first and last month of a finished role', () => {
    const span = roleSpan(role('2025-01', '2025-04'));
    expect(span.months).toBe(4);
    expect(span.from).toBe(toMonthIndex('2025-01'));
    // Ends at the *end* of April, i.e. the start of May.
    expect(span.to).toBe(toMonthIndex('2025-05'));
  });

  it('runs an ongoing role up to now, counting the current month', () => {
    const now = toMonthIndex('2026-09') + 0.5;
    const span = roleSpan(role('2025-04'), now);
    expect(span.to).toBe(now);
    expect(span.months).toBe(18); // Apr 2025 … Sep 2026
  });
});

describe('experienceData', () => {
  it.each(experienceData.map((job) => [job.id, job] as const))(
    '%s has valid dates',
    (_, job) => {
      const pattern = /^\d{4}-(0[1-9]|1[0-2])$/;
      expect(job.start).toMatch(pattern);
      if (job.end !== undefined) {
        expect(job.end).toMatch(pattern);
        expect(toMonthIndex(job.end)).toBeGreaterThanOrEqual(
          toMonthIndex(job.start),
        );
      }
    },
  );

  it('has unique ids, since they double as anchor targets', () => {
    const ids = experienceData.map((job) => job.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
