import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NeemaApp } from './NeemaApp';
import type { PregnancyData, User } from '@/types/pregnancy';

const user: User = { id: 'u1', name: 'Amina Nkeng', email: 'amina@example.com', role: 'mother' };
const pregnancy: PregnancyData = { id: 'p1', userId: 'u1', currentWeek: 24, trimester: 2, startDate: new Date(), dueDate: new Date(Date.now() + 112 * 86400000) };

describe('lighter mobile layout', () => {
  beforeEach(() => {
    window.localStorage.clear();
    Element.prototype.scrollTo = vi.fn();
  });
  const setup = () => render(<NeemaApp user={user} pregnancy={pregnancy} onLogout={vi.fn()} extras={[]} />);

  it('shows today’s tip as a story that opens full screen and moves on', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Story: Take your iron tablet with an orange, not with tea' }));
    const story = screen.getByRole('dialog', { name: /Story: Take your iron tablet/ });
    expect(within(story).getByText(/Vitamin C helps your body absorb iron/)).toBeInTheDocument();
    expect(within(story).getByText(/Source: WHO antenatal care recommendations/)).toBeInTheDocument();
    fireEvent.click(within(story).getByRole('button', { name: 'Next story' }));
    expect(screen.getByRole('dialog', { name: 'Story: About the size of an ear of corn' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close story' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps Home short: discreet mode and its lock-screen preview live in Profile', () => {
    setup();
    expect(screen.queryByText('LOCK-SCREEN PREVIEW')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open profile and settings' }));
    expect(screen.getByText('LOCK-SCREEN PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('Week 24: time for your iron and folic acid tablet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Discreet mode/ }));
    expect(screen.getByText('You have a new message')).toBeInTheDocument();
  });

  it('opens food details in a bottom sheet from the Diet shelf', () => {
    setup();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Diet' }));
    fireEvent.click(screen.getByRole('button', { name: /^Ndolé/ }));
    const sheet = screen.getByRole('dialog', { name: 'Ndolé' });
    expect(within(sheet).getByText('Bitter leaf')).toBeInTheDocument();
    fireEvent.click(within(sheet).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog', { name: 'Ndolé' })).not.toBeInTheDocument();
  });

  it('shows the method list six at a time', () => {
    setup();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Planning' }));
    expect(screen.queryByRole('button', { name: /^Withdrawal/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show all 12 methods' }));
    expect(screen.getByRole('button', { name: /^Withdrawal/ })).toBeInTheDocument();
  });
});
