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
    for (const label of ['Ask Neema', 'Diet', 'Planning', 'Shopping', 'Home']) {
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
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'My cycle' }));
    // No period date yet: Neema asks for it instead of inventing one.
    expect(screen.getByRole('heading', { name: 'When did your last period start?' })).toBeInTheDocument();
    expect(screen.queryByText('My fertile window')).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('First day of my last period'), { target: { value: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10) } });
    expect(screen.getByText('My fertile window')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Today is day 4/ })).toBeInTheDocument();
    // Period and cycle length live in the settings sheet
    fireEvent.click(screen.getByRole('button', { name: 'Cycle settings' }));
    const sheet = screen.getByRole('dialog', { name: 'Cycle settings' });
    fireEvent.click(within(sheet).getByRole('button', { name: 'One day longer' }));
    expect(within(sheet).getByText('6 days')).toBeInTheDocument();
    fireEvent.click(within(sheet).getByRole('button', { name: 'Close' }));
    // Checklist, food and help are one tap apart
    fireEvent.click(screen.getByRole('button', { name: 'Done: Start folic acid every day' }));
    expect(screen.getByRole('button', { name: 'Done: Start folic acid every day' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Start folic acid every day' }));
    expect(screen.getByText(/Ideally 2–3 months before conceiving/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Food' }));
    expect(screen.getByText('Folate-rich greens')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Get help' }));
    expect(screen.getByRole('heading', { name: 'When to see a health worker together' })).toBeInTheDocument();
  });

  it('opens a pump guide on the checklist', () => {
    setup();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Shopping' }));
    // Week 24: trimester 2 and 3 items are due now; the hospital bag is coming up later.
    expect(screen.getByRole('heading', { name: 'Trimester 2' })).toBeInTheDocument();
    expect(screen.getByText('Coming up from week 30')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Everything' }));
    fireEvent.click(screen.getByRole('button', { name: /^Manual breast pump/ }));
    expect(screen.getByText(/Centre the nipple in the funnel/)).toBeInTheDocument();
  });

  it('packs the hospital bag with the clinic’s own items', () => {
    setup();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Shopping' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Hospital bag' }));
    expect(screen.getByRole('heading', { name: 'Ready for labour?' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Add an item from your clinic’s list'), { target: { value: 'Bleach, 1 bottle' } });
    fireEvent.submit(screen.getByLabelText('Add an item from your clinic’s list').closest('form')!);
    fireEvent.click(screen.getByRole('button', { name: 'Got it: Bleach, 1 bottle' }));
    expect(screen.getByRole('button', { name: 'Got it: Bleach, 1 bottle' })).toHaveAttribute('aria-pressed', 'true');
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

  it('shows each journey its own home, with no invented dates', () => {
    setup();
    const nav = () => within(screen.getByRole('navigation', { name: 'Main' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open profile and settings' }));
    fireEvent.click(screen.getByRole('radio', { name: /avoiding pregnancy/ }));
    expect(nav().queryByRole('button', { name: 'Shopping' })).not.toBeInTheDocument();
    fireEvent.click(nav().getByRole('button', { name: 'Home' }));
    expect(screen.getByRole('heading', { name: 'Find a method that fits your life' })).toBeInTheDocument();
    expect(screen.queryByText(/Cycle day|Next period/)).not.toBeInTheDocument();

    fireEvent.click(nav().getByRole('button', { name: 'Methods' }));
    fireEvent.change(screen.getByLabelText('What I use now'), { target: { value: 'inject3' } });
    fireEvent.change(screen.getByLabelText('Date of my last injection'), { target: { value: '2026-10-01' } });
    fireEvent.click(nav().getByRole('button', { name: 'Home' }));
    expect(screen.getByText('Next injection by 31 Dec')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open profile and settings' }));
    fireEvent.click(screen.getByRole('radio', { name: /trying to conceive/ }));
    fireEvent.click(nav().getByRole('button', { name: 'Home' }));
    expect(screen.getByRole('heading', { name: 'Let’s find your fertile days' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('First day of my last period'), { target: { value: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10) } });
    expect(screen.getByText(/cycle day 4/i)).toBeInTheDocument();
  });

  it('lets her edit, remove and put back items on the shopping list', () => {
    setup();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Shopping' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Hospital bag' }));

    // Edit one of Neema's items
    fireEvent.click(screen.getByRole('button', { name: /^Maternity pads/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit Maternity pads' }));
    fireEvent.change(screen.getByLabelText('Item'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Enter the item name.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Item'), { target: { value: 'Sanitary pads (heavy flow)' } });
    fireEvent.change(screen.getByLabelText(/How many/), { target: { value: '4 packs' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Sanitary pads (heavy flow)')).toBeInTheDocument();
    expect(screen.getByText('4 packs')).toBeInTheDocument();

    // Remove it, then put it back from Everything
    fireEvent.click(screen.getByRole('button', { name: 'Remove Sanitary pads (heavy flow)' }));
    fireEvent.click(within(screen.getByRole('alert')).getByRole('button', { name: 'Remove' }));
    expect(screen.queryByText('Sanitary pads (heavy flow)')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Everything' }));
    fireEvent.click(screen.getByRole('button', { name: /Removed from my list \(1\)/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Put back Maternity pads' }));
    expect(screen.getByText('Sanitary pads (heavy flow)')).toBeInTheDocument();

    // Her own item: add, edit, remove
    fireEvent.click(screen.getByRole('tab', { name: 'Hospital bag' }));
    const add = screen.getByLabelText('Add an item from your clinic’s list');
    fireEvent.change(add, { target: { value: 'Bleach' } });
    fireEvent.submit(add.closest('form')!);
    fireEvent.click(screen.getByRole('button', { name: /^Bleach/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit Bleach' }));
    fireEvent.change(screen.getByLabelText(/How many/), { target: { value: '1 bottle' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('1 bottle')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Bleach' }));
    fireEvent.click(within(screen.getByRole('alert')).getByRole('button', { name: 'Remove' }));
    expect(screen.queryByText('Bleach')).not.toBeInTheDocument();
  });
});
