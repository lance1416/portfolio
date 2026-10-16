import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { resetCats } from '@/utils/cats';
import Research from './Research';

describe('Research', () => {
  afterEach(() => {
    localStorage.clear();
    resetCats();
  });

  it('hides the cat once, in the Radcliffe Camera under Oxford', () => {
    renderWithProviders(<Research />, { route: '/research' });
    const [cat, ...others] = screen.getAllByRole('button', {
      name: 'Pet the cat',
    });
    expect(others).toHaveLength(0);
    expect(
      screen.getByRole('img', { name: /Radcliffe Camera/ }),
    ).toBeInTheDocument();
    fireEvent.click(cat);
    expect(localStorage.getItem('portfolio-cats')).toBe('["research"]');
  });
});
