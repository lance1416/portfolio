import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { profile } from '@/data/profile';
import { renderWithProviders } from '@/test/render';
import { CommandPalette } from './CommandPalette';

const openPalette = () =>
  act(() => {
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
  });

const input = () => screen.getByPlaceholderText('Type a command or search...');
const location = () => screen.getByTestId('location').textContent;
// The palette locks page scroll exactly while it's open, which is observable
// immediately, unlike DOM removal after the exit animation.
const isOpen = () => document.body.style.overflow === 'hidden';

function mockClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(writeText) },
  });
}

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens with Ctrl+K and closes with Escape', () => {
    renderWithProviders(<CommandPalette />);
    expect(isOpen()).toBe(false);

    openPalette();
    expect(input()).toBeInTheDocument();
    expect(isOpen()).toBe(true);

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(isOpen()).toBe(false);
  });

  it('filters actions by name', () => {
    renderWithProviders(<CommandPalette />);
    openPalette();

    fireEvent.change(input(), { target: { value: 'proj' } });

    const items = screen.getAllByRole('button', { name: /^Go to/ });
    expect(items.map((item) => item.textContent)).toEqual(['Go to Projects']);
  });

  it('runs the highlighted action with the arrow keys and Enter', () => {
    renderWithProviders(<CommandPalette />);
    openPalette();

    // Items: Home, Experience, …; move from Home to Experience.
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });

    expect(location()).toBe('/experience');
    expect(isOpen()).toBe(false);
  });

  it('shows the copied state, then closes on its own', async () => {
    mockClipboard(() => Promise.resolve());
    renderWithProviders(<CommandPalette />);
    openPalette();

    await act(async () => {
      fireEvent.click(screen.getByText('Copy Email Address'));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(profile.email);
    expect(screen.getByText('Email Copied!')).toBeInTheDocument();
    expect(isOpen()).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(isOpen()).toBe(false);
  });

  it('does not let a pending auto-close shut a reopened palette', async () => {
    mockClipboard(() => Promise.resolve());
    renderWithProviders(<CommandPalette />);
    openPalette();
    await act(async () => {
      fireEvent.click(screen.getByText('Copy Email Address'));
    });

    // Close early, reopen, then let the old timer's deadline pass.
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    openPalette();
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(isOpen()).toBe(true);
    expect(screen.getByText('Copy Email Address')).toBeInTheDocument();
  });

  it('does not claim success when the clipboard is unavailable', async () => {
    mockClipboard(() => Promise.reject(new DOMException('denied')));
    renderWithProviders(<CommandPalette />);
    openPalette();

    await act(async () => {
      fireEvent.click(screen.getByText('Copy Email Address'));
    });

    expect(screen.queryByText('Email Copied!')).not.toBeInTheDocument();
    expect(isOpen()).toBe(false);
  });
});
