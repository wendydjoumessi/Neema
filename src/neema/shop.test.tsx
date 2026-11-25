import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NeemaApp } from './NeemaApp';
import type { PregnancyData, User } from '@/types/pregnancy';

const user: User = { id: 'u1', name: 'Amina Nkeng', email: 'amina@example.com', role: 'mother' };
const pregnancy: PregnancyData = { id: 'p1', userId: 'u1', currentWeek: 24, trimester: 2, startDate: new Date(), dueDate: new Date(Date.now() + 112 * 86400000) };

describe('pregnancy shopping page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    Element.prototype.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });
  const open = () => {
    render(<NeemaApp user={user} pregnancy={pregnancy} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Shopping' }));
  };

  it('shows when to get what as a timeline, with the bag locked until week 30', () => {
    open();
    const stages = within(screen.getByRole('navigation', { name: 'Shopping stages' }));
    expect(stages.getByRole('button', { name: /^Trimester 2: 0 of \d+ got\. Get by week 28$/ })).toBeInTheDocument();
    fireEvent.click(stages.getByRole('button', { name: 'Hospital bag: opens from week 30. Pack by week 36' }));
    expect(screen.getByRole('tab', { name: 'Hospital bag' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /^Bag for you: 0 of \d+ packed$/ })).toBeInTheDocument();
  });

  it('takes a ticked item off “Get now” and counts it', async () => {
    open();
    expect(screen.getByText(/Essentials: 0 of/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Got it: Insecticide-treated bed net' }));
    expect(screen.getByRole('button', { name: 'Got it: Insecticide-treated bed net' })).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Got it: Insecticide-treated bed net' })).not.toBeInTheDocument());
    expect(screen.getByText(/Essentials: 1 of/)).toBeInTheDocument();
  });
});
