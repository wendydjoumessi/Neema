import { useState } from 'react';
import type { ReactNode } from 'react';
import logo from '@/assets/logo.png';
import { Calendar, ArrowLeft, ArrowRight, Baby, CalendarDays, Stethoscope } from 'lucide-react';
import { format, addDays, differenceInWeeks } from 'date-fns';
import { PregnancyData } from '@/types/pregnancy';

export type PregnancyEntry = { lastPeriodDate?: string; weeksAtEntry?: number };

interface PregnancySetupScreenProps {
  onComplete: (data: PregnancyData, entry: PregnancyEntry) => void;
  /** For women who are planning a family and not pregnant now. */
  onNotPregnant?: (journey: 'ttc' | 'avoid' | 'pp') => void;
  onBack: () => void;
  /** Shown above the last step's button, e.g. when saving failed. */
  error?: string;
}

export function PregnancySetupScreen({ onComplete, onNotPregnant, onBack, error }: PregnancySetupScreenProps) {
  const [notPregnant, setNotPregnant] = useState(false);
  const [step, setStep] = useState(1);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  const [doctorDueDate, setDoctorDueDate] = useState('');
  const [babyName, setBabyName] = useState('');

  const calculateDueDate = (): Date => {
    if (lastPeriodDate) {
      return addDays(new Date(lastPeriodDate), 280); // 40 weeks
    }
    if (gestationalWeeks) {
      const weeksRemaining = 40 - parseInt(gestationalWeeks);
      return addDays(new Date(), weeksRemaining * 7);
    }
    return addDays(new Date(), 280);
  };

  const calculateCurrentWeek = (): number => {
    if (gestationalWeeks) {
      return parseInt(gestationalWeeks);
    }
    if (lastPeriodDate) {
      return Math.max(1, differenceInWeeks(new Date(), new Date(lastPeriodDate)));
    }
    return 1;
  };

  const getTrimester = (week: number): 1 | 2 | 3 => {
    if (week <= 13) return 1;
    if (week <= 27) return 2;
    return 3;
  };

  const handleComplete = () => {
    const currentWeek = calculateCurrentWeek();
    const dueDate = doctorDueDate ? new Date(doctorDueDate) : calculateDueDate();
    
    const pregnancyData: PregnancyData = {
      id: Date.now().toString(),
      userId: 'user-1',
      startDate: lastPeriodDate ? new Date(lastPeriodDate) : new Date(),
      dueDate,
      doctorDueDate: doctorDueDate ? new Date(doctorDueDate) : undefined,
      currentWeek,
      trimester: getTrimester(currentWeek),
      babyName: babyName || undefined,
    };

    onComplete(pregnancyData, {
      lastPeriodDate: lastPeriodDate || undefined,
      weeksAtEntry: gestationalWeeks ? parseInt(gestationalWeeks) : undefined,
    });
  };

  const inputCls = 'min-h-[56px] w-full rounded-xl border border-neema-border bg-white px-4 text-lg text-neema-ink placeholder:text-neema-muted transition-colors duration-150 focus:border-neema-primary focus:outline-none focus:ring-2 focus:ring-neema-primary/30';
  const back = step === 1 ? onBack : () => setStep(step - 1);

  const Shell = ({ Icon, tint, title, sub, children, footer }: { Icon: typeof Calendar; tint: string; title: string; sub: string; children: ReactNode; footer: ReactNode }) => (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-8 pt-3">
        <header className="flex items-center justify-between">
          <button type="button" onClick={back} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark transition-colors duration-150 hover:bg-neema-sand">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
        </header>
        <div className="mt-4 flex gap-1.5" aria-label={`Setup step ${step} of 3`}>
          {[1, 2, 3].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${n <= step ? 'bg-neema-dark' : 'bg-neema-line'}`} />)}
        </div>
        <div className="mt-8">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tint}`}><Icon className="h-7 w-7" /></span>
          <div className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">Your pregnancy · {step} of 3</div>
          <h1 className="font-sans mt-2 text-3xl font-bold leading-tight">{title}</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">{sub}</p>
        </div>
        <div className="mt-6 flex flex-col gap-4">{children}</div>
        <div className="mt-auto flex flex-col gap-3 pt-8">{footer}</div>
      </div>
    </div>
  );

  const Primary = ({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-neema-dark px-4 text-lg font-semibold text-white shadow-neema-hero transition-transform duration-150 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none">
      {children}
    </button>
  );

  if (step === 1) {
    return Shell({
      Icon: Calendar, tint: 'bg-neema-primary-soft text-neema-dark',
      title: 'When did your last period start?', sub: 'This helps us work out your due date and current week.',
      children: (
        <>
          <section className="rounded-2xl bg-white p-5 shadow-neema-card">
            <label htmlFor="lmp-date" className="mb-1.5 block text-[13px] font-semibold">First day of your last period</label>
            <input id="lmp-date" type="date" value={lastPeriodDate} onChange={(e) => setLastPeriodDate(e.target.value)} max={format(new Date(), 'yyyy-MM-dd')} className={inputCls} />
          </section>
          <div className="flex items-center gap-3 text-sm text-neema-muted-strong"><span className="h-px flex-1 bg-neema-line" />or<span className="h-px flex-1 bg-neema-line" /></div>
          <section className="rounded-2xl bg-white p-5 shadow-neema-card">
            <label htmlFor="weeks" className="mb-1.5 block text-[13px] font-semibold">I know how many weeks pregnant I am</label>
            <div className="flex items-center gap-3">
              <input id="weeks" type="number" inputMode="numeric" placeholder="0" min="1" max="42" value={gestationalWeeks} onChange={(e) => setGestationalWeeks(e.target.value)} className={`${inputCls} w-28 text-center`} />
              <span className="text-neema-muted-strong">weeks</span>
            </div>
          </section>
        </>
      ),
      footer: (
        <>
          <Primary onClick={() => setStep(2)} disabled={!lastPeriodDate && !gestationalWeeks}>Continue <ArrowRight className="h-5 w-5" /></Primary>
          {onNotPregnant && !notPregnant && (
            <button type="button" onClick={() => setNotPregnant(true)} className="min-h-[48px] w-full rounded-xl font-semibold text-neema-dark">I’m not pregnant right now</button>
          )}
          {onNotPregnant && notPregnant && (
            <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-neema-card">
              <p className="font-semibold">What would you like Neema to help with?</p>
              <button type="button" onClick={() => onNotPregnant('pp')} className="min-h-[52px] rounded-xl border border-neema-border bg-white font-semibold">I recently had my baby</button>
              <button type="button" onClick={() => onNotPregnant('ttc')} className="min-h-[52px] rounded-xl border border-neema-border bg-white font-semibold">I’m trying to get pregnant</button>
              <button type="button" onClick={() => onNotPregnant('avoid')} className="min-h-[52px] rounded-xl border border-neema-border bg-white font-semibold">I want to avoid pregnancy</button>
            </div>
          )}
        </>
      ),
    });
  }

  if (step === 2) {
    const estimatedDueDate = calculateDueDate();
    return Shell({
      Icon: Stethoscope, tint: 'bg-neema-ochre-soft text-neema-ochre-ink',
      title: 'Your due date', sub: 'If your doctor or midwife gave you a date, use theirs.',
      children: (
        <>
          <section className="rounded-2xl bg-neema-dark p-5 text-white shadow-neema-hero">
            <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-white/90"><CalendarDays className="h-4 w-4" /> Estimated due date</div>
            <p className="mt-1 text-3xl font-bold">{format(estimatedDueDate, 'd MMMM yyyy')}</p>
          </section>
          <section className="rounded-2xl bg-white p-5 shadow-neema-card">
            <label htmlFor="doctor-date" className="mb-1.5 block text-[13px] font-semibold">Doctor’s due date (optional)</label>
            <input id="doctor-date" type="date" value={doctorDueDate} onChange={(e) => setDoctorDueDate(e.target.value)} className={inputCls} />
          </section>
        </>
      ),
      footer: <Primary onClick={() => setStep(3)}>Continue <ArrowRight className="h-5 w-5" /></Primary>,
    });
  }

  return Shell({
    Icon: Baby, tint: 'bg-neema-success-soft text-neema-success-ink',
    title: 'A nickname for your baby', sub: 'We’ll use it in your weekly updates. This is optional.',
    children: (
      <section className="rounded-2xl bg-white p-5 shadow-neema-card">
        <label htmlFor="baby-name" className="mb-1.5 block text-[13px] font-semibold">Nickname</label>
        <input id="baby-name" placeholder="e.g. Little one" value={babyName} onChange={(e) => setBabyName(e.target.value)} className={inputCls} />
        <p className="mt-2 text-sm text-neema-muted-strong">You can change this any time.</p>
      </section>
    ),
    footer: (
      <>
        {error && <p role="alert" className="rounded-xl bg-neema-primary-soft px-4 py-3 font-medium text-neema-dark">{error}</p>}
        <Primary onClick={handleComplete}>Start my journey <ArrowRight className="h-5 w-5" /></Primary>
        <button type="button" onClick={handleComplete} className="min-h-[48px] w-full rounded-xl font-semibold text-neema-muted-strong hover:text-neema-ink">Skip for now</button>
      </>
    ),
  });
}
