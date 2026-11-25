import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NeemaApp } from './NeemaApp';
import { FOODS_BY_STAGE } from './data';
import type { PregnancyData, User } from '@/types/pregnancy';

const user: User = { id: 'u1', name: 'Amina Nkeng', email: 'amina@example.com', role: 'mother' };
const preg = (week: number, trimester: 1 | 2 | 3): PregnancyData => ({ id: 'p1', userId: 'u1', currentWeek: week, trimester, startDate: new Date(), dueDate: new Date(Date.now() + (40 - week) * 7 * 86400000) });
const nav = () => within(screen.getByRole('navigation', { name: 'Main' }));

describe('foods per stage and region', () => {
  beforeEach(() => {
    window.localStorage.clear();
    Element.prototype.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('gives every stage its own foods', () => {
    const names = Object.values(FOODS_BY_STAGE).map((list) => list.map((f) => f.name).join('|'));
    expect(new Set(names).size).toBe(names.length);
  });

  it('shows first-trimester foods in week 8 and third-trimester foods in week 32', () => {
    const { unmount } = render(<NeemaApp user={user} pregnancy={preg(8, 1)} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(nav().getByRole('button', { name: 'Diet' }));
    expect(screen.getByRole('heading', { name: 'First weeks: folate and gentle foods' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Ginger/ })).toBeInTheDocument();
    unmount();
    window.localStorage.clear();
    render(<NeemaApp user={user} pregnancy={preg(32, 3)} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(nav().getByRole('button', { name: 'Diet' }));
    expect(screen.getByRole('heading', { name: 'Last weeks: calcium, iron and fibre' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Ginger/ })).not.toBeInTheDocument();
  });

  it('shows foods from her region once she has one', () => {
    window.localStorage.setItem('neema:region', JSON.stringify('Far North'));
    render(<NeemaApp user={user} pregnancy={preg(24, 2)} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(nav().getByRole('button', { name: 'Diet' }));
    expect(screen.getByRole('heading', { name: /^Popular in/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Moringa leaves/ })).toBeInTheDocument();
  });

  it('has no Diet tab when avoiding pregnancy, and corrects food myths in Methods', () => {
    window.localStorage.setItem('neema:journey', JSON.stringify('avoid'));
    render(<NeemaApp user={user} pregnancy={preg(24, 2)} onLogout={vi.fn()} extras={[]} />);
    expect(nav().queryByRole('button', { name: 'Diet' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Add a cup of water. 0 of/ }));
    expect(screen.getByRole('button', { name: /Add a cup of water. 1 of/ })).toBeInTheDocument();
    fireEvent.click(nav().getByRole('button', { name: 'Methods' }));
    expect(screen.getByRole('heading', { name: 'No food prevents pregnancy' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Common myths that don’t work' }));
    expect(screen.getByText('Neem leaves or neem tea')).toBeInTheDocument();
  });
});
