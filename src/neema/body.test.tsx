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
    expect(checkIngredients('Silica, Sahara clay')).toEqual([]);
    expect(checkIngredients('Centella asiatica extract')[0].name).toBe('Centella asiatica (gotu kola)');
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
    expect(screen.getByText('Not completely, but they fade a lot.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Stretch marks fade over time/ })).toBeInTheDocument();
    // Ingredient names only: no brands or products
    expect(screen.getByRole('heading', { name: 'Ingredients that help marks fade' })).toBeInTheDocument();
    for (const name of ['Hyaluronic acid', 'Centella asiatica', 'Shea butter', 'Cocoa butter', 'Sweet almond oil', 'Coconut oil', 'Tretinoin']) {
      expect(screen.getByRole('button', { name: new RegExp(`^${name}`) })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('button', { name: /^Hyaluronic acid/ }));
    expect(screen.getByRole('status')).toHaveTextContent(/best-studied for new/);
    expect(document.body.textContent).not.toMatch(/vaseline|nivea|bio-oil|palmer|retin-a|accutane|®|™/i);
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

describe('body and skin redesign', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('neema:journey', JSON.stringify('pp'));
    Element.prototype.scrollTo = vi.fn();
  });

  it('shows recovery as a ring and the stages as steps, unlocking after a check', () => {
    render(<NeemaApp user={user} pregnancy={afterBirth} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /Tummy & exercise/ }));
    expect(screen.getByRole('img', { name: /Womb recovery about \d+ percent/ })).toBeInTheDocument();
    const steps = within(screen.getByRole('list', { name: 'Your recovery stages' }));
    expect(steps.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: /^Start today’s routine · \d+ min$/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /A health worker checked me/ }));
    expect(within(screen.getByRole('list', { name: 'Your recovery stages' })).getAllByRole('listitem')[1]).toHaveAttribute('aria-current', 'step');
  });

  it('switches sections with tabs and marks ingredient results by safety', () => {
    render(<NeemaApp user={user} pregnancy={afterBirth} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /Tummy & exercise/ }));
    fireEvent.click(screen.getByRole('tab', { name: 'Ingredients' }));
    expect(screen.getByRole('tab', { name: 'Ingredients' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.change(screen.getByLabelText(/Type an ingredient/), { target: { value: 'hydroquinone, shea butter' } });
    expect(screen.getByText('Avoid in pregnancy and breastfeeding')).toBeInTheDocument();
    expect(screen.getByText('Generally safe')).toBeInTheDocument();
  });
});
