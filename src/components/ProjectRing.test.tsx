import { act, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CommandPaletteProvider } from '@/context/CommandPaletteContext';
import type { ProjectItem } from '@/data/projects';
import { renderWithProviders } from '@/test/render';
import { ProjectRing } from './ProjectRing';

const project = (title: string): ProjectItem => ({
  id: title.toLowerCase(),
  title,
  subtitle: `${title} subtitle`,
  year: '2024',
  description: [`${title} description`],
  skills: [],
});
const PROJECTS = ['Alpha', 'Beta', 'Gamma'].map(project);

/** Title of the front project, read from the progress bar marked current. */
const front = () =>
  screen
    .getAllByRole('button', { name: /^Show / })
    .find((bar) => bar.getAttribute('aria-current') === 'true')
    ?.getAttribute('aria-label')
    ?.replace('Show ', '');

// The wheel handler times gestures with performance.now(); drive it by hand.
let clock = 0;
beforeEach(() => {
  clock = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => clock);
});
afterEach(() => {
  vi.restoreAllMocks();
});

function wheel(delta: { deltaX?: number; deltaY?: number }, afterMs = 16) {
  clock += afterMs;
  const event = new WheelEvent('wheel', { ...delta, cancelable: true });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

/** A trackpad flick: a burst of decaying events, inertia tail included. */
function flick(direction: 1 | -1) {
  for (let i = 0; i < 30; i++) {
    wheel({ deltaY: direction * Math.max(2, 60 * 0.88 ** i) });
  }
}

const pause = (ms = 400) => {
  clock += ms;
};

describe('ProjectRing', () => {
  it('turns exactly one project per flick, inertia included', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    expect(front()).toBe('Alpha');

    flick(1);
    expect(front()).toBe('Beta');

    pause();
    flick(1);
    expect(front()).toBe('Gamma');

    pause();
    flick(-1);
    expect(front()).toBe('Beta');
  });

  it('never steps twice within one unbroken wheel stream', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    // Two seconds of events 50ms apart: long, but never a pause.
    for (let i = 0; i < 40; i++) wheel({ deltaY: 40 }, 50);
    expect(front()).toBe('Beta');
  });

  it('follows horizontal wheel movement too', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    wheel({ deltaX: 50 });
    expect(front()).toBe('Beta');
  });

  it('stops at both ends', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    flick(-1);
    expect(front()).toBe('Alpha');

    for (let i = 0; i < 5; i++) {
      pause();
      flick(1);
    }
    expect(front()).toBe('Gamma');
  });

  it('takes over the wheel so the page itself never scrolls', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    expect(wheel({ deltaY: 5 }).defaultPrevented).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('steps with the arrow and Page keys', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(front()).toBe('Beta');
    fireEvent.keyDown(window, { key: 'PageDown' });
    expect(front()).toBe('Gamma');
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(front()).toBe('Beta');
  });

  it('jumps straight to a project from its progress bar', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    const bars = screen.getAllByRole('button', { name: 'Show Gamma' });
    fireEvent.click(bars[0]);
    expect(front()).toBe('Gamma');
  });

  it('leaves the wheel and keys alone while the command palette is open', () => {
    renderWithProviders(<ProjectRing projects={PROJECTS} />);
    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });

    const event = wheel({ deltaY: 100 });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(front()).toBe('Alpha');
    expect(event.defaultPrevented).toBe(false);
  });

  it('mounts and unmounts cleanly under StrictMode', () => {
    // Regression: an effect implicitly returned scrollTo()'s value, which some
    // browser extensions turn into a Promise; React then called it as cleanup.
    vi.mocked(window.scrollTo).mockReturnValue(
      Promise.resolve() as unknown as undefined,
    );
    const consoleError = vi.spyOn(console, 'error');

    const { unmount } = render(
      <StrictMode>
        <CommandPaletteProvider>
          <ProjectRing projects={PROJECTS} />
        </CommandPaletteProvider>
      </StrictMode>,
    );
    unmount();

    expect(consoleError).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('');
  });
});
