import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { resetCats } from '@/utils/cats';
import NotFound from './NotFound';

describe('NotFound', () => {
  afterEach(() => {
    localStorage.clear();
    resetCats();
  });

  it("turns the signpost's boards into links to the pages they name", () => {
    renderWithProviders(<NotFound />, { route: '/nowhere' });
    for (const [name, href] of [
      ['Experience', '/experience'],
      ['Projects', '/projects'],
      ['Research', '/research'],
    ]) {
      expect(
        screen.getByRole('link', { name: `Go to ${name}` }),
      ).toHaveAttribute('href', href);
    }
  });

  it('counts the cat on the post once it has been petted', () => {
    renderWithProviders(<NotFound />, { route: '/nowhere' });
    fireEvent.click(screen.getByRole('button', { name: 'Pet the cat' }));
    expect(localStorage.getItem('portfolio-cats')).toBe('["notFound"]');
  });
});
