import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { resetCats } from '@/utils/cats';
import Experience from './Experience';

describe('Experience', () => {
  afterEach(() => {
    localStorage.clear();
    resetCats();
  });

  it('hides the cat once, at the current role’s desk', () => {
    renderWithProviders(<Experience />, { route: '/experience' });
    const [cat, ...others] = screen.getAllByRole('button', {
      name: 'Pet the cat',
    });
    expect(others).toHaveLength(0);
    fireEvent.click(cat);
    expect(localStorage.getItem('portfolio-cats')).toBe('["experience"]');
  });
});
