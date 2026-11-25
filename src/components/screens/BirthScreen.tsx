import { useState } from 'react';
import { ArrowLeft, ArrowRight, HeartHandshake } from 'lucide-react';
import logo from '@/assets/logo.png';

interface BirthScreenProps {
  onComplete: (birthDate: string, nickname: string) => void;
  onBack: () => void;
  error?: string;
}

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

/** For mothers who have recently given birth: the birth date drives after-birth care week by week. */
export function BirthScreen({ onComplete, onBack, error }: BirthScreenProps) {
  const [date, setDate] = useState('');
  const [nickname, setNickname] = useState('');
  const today = new Date();
  const earliest = new Date(today.getTime() - 365 * 86_400_000);
  const input = 'min-h-[56px] w-full rounded-xl border border-neema-border bg-white px-4 text-lg text-neema-ink focus:border-neema-primary focus:outline-none focus:ring-2 focus:ring-neema-primary/30';

  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal">
      <div className="neema-rise mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-5 pb-8 pt-3">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark hover:bg-neema-sand">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
        </header>
        <div>
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-neema-success-soft text-neema-success-ink"><HeartHandshake className="h-6 w-6" /></span>
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">After birth</div>
          <h1 className="mt-2 text-3xl font-bold leading-tight">Congratulations! When was your baby born?</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">Neema will guide your recovery, postnatal visits and breastfeeding week by week.</p>
        </div>
        <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-neema-card">
          <div>
            <label htmlFor="birth-date" className="mb-1.5 block text-[15px] font-semibold">Baby’s date of birth</label>
            <input id="birth-date" type="date" className={input} value={date} min={iso(earliest)} max={iso(today)} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="baby-nick" className="mb-1.5 block text-[15px] font-semibold">Baby’s name or nickname (optional)</label>
            <input id="baby-nick" className={input} placeholder="e.g. Little one" value={nickname} maxLength={60} onChange={(e) => setNickname(e.target.value)} />
          </div>
        </section>
        <div className="mt-auto flex flex-col gap-3">
          {error && <p role="alert" className="rounded-xl bg-neema-primary-soft px-4 py-3 font-medium text-neema-dark">{error}</p>}
          <button type="button" disabled={!date} onClick={() => onComplete(date, nickname.trim())} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-neema-dark text-lg font-semibold text-white shadow-neema-hero active:scale-[0.98] disabled:opacity-50">
            Continue <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
