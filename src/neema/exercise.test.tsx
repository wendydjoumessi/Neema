import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NeemaApp } from './NeemaApp';
import { ANIMS, PROGRAMS, programSecs } from './exerciseAnim';
import { MOVES_BUILD, MOVES_FULL, MOVES_GENERAL, MOVES_GENTLE, MOVES_PREG } from './body';
import type { PregnancyData, User } from '@/types/pregnancy';

const user: User = { id: 'u1', name: 'Amina Nkeng', email: 'amina@example.com', role: 'mother' };
const birth = new Date(Date.now() - 20 * 86400000);
const afterBirth: PregnancyData = { id: 'p1', userId: 'u1', currentWeek: 40, trimester: 3, startDate: new Date(), dueDate: birth, birthDate: birth };

describe('exercise programs', () => {
  it('has an animated, timed program for every exercise in every plan', () => {
    for (const m of [...MOVES_GENTLE, ...MOVES_BUILD, ...MOVES_FULL, ...MOVES_PREG, ...MOVES_GENERAL]) {
      const prog = PROGRAMS[m.id];
      expect(prog, m.id).toBeDefined();
      expect(ANIMS[prog.anim].poses.length).toBeGreaterThan(1);
      for (const ph of prog.phases) expect(ph.pose).toBeLessThan(ANIMS[prog.anim].poses.length);
      expect(programSecs(prog)).toBeGreaterThan(0);
    }
  });
});

describe('guided exercise player', () => {
  let now = 0;
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('neema:journey', JSON.stringify('pp'));
    Element.prototype.scrollTo = vi.fn();
    vi.useFakeTimers();
    now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
  const advance = (secs: number) => {
    for (let i = 0; i < secs * 5; i++) act(() => { now += 200; vi.advanceTimersByTime(200); });
  };
  const open = () => {
    render(<NeemaApp user={user} pregnancy={afterBirth} onLogout={vi.fn()} extras={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /Tummy & exercise/ }));
  };

  it('shows animated previews and plays one exercise in time, then ticks it', () => {
    open();
    expect(screen.getAllByRole('img', { name: /Pelvic floor squeezes, animated/ }).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: /^Pelvic floor squeezes, animated/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    const dialog = screen.getByRole('dialog', { name: 'Exercise: Pelvic floor squeezes' });
    expect(dialog).toHaveTextContent('Squeeze and lift');
    expect(dialog).toHaveTextContent('Rep 1 of 10');
    advance(4.2);
    expect(dialog).toHaveTextContent('Relax');
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    advance(30);
    expect(dialog).toHaveTextContent('Rep 1 of 10');
    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    advance(90);
    expect(screen.getByText('Well done!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(screen.getByRole('button', { name: 'Done today: Pelvic floor squeezes' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('runs today’s routine through each exercise, with skip', () => {
    open();
    fireEvent.click(screen.getByRole('button', { name: /Start today’s routine/ }));
    expect(screen.getByText('Exercise 1 of 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Skip to next exercise' }));
    expect(screen.getByRole('dialog', { name: 'Exercise: Belly breathing' })).toHaveTextContent('Breathe in');
    fireEvent.click(screen.getByRole('button', { name: 'Close exercise' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
