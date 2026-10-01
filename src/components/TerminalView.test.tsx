import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';
import { renderWithProviders } from '@/test/render';
import { TerminalView } from './TerminalView';

const log = () => screen.getByRole('log');
const prompt = () => screen.getByRole('textbox', { name: 'Command' });

describe('TerminalView', () => {
  it('greets with whoami at home and a listing on a page', () => {
    renderWithProviders(<TerminalView />, { route: '/' });
    expect(log()).toHaveTextContent(profile.email);
  });

  it('opens in the current page’s directory', () => {
    renderWithProviders(<TerminalView />, { route: '/projects' });
    expect(screen.getByRole('heading')).toHaveTextContent('~/projects');
    expect(log()).toHaveTextContent('ls');
  });

  it('cd navigates the site and the prompt follows', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TerminalView />, { route: '/' });
    await user.type(prompt(), 'cd research{Enter}');
    expect(screen.getByTestId('location')).toHaveTextContent('/research');
    expect(screen.getByRole('heading')).toHaveTextContent('~/research');
  });

  it('completes with Tab and recalls history with the arrow keys', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TerminalView />, { route: '/' });
    await user.type(prompt(), 'pw{Tab}');
    expect(prompt()).toHaveValue('pwd ');
    await user.keyboard('{Enter}');
    expect(prompt()).toHaveValue('');
    await user.keyboard('{ArrowUp}');
    expect(prompt()).toHaveValue('pwd ');
  });

  it('runs a listed entry when it is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TerminalView />, { route: '/research' });
    await user.click(screen.getByRole('button', { name: 'awards.json' }));
    expect(log()).toHaveTextContent('cat ~/research/awards.json');
  });

  it('clear empties the screen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TerminalView />, { route: '/' });
    await user.type(prompt(), 'clear{Enter}');
    expect(log()).toBeEmptyDOMElement();
  });
});
