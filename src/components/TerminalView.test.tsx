import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';
import { renderWithProviders } from '@/test/render';
import { TerminalView } from './TerminalView';

const firstLine = () =>
  screen.getByText(/sinan@macbook-pro/).textContent?.split('\n')[0];

describe('TerminalView', () => {
  it.each([
    ['/', 'whoami.json'],
    ['/experience', 'experience.json'],
    ['/projects', 'projects.json'],
    ['/research', 'research.json'],
    // React Router also matches a trailing slash; the file should follow it.
    ['/projects/', 'projects.json'],
    ['/unknown', 'whoami.json'],
  ])('%s → cat %s', (route, file) => {
    renderWithProviders(<TerminalView />, { route });
    expect(firstLine()).toBe(`sinan@macbook-pro:~$ cat ${file}`);
  });

  it('prints the data as JSON', () => {
    renderWithProviders(<TerminalView />, { route: '/' });
    const output = screen.getByText(/whoami\.json/).textContent ?? '';
    const json = JSON.parse(output.slice(output.indexOf('\n') + 1, -1));
    expect(json).toMatchObject({ name: profile.name, email: profile.email });
  });
});
