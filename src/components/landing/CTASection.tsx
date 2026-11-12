import { ArrowRight } from 'lucide-react';
import emblem from '@/assets/neema-emblem.png';

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-neema-dark py-16 text-white md:py-20">
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-neema-primary" />
      <div aria-hidden="true" className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-neema-ochre/60" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <img src={emblem} alt="" className="mb-6 h-20 w-20 rounded-2xl bg-white object-cover p-1" />
        <h2 className="font-sans text-3xl font-bold tracking-normal md:text-4xl">Start your journey with Neema</h2>
        <p className="mt-4 text-lg text-white/90 md:text-xl">
          Free for every family, in English or French. Invite your partner or a trusted support person whenever you’re ready.
        </p>
        <button type="button" onClick={onGetStarted} className="mt-8 inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-white px-8 text-lg font-semibold text-neema-dark shadow-xl hover:bg-neema-cream">
          Get started free <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
