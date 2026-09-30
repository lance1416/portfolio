const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** 'YYYY-MM' → a month index (year * 12 + month), so ranges are plain subtraction. */
export function toMonthIndex(yearMonth: string): number {
  const [year, month] = yearMonth.split('-').map(Number);
  return year * 12 + (month - 1);
}

/** Today as a fractional month index, e.g. mid-September lands halfway through Sep. */
export function nowMonthPosition(date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return year * 12 + month + (date.getDate() - 1) / daysInMonth;
}

export function monthName(index: number): string {
  return MONTH_NAMES[index % 12];
}

export function yearOf(index: number): number {
  return Math.floor(index / 12);
}

/** 'Jun – Aug 2026', 'Jan 2025 – Mar 2026', or 'Apr 2025 – Present'. */
export function formatPeriod(start: string, end?: string): string {
  const s = toMonthIndex(start);
  const startLabel = `${monthName(s)} ${yearOf(s)}`;
  if (end === undefined) return `${startLabel} – Present`;

  const e = toMonthIndex(end);
  const endLabel = `${monthName(e)} ${yearOf(e)}`;
  return yearOf(s) === yearOf(e)
    ? `${monthName(s)} – ${endLabel}`
    : `${startLabel} – ${endLabel}`;
}

/** Inclusive month count as '3 mos', '1 yr', '1 yr 6 mos'. */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`);
  return parts.join(' ');
}
