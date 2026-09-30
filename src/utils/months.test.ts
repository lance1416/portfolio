import { describe, expect, it } from 'vitest';
import {
  formatDuration,
  formatPeriod,
  monthName,
  nowMonthPosition,
  toMonthIndex,
  yearOf,
} from './months';

describe('toMonthIndex', () => {
  it('counts months so ranges are plain subtraction', () => {
    expect(toMonthIndex('2025-04') - toMonthIndex('2025-01')).toBe(3);
    expect(toMonthIndex('2026-01') - toMonthIndex('2025-12')).toBe(1);
  });

  it('round-trips through monthName and yearOf', () => {
    const index = toMonthIndex('2026-09');
    expect(monthName(index)).toBe('Sep');
    expect(yearOf(index)).toBe(2026);
  });
});

describe('nowMonthPosition', () => {
  it('is the month index plus the elapsed fraction of the month', () => {
    // 16 Sep 2026: 15 of 30 days elapsed
    const position = nowMonthPosition(new Date(2026, 8, 16));
    expect(position).toBeCloseTo(toMonthIndex('2026-09') + 15 / 30);
  });

  it('starts each month on a whole index', () => {
    expect(nowMonthPosition(new Date(2025, 0, 1))).toBe(
      toMonthIndex('2025-01'),
    );
  });
});

describe('formatPeriod', () => {
  it('drops the repeated year within one year', () => {
    expect(formatPeriod('2026-06', '2026-08')).toBe('Jun – Aug 2026');
  });

  it('keeps both years across a year boundary', () => {
    expect(formatPeriod('2025-11', '2026-02')).toBe('Nov 2025 – Feb 2026');
  });

  it('shows ongoing roles as Present', () => {
    expect(formatPeriod('2025-04')).toBe('Apr 2025 – Present');
  });
});

describe('formatDuration', () => {
  it.each([
    [1, '1 mo'],
    [3, '3 mos'],
    [12, '1 yr'],
    [13, '1 yr 1 mo'],
    [18, '1 yr 6 mos'],
    [24, '2 yrs'],
  ])('%i months → %s', (months, expected) => {
    expect(formatDuration(months)).toBe(expected);
  });
});
