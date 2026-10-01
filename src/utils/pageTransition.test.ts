import { describe, expect, it } from 'vitest';
import { chapterOf, directionBetween } from './pageTransition';

describe('chapterOf', () => {
  it('orders Home, then the navbar sections left to right', () => {
    expect(chapterOf('/')).toBe(0);
    expect(chapterOf('/experience')).toBe(1);
    expect(chapterOf('/projects')).toBe(2);
    expect(chapterOf('/research')).toBe(3);
  });

  it('puts unknown pages last', () => {
    expect(chapterOf('/nope')).toBeGreaterThan(chapterOf('/research'));
  });
});

describe('directionBetween', () => {
  it.each([
    ['/', '/experience', 'forward'],
    ['/experience', '/research', 'forward'],
    ['/research', '/experience', 'back'],
    ['/projects', '/', 'back'],
    // Re-entering the same chapter keeps turning forward.
    ['/projects', '/projects', 'forward'],
  ])('%s → %s turns %s', (from, to, direction) => {
    expect(directionBetween(from, to)).toBe(direction);
  });
});
