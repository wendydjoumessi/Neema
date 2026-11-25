import { ArrowRight, ShieldCheck, Lock, WifiOff } from 'lucide-react';
import heroImage from '@/assets/hero-pregnant-new.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
  onNavigate?: (section: string) => void;
  scrollToSection: (sectionId: string) => void;
}

export function HeroSection({ onGetStarted, scrollToSection }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-neema-cream">
      {/* Soft background shapes that drift slowly */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="neema-drift absolute -left-24 top-10 h-64 w-64 rounded-full bg-neema-primary/10 blur-2xl" />
        <div className="neema-drift-slow absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-neema-ochre/15 blur-2xl" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-8 md:px-10 md:pb-20 md:pt-10">

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="neema-rise font-sans text-4xl font-bold leading-[1.15] tracking-normal text-neema-ink md:text-5xl lg:text-[56px]">
              Care for every stage, <span className="text-neema-dark">from planning to after birth.</span>
            </h1>
            <p style={{ animationDelay: '120ms' }} className="neema-rise mt-5 max-w-xl text-lg leading-relaxed text-neema-muted-strong md:text-xl">
              Neema is a free companion for pregnancy, the months after birth and family planning. Local, medically reviewed guidance week by week, an assistant that answers your questions, and help one tap away when something feels wrong.
            </p>
            <div style={{ animationDelay: '240ms' }} className="neema-rise mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onGetStarted} className="neema-glow neema-shine group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-neema-dark px-7 text-lg font-semibold text-white transition-transform duration-150 active:scale-[0.98]">
                Start free <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button type="button" onClick={() => scrollToSection('services-section')} className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-neema-border bg-white px-7 text-lg font-semibold text-neema-ink">
                See all services
              </button>
            </div>
            <ul className="mt-8 grid gap-2.5 text-neema-ink sm:grid-cols-3">
              {([[ShieldCheck, 'Medically reviewed'], [Lock, 'Private & discreet'], [WifiOff, 'Works offline, SMS backup']] as const).map(([Icon, label], i) => (
                <li key={label} style={{ animationDelay: `${380 + i * 90}ms` }} className="neema-rise flex items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-neema-success-soft"><Icon className="h-5 w-5 text-neema-success-ink" /></span>{label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="neema-drift absolute -right-6 -top-6 h-40 w-40 rounded-full bg-neema-primary/20" />
            <div aria-hidden="true" className="neema-drift-slow absolute -bottom-6 -left-4 h-28 w-28 rounded-full bg-neema-ochre/30" />
            <img
              src={heroImage}
              alt="A smiling pregnant woman using the Neema app at home"
              className="neema-photo-in relative aspect-[4/3] w-full rounded-3xl object-cover shadow-xl lg:aspect-[4/5]"
            />
            <div className="neema-card-in absolute bottom-4 left-4 right-4 sm:left-auto sm:w-72">
              <div className="neema-float flex items-start gap-3 rounded-2xl bg-white/95 p-4 shadow-neema-card backdrop-blur">
                <span aria-hidden="true" className="relative mt-1 flex h-3 w-3 flex-none">
                  <span className="absolute inset-0 animate-ping rounded-full bg-neema-primary/60 motion-reduce:animate-none" />
                  <span className="relative h-3 w-3 rounded-full bg-neema-primary" />
                </span>
                <div>
                  <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-neema-dark">Week 24 · Trimester 2</div>
                  <div className="mt-1 font-semibold text-neema-ink">Baby can hear your voice. Talk, sing or pray aloud.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
