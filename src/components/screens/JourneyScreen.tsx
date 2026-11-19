import { ArrowLeft, ArrowRight, Baby, HeartHandshake, CalendarHeart, ShieldCheck } from 'lucide-react';
import logo from '@/assets/logo.png';
import type { JourneyId } from '@/neema/data';

interface JourneyScreenProps {
  onSelect: (journey: JourneyId) => void;
  onBack: () => void;
}

const OPTIONS: { id: JourneyId; title: string; text: string; Icon: typeof Baby; tint: string }[] = [
  { id: 'preg', title: 'I’m pregnant', text: 'Week-by-week care, visits, diet and danger signs.', Icon: Baby, tint: 'bg-neema-primary-soft text-neema-dark' },
  { id: 'pp', title: 'I recently had my baby', text: 'Recovery, breastfeeding and after-birth care.', Icon: HeartHandshake, tint: 'bg-neema-success-soft text-neema-success-ink' },
  { id: 'ttc', title: 'I’m trying to get pregnant', text: 'Fertile window, pre-conception checklist and diet.', Icon: CalendarHeart, tint: 'bg-neema-ochre-soft text-neema-ochre-ink' },
  { id: 'avoid', title: 'I want to avoid pregnancy', text: 'Compare family planning methods privately.', Icon: ShieldCheck, tint: 'bg-neema-lilac text-neema-lilac-ink' },
];

/** Asked after "I'm a mother": decides which setup steps and home screen she gets. */
export function JourneyScreen({ onSelect, onBack }: JourneyScreenProps) {
  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-8 pt-3">
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
          {OPTIONS.map(({ id, title, text, Icon, tint }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="group flex items-center gap-4 rounded-2xl border-2 border-transparent bg-white p-4 text-left shadow-neema-card transition-all duration-150 hover:border-neema-primary active:scale-[0.98]"
            >
              <span className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl ${tint}`}><Icon className="h-7 w-7" /></span>
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
