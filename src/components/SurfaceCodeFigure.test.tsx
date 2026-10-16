import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { SurfaceCodeFigure } from './SurfaceCodeFigure';

describe('SurfaceCodeFigure', () => {
  it('says how many checks each error trips as the button walks the qubits', () => {
    renderWithProviders(<SurfaceCodeFigure />);
    const status = screen.getByText(
      (_, el) => el?.getAttribute('aria-live') === 'polite',
    );
    expect(status).toBeEmptyDOMElement();

    const button = screen.getByRole('button', {
      name: 'Put an X error on a qubit',
    });
    // The centre qubit first: inside both interior Z faces.
    fireEvent.click(button);
    expect(status).toHaveTextContent('the two Z-checks');
    // Then a corner, which only one Z-check touches.
    fireEvent.click(button);
    expect(status).toHaveTextContent('the one Z-check');
  });
});
