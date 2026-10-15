import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { CnotFigure } from './CnotFigure';

describe('CnotFigure', () => {
  it('says where each error ends up', () => {
    renderWithProviders(<CnotFigure />);
    const status = screen.getByText(
      (_, el) => el?.getAttribute('aria-live') === 'polite',
    );
    expect(status).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole('button', { name: /Z error/ }));
    expect(status).toHaveTextContent('copied onto the control');

    fireEvent.click(screen.getByRole('button', { name: /X error/ }));
    expect(status).toHaveTextContent('copied onto the target');
  });
});
