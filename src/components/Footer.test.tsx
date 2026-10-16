import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/context/ThemeContext';
import { CAT_SPOTS, findCat, resetCats } from '@/utils/cats';
import { claimOneScreen } from '@/utils/oneScreen';
import { Footer } from './Footer';

const renderFooter = () =>
  render(
    <ThemeProvider>
      <Footer />
    </ThemeProvider>,
  );

describe('Footer', () => {
  afterEach(() => {
    localStorage.clear();
    resetCats();
  });

  it('has the cat move in once every hiding place is found', async () => {
    // No media query matches in tests, so there's no dock: it naps here.
    renderFooter();
    act(() => {
      for (const spot of CAT_SPOTS.slice(1)) findCat(spot);
    });
    expect(
      screen.queryByRole('button', { name: 'Pet Yuyuan' }),
    ).not.toBeInTheDocument();

    act(() => findCat(CAT_SPOTS[0]));
    expect(
      await screen.findByRole('button', { name: 'Pet Yuyuan' }),
    ).toBeInTheDocument();
  });

  it('sits beside the dock while a page fills one screen, then goes back', () => {
    renderFooter();
    const footer = screen.getByRole('contentinfo');
    expect(footer).not.toHaveClass('fixed');

    let release = () => {};
    act(() => {
      release = claimOneScreen();
    });
    expect(footer).toHaveClass('fixed');

    act(release);
    expect(footer).not.toHaveClass('fixed');
  });
});
