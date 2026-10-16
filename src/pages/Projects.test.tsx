import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { resetCats } from '@/utils/cats';
import Projects from './Projects';

describe('Projects', () => {
  afterEach(() => {
    localStorage.clear();
    resetCats();
  });

  it('hides the cat once, by the paper crane', () => {
    // No media query matches in tests, so this is the swipe strip.
    renderWithProviders(<Projects />, { route: '/projects' });
    const [cat, ...others] = screen.getAllByRole('button', {
      name: 'Pet the cat',
    });
    expect(others).toHaveLength(0);
    expect(
      screen.getByRole('img', { name: /paper crane/ }),
    ).toBeInTheDocument();
    fireEvent.click(cat);
    expect(localStorage.getItem('portfolio-cats')).toBe('["projects"]');
  });
});
