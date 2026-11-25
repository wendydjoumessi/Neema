import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MotherBabyArt, PregnantArt, ShieldArt, TryingArt } from '@/neema/art';
import logo from '@/assets/logo.png';
import type { JourneyId } from '@/neema/data';

interface JourneyScreenProps {
  onSelect: (journey: JourneyId) => void;
  onBack: () => void;
}

const OPTIONS: { id: JourneyId; title: string; text: string; Art: (p: { className?: string }) => JSX.Element }[] = [
  { id: 'preg', title: 'I’m pregnant', text: 'Week-by-week care, visits, diet and danger signs.', Art: PregnantArt },
  { id: 'pp', title: 'I recently had my baby', text: 'Recovery, breastfeeding and after-birth care.', Art: MotherBabyArt },
  { id: 'ttc', title: 'I’m trying to get pregnant', text: 'Fertile window, pre-conception checklist and diet.', Art: TryingArt },
  { id: 'avoid', title: 'I want to avoid pregnancy', text: 'Compare family planning methods privately.', Art: ShieldArt },
];

/** Asked after "I'm a mother": decides which setup steps and home screen she gets. */
export function JourneyScreen({ onSelect, onBack }: JourneyScreenProps) {
  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal">
      <div className="neema-rise mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-8 pt-3">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark hover:bg-neema-sand">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
        </header>
        <div className="mt-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">Getting started</div>
          <h1 className="mt-2 text-3xl font-bold leading-tight">What brings you to Neema?</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">Choose what fits you today. You can change it any time in your profile.</p>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          {OPTIONS.map(({ id, title, text, Art }, i) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              style={{ animationDelay: `${i * 70}ms` }}
              className="neema-rise group flex items-center gap-4 rounded-3xl border-2 border-transparent bg-white p-3.5 text-left shadow-neema-card transition-all duration-150 hover:border-neema-primary active:scale-[0.98]"
            >
              <span className="h-16 w-16 flex-none"><Art className="h-full w-full" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold">{title}</span>
                <span className="block text-neema-muted-strong">{text}</span>
              </span>
              <ArrowRight className="h-5 w-5 flex-none text-neema-dark" />
            </button>
          ))}
        </div>
        <p className="mt-auto pt-8 text-center text-[15px] text-neema-muted-strong">Family planning choices stay private, and discreet mode can hide Neema on a shared phone.</p>
      </div>
    </div>
  );
}
