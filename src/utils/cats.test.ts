import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { findCat, resetCats, useCatsFound } from './cats';

const KEY = 'portfolio-cats';

describe('cats', () => {
  afterEach(() => {
    localStorage.clear();
    resetCats();
  });

  it('remembers each spot once, in a fixed order', () => {
    const { result } = renderHook(useCatsFound);
    expect(result.current).toEqual([]);

    act(() => {
      findCat('research');
      findCat('notFound');
      findCat('research');
    });
    expect(result.current).toEqual(['notFound', 'research']);
    expect(JSON.parse(localStorage.getItem(KEY) ?? '')).toEqual([
      'notFound',
      'research',
    ]);
  });

  it('picks up what an earlier visit saved, ignoring junk', () => {
    localStorage.setItem(KEY, JSON.stringify(['projects', 'nope', 3]));
    resetCats();
    expect(renderHook(useCatsFound).result.current).toEqual(['projects']);

    localStorage.setItem(KEY, '{not json');
    resetCats();
    expect(renderHook(useCatsFound).result.current).toEqual([]);
  });
});
