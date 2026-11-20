import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NeemaApp } from './NeemaApp';
import { checkIngredients } from './body';
import type { PregnancyData, User } from '@/types/pregnancy';

const user: User = { id: 'u1', name: 'Amina Nkeng', email: 'amina@example.com', role: 'mother' };
const birth = new Date(Date.now() - 20 * 86400000);
const afterBirth: PregnancyData = { id: 'p1', userId: 'u1', currentWeek: 40, trimester: 3, startDate: new Date(), dueDate: birth, birthDate: birth };
const pregnant: PregnancyData = { id: 'p1', userId: 'u1', currentWeek: 24, trimester: 2, startDate: new Date(), dueDate: new Date(Date.now() + 112 * 86400000) };

describe('ingredient checker', () => {
  it('finds ingredients in a pasted label, most important first', () => {
    const r = checkIngredients('Aqua, Glycerin, Butyrospermum Parkii (Shea) Butter, Hydroquinone 2%, Clobetasol propionate');
    expect(r.map((x) => x.cls)).toEqual(['avoid', 'avoid', 'safe', 'safe']);
    expect(r[0].name).toBe('Hydroquinone');
    expect(checkIngredients('karité')[0].name).toBe('Shea butter (karité)');
    expect(checkIngredients('niaci')[0].name).toBe('Niacinamide');
    expect(checkIngredients('ab')).toEqual([]);
  });
});

describe('body and skin after birth', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('neema:journey', JSON.stringify('pp'));
    Element.prototype.scrollTo = vi.fn();
  });

  it('opens from the after-birth home with a gentle plan that unlocks after a check', () => {
    render(<NeemaApp user={user} pregnancy={afterBirth} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /Tummy & exercise/ }));
    expect(screen.getByRole('heading', { name: 'Your body after birth' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gentle start' })).toBeInTheDocument();
    expect(screen.queryByText('Bridges')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Pelvic floor squeezes/ }));
    expect(screen.getByText(/Hold for 3 to 5 seconds/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Done today: Pelvic floor squeezes' }));
    expect(screen.getByText('1 of 4 today')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /A health worker checked me/ }));
    expect(screen.getByRole('heading', { name: 'Building strength' })).toBeInTheDocument();
    expect(screen.getByText('Bridges')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: '2 fingers or more' }));
    expect(screen.getByText(/avoid sit-ups, crunches and heavy lifting/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { name: 'Your body after birth', level: 2 })).toBeInTheDocument();
  });

  it('answers honestly about stretch marks and checks product ingredients', () => {
    render(<NeemaApp user={user} pregnancy={afterBirth} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /Stretch marks & skin/ }));
    expect(screen.getByRole('heading', { name: 'Can stretch marks be wiped away?' })).toBeInTheDocument();
    expect(screen.getByText(/no cream or oil can make them disappear completely/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Check a product’s ingredients/ }));
    fireEvent.change(screen.getByLabelText(/Type an ingredient/), { target: { value: 'Mercurous chloride, shea butter' } });
    const results = screen.getAllByRole('article');
    expect(within(results[0]).getByText('Avoid in pregnancy and breastfeeding')).toBeInTheDocument();
    expect(within(results[0]).getByText('Mercury')).toBeInTheDocument();
    expect(within(results[1]).getByText('Generally safe')).toBeInTheDocument();
  });

  it('is also reachable from Profile and during pregnancy', () => {
    window.localStorage.setItem('neema:journey', JSON.stringify('preg'));
    render(<NeemaApp user={user} pregnancy={pregnant} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /Skin changes & safe products/ }));
    expect(screen.getByRole('heading', { name: 'When itching is a warning sign' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByRole('heading', { name: 'Safe activity in pregnancy' })).toBeInTheDocument();
  });
});
