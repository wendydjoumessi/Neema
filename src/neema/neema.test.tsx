import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NeemaApp } from './NeemaApp';
import { findDangerSign } from './safety';
import { DISCLAIMER } from './ui';
import type { PregnancyData, User } from '@/types/pregnancy';

const user: User = { id: 'u1', name: 'Amina Nkeng', email: 'amina@example.com', role: 'mother' };
const pregnancy: PregnancyData = {
  id: 'p1', userId: 'u1', currentWeek: 24, trimester: 2,
  startDate: new Date(Date.now() - 168 * 86400000), dueDate: new Date(Date.now() + 112 * 86400000),
};

function setup(onLogout = vi.fn()) {
  Element.prototype.scrollTo = vi.fn();
  render(<NeemaApp user={user} pregnancy={pregnancy} onLogout={onLogout} extras={[{ id: 'x', label: 'Spiritual support', description: 'Prayers', render: () => <div>Prayer screen</div> }]} />);
  return { onLogout };
}

describe('Neema safety rules', () => {
  it('finds danger signs in English and French', () => {
    expect(findDangerSign('I have some bleeding')).toBe('bleeding');
    expect(findDangerSign("J'ai de la fièvre")).toContain('fièvre');
    expect(findDangerSign('Is ndolé good for iron?')).toBeNull();
  });
});

describe('Neema app', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows the home screen with the pregnancy week and a subtle SOS', () => {
    setup();
    expect(screen.getByText('Week 24')).toBeInTheDocument();
    expect(screen.getByText(/ear of corn/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'SOS emergency help' }).length).toBeGreaterThan(0);
  });

  it('opens every tab without crashing', () => {
    setup();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const label of ['Ask Neema', 'Diet', 'Family plan.', 'Shopping', 'Home']) {
      fireEvent.click(within(nav).getByRole('button', { name: label }));
    }
    expect(screen.getByText('Week 24')).toBeInTheDocument();
  });

  it('routes a danger word in chat to calm next steps with the disclaimer', () => {
    setup();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Ask Neema' }));
    const input = screen.getByLabelText('Ask Neema a question');
    fireEvent.change(input, { target: { value: 'I have bleeding since this morning' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    const dialog = screen.getByRole('dialog', { name: 'Symptom checker' });
    expect(within(dialog).getByText('Here’s what to do')).toBeInTheDocument();
    expect(within(dialog).getByText(DISCLAIMER)).toBeInTheDocument();
  });

  it('switches family planning to trying-to-conceive and edits the period length', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open profile and settings' }));
    fireEvent.click(screen.getByRole('radio', { name: /trying to conceive/ }));
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Family plan.' }));
    expect(screen.getByText('My fertile window')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'One day longer' }));
    expect(screen.getByText('6 days')).toBeInTheDocument();
  });

  it('opens a pump guide on the checklist', () => {
    setup();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Shopping' }));
    fireEvent.click(screen.getAllByRole('button', { name: /How to use/ })[1]);
    expect(screen.getByText(/Centre the nipple in the funnel/)).toBeInTheDocument();
  });

  it('opens an earlier screen from Profile and logs out', () => {
    const { onLogout } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open profile and settings' }));
    fireEvent.click(screen.getByRole('button', { name: /Spiritual support/ }));
    expect(screen.getByText('Prayer screen')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Back to Profile/ }));
    fireEvent.click(screen.getByRole('button', { name: /LOG OUT/ }));
    expect(onLogout).toHaveBeenCalled();
  });
});
