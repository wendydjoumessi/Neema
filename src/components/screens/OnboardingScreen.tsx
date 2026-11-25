import { useRef, useState, type TouchEvent } from 'react';
import { BabyArt, PregnantArt, SupportArt, StethoArt } from '@/neema/art';
import { ArrowLeft, ArrowRight, Baby, CalendarHeart, HeartPulse, Users, ShieldCheck, Languages, WifiOff, type LucideIcon } from 'lucide-react';
import heroImage from '@/assets/hero-pregnant-new.jpg';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';

interface OnboardingScreenProps {
  onComplete: (role: 'mother' | 'partner') => void;
}

type Slide = { Icon: LucideIcon; tint: string; eyebrow: string; title: string; description: string };

/** Picture for each slide after the first (the first uses the photo). */
const SLIDE_ART = [PregnantArt, BabyArt, SupportArt, StethoArt];
/** A soft colour wash per slide, from the Neema palette. */
const SLIDE_WASH = ['from-neema-primary-soft to-white', 'from-neema-ochre-soft to-white', 'from-neema-lilac to-white', 'from-neema-success-soft to-white'];

const slides: Slide[] = [
  { Icon: HeartPulse, tint: 'bg-neema-primary-soft text-neema-dark', eyebrow: 'Welcome', title: 'Care for every stage', description: 'A free companion for pregnancy, the months after birth and family planning, in English and French.' },
  { Icon: Baby, tint: 'bg-neema-ochre-soft text-neema-ochre-ink', eyebrow: 'Week by week', title: 'Follow your baby’s growth', description: 'Weekly updates on your baby and your body, with simple advice using foods from your own market.' },
  { Icon: Users, tint: 'bg-neema-lilac text-neema-lilac-ink', eyebrow: 'Together', title: 'Bring your partner along', description: 'Invite your husband, mother or sister. You choose what they see, and alerts can reach them by SMS.' },
  { Icon: CalendarHeart, tint: 'bg-neema-success-soft text-neema-success-ink', eyebrow: 'Ready', title: 'Prepared and supported', description: 'From danger signs to the hospital bag and daily encouragement, Neema is with you every step.' },
];

const trust = [
  { Icon: ShieldCheck, label: 'Medically reviewed' },
  { Icon: Languages, label: 'English & Français' },
  { Icon: WifiOff, label: 'Works offline' },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [showRoles, setShowRoles] = useState(false);
  const touchX = useRef<number | null>(null);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  if (showRoles) {
    const roles = [
      { id: 'mother' as const, Art: PregnantArt, title: 'I’m a mother', text: 'Pregnant, after birth, or planning a family.' },
      { id: 'partner' as const, Art: SupportArt, title: 'I’m a support person', text: 'Husband, mother, sister or trusted friend.' },
    ];
    return (
      <div className="relative min-h-screen overflow-hidden bg-neema-cream font-sans text-neema-ink">
        <div aria-hidden="true" className="neema-drift pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-neema-primary/10 blur-xl" />
        <div aria-hidden="true" className="neema-drift-slow pointer-events-none absolute -left-20 bottom-24 h-56 w-56 rounded-full bg-neema-ochre/15 blur-xl" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-8 pt-3">
          <header className="flex items-center justify-between">
            <button type="button" onClick={() => setShowRoles(false)} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark transition-colors duration-150 hover:bg-neema-sand">
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
            <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
          </header>
          <div className="neema-rise mt-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">Getting started</div>
            <h1 className="font-sans mt-2 text-3xl font-bold leading-tight">Who will use Neema?</h1>
            <p className="mt-2 text-lg text-neema-muted-strong">We’ll tailor your guidance to you.</p>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {roles.map(({ id, Art, title, text }, i) => (
              <button key={id} type="button" onClick={() => onComplete(id)} style={{ animationDelay: `${150 + i * 110}ms` }}
                className="neema-rise group flex items-center gap-4 rounded-3xl border-2 border-transparent bg-white p-4 text-left shadow-neema-card transition-all duration-150 hover:border-neema-primary active:scale-[0.98]">
                <span className="h-20 w-20 flex-none rounded-2xl bg-neema-cream transition-transform duration-300 group-hover:scale-105"><Art className="h-full w-full" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-lg font-semibold">{title}</span>
                  <span className="block text-neema-muted-strong">{text}</span>
                </span>
                <ArrowRight className="h-5 w-5 flex-none text-neema-dark transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
          <p className="mt-auto pt-8 text-center text-sm text-neema-muted-strong">You can invite a support person later from your profile.</p>
        </div>
      </div>
    );
  }

  const SlideArt = SLIDE_ART[current] ?? PregnantArt;
  const go = (i: number) => { const n = Math.max(0, Math.min(slides.length - 1, i)); setDir(n >= current ? 1 : -1); setCurrent(n); };
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
  };
  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-8 pt-3">
        <header className="flex items-center justify-between">
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
          <button type="button" onClick={() => setShowRoles(true)} className="min-h-[48px] rounded-full px-4 font-semibold text-neema-muted-strong transition-colors duration-150 hover:bg-neema-sand hover:text-neema-ink">
            Skip
          </button>
        </header>

        <div className="relative mt-4">
          {current === 0 ? (
            <div className="relative isolate">
              <img src={heroImage} alt="A smiling pregnant woman using Neema on her phone" className="neema-photo-in aspect-[4/3] w-full rounded-3xl object-cover shadow-neema-card" />
              <div aria-hidden="true" className="neema-drift absolute -right-3 -top-3 -z-10 h-24 w-24 rounded-full bg-neema-primary/25" />
              <div aria-hidden="true" className="neema-drift-slow absolute -bottom-3 -left-3 -z-10 h-20 w-20 rounded-full bg-neema-ochre/30" />
            </div>
          ) : (
            <div className={cn('relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br shadow-neema-card transition-colors duration-500', SLIDE_WASH[current])}>
              <div aria-hidden="true" className="neema-drift absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/60" />
              <div aria-hidden="true" className="neema-drift-slow absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/50" />
              <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center"><span className="neema-pulse block h-48 w-48 rounded-full bg-white/70" /></span>
              <span key={current} className="neema-rise neema-float relative block h-44 w-44"><SlideArt className="h-full w-full" /></span>
            </div>
          )}
        </div>

        <div key={current} className={cn('mt-8', dir === 1 ? 'neema-slide-l' : 'neema-slide-r')}>
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">{slide.eyebrow}</div>
          <h1 className="font-sans mt-2 text-3xl font-bold leading-tight">{slide.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-neema-muted-strong">{slide.description}</p>
        </div>

        {current === 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {trust.map(({ Icon: T, label }) => (
              <li key={label} style={{ animationDelay: `${300 + trust.findIndex((x) => x.label === label) * 80}ms` }} className="neema-rise inline-flex items-center gap-1.5 rounded-full bg-neema-success-soft px-3 py-1 text-[13px] font-semibold text-neema-success-ink"><T className="h-4 w-4" />{label}</li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-8">
          <div className="mb-6 flex items-center justify-center gap-2" role="tablist" aria-label="Onboarding steps">
            {slides.map((s, i) => (
              <button key={s.title} type="button" role="tab" aria-selected={i === current} aria-label={`Step ${i + 1}`} onClick={() => go(i)}
                className="flex h-12 min-w-[48px] items-center justify-center">
                <span className={cn('block h-2 rounded-full transition-all duration-200', i === current ? 'w-8 bg-neema-dark' : 'w-2 bg-neema-border')} />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {current > 0 && (
              <button type="button" onClick={() => go(current - 1)} aria-label="Previous"
                className="flex h-14 w-14 flex-none items-center justify-center rounded-xl border border-neema-border bg-white text-neema-ink transition-transform duration-150 active:scale-[0.98]">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <button type="button" onClick={() => (isLast ? setShowRoles(true) : go(current + 1))}
              className="neema-shine flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-neema-dark px-4 text-lg font-semibold text-white shadow-neema-hero transition-transform duration-150 active:scale-[0.98]">
              {isLast ? 'Get started' : 'Next'} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
