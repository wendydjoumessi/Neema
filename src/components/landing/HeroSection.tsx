import { ArrowRight, ShieldCheck, Lock, WifiOff } from 'lucide-react';
import heroImage from '@/assets/hero-pregnant-new.jpg';
import logo from '@/assets/logo.png';

interface HeroSectionProps {
  onGetStarted: () => void;
  onNavigate?: (section: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const navLink = 'hidden min-h-[48px] items-center rounded-full px-4 font-semibold text-neema-ink hover:bg-neema-sand md:inline-flex';

export function HeroSection({ onGetStarted, onNavigate, scrollToSection }: HeroSectionProps) {
  return (
    <section className="overflow-hidden bg-neema-cream">
      <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-4 md:px-10 md:pb-20">
        <nav aria-label="Main" className="mb-8 flex items-center justify-between gap-3 md:mb-14">
          <img src={logo} alt="Neema — Care for Every Stage" className="h-16 w-auto md:h-20" />
          <div className="flex items-center gap-1">
            <button type="button" className={navLink} onClick={() => scrollToSection('services-section')}>Services</button>
            <button type="button" className={navLink} onClick={() => scrollToSection('about-section')}>Why Neema</button>
            <button type="button" className={navLink} onClick={() => onNavigate?.('contact')}>Contact</button>
            <button type="button" onClick={onGetStarted} className="ml-2 min-h-[48px] rounded-xl bg-neema-dark px-5 font-semibold text-white shadow-md hover:bg-[#9E3B1D]">
              Get started
            </button>
          </div>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="mb-5 inline-flex items-center rounded-full bg-neema-primary-soft px-4 py-1.5 text-sm font-semibold text-neema-dark">
              Free · English &amp; Français · Made for Cameroon
            </span>
            <h1 className="font-sans text-4xl font-bold leading-[1.15] tracking-normal text-neema-ink md:text-5xl lg:text-[56px]">
              Care for every stage, <span className="text-neema-dark">from planning to after birth.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-neema-muted-strong md:text-xl">
              Neema is a free companion for pregnancy, the months after birth and family planning. Local, medically reviewed guidance week by week, an assistant that answers your questions, and help one tap away when something feels wrong.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onGetStarted} className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-neema-dark px-7 text-lg font-semibold text-white shadow-neema-hero transition-transform hover:bg-[#9E3B1D] active:scale-[0.98]">
                Start free <ArrowRight className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => scrollToSection('services-section')} className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-neema-border bg-white px-7 text-lg font-semibold text-neema-ink">
                See all services
              </button>
            </div>
            <ul className="mt-8 grid gap-3 text-neema-ink sm:grid-cols-3">
              <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 flex-none text-neema-success-ink" />Medically reviewed</li>
              <li className="flex items-center gap-2"><Lock className="h-5 w-5 flex-none text-neema-success-ink" />Private &amp; discreet</li>
              <li className="flex items-center gap-2"><WifiOff className="h-5 w-5 flex-none text-neema-success-ink" />Works offline, SMS backup</li>
            </ul>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-neema-primary/20" />
            <div aria-hidden="true" className="absolute -bottom-6 -left-4 h-28 w-28 rounded-full bg-neema-ochre/30" />
            <img
              src={heroImage}
              alt="A smiling pregnant woman using the Neema app at home"
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-xl lg:aspect-[4/5]"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-neema-card sm:left-auto sm:w-72">
              <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-neema-dark">Week 24 · Trimester 2</div>
              <div className="mt-1 font-semibold text-neema-ink">Baby can hear your voice. Talk, sing or pray aloud.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
