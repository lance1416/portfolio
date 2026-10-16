import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { findCat, resetCats } from '@/utils/cats';
import { CatPaws } from './CatPaws';

describe('CatPaws', () => {
  afterEach(() => {
    localStorage.clear();
    resetCats();
  });

  it('shows nothing until the cat has been found once, then counts', () => {
    const { container } = render(<CatPaws />);
    expect(container).toBeEmptyDOMElement();

    act(() => findCat('notFound'));
    expect(
      screen.getByRole('img', { name: 'Yuyuan found in 1 of 4 places' }),
    ).toBeInTheDocument();
  });
});
