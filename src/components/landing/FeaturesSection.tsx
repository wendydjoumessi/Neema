import { useRef, useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMING_SOON, SERVICES } from './services';
import { ScrollReveal } from './Reveal';

/** All of Neema's services, from the v1.9 specification. */
export function FeaturesSection() {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = rail.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    setActive(Math.min(SERVICES.length - 1, Math.round(el.scrollLeft / w)));
  };
  const goTo = (i: number) => {
    const el = rail.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 20, behavior: 'smooth' });
  };
  return (
    <section id="services-section" className="scroll-mt-4 bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <span className="mb-4 inline-block rounded-full bg-neema-ochre-soft px-4 py-1.5 text-sm font-semibold text-neema-ochre-ink">Our services</span>
          <h2 className="font-sans text-3xl font-bold tracking-normal text-neema-ink md:text-4xl">Everything Neema does for you and your family</h2>
          <p className="mt-4 text-lg text-neema-muted-strong">
            Nine services in one free app, for mothers, women planning a family and the people who support them.
          </p>
        </ScrollReveal>

        {/* Phones: a swipeable row. Larger screens: a grid. */}
        <div ref={rail} onScroll={onScroll} aria-label="Our services" role="region"
          className="neema-hscroll -mx-5 flex gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {SERVICES.map(({ id, title, summary, includes, Icon, tint, ink }, i) => (
            <ScrollReveal as="article" key={id} delay={(i % 3) * 90} className="flex w-[84%] flex-none flex-col gap-4 rounded-3xl border border-neema-line bg-neema-cream p-6 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-neema-card md:w-auto">
              <div className="flex items-center gap-3">
                <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${tint} ${ink}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-sans text-xl font-semibold leading-7 tracking-normal text-neema-ink">{title}</h3>
              </div>
              <p className="text-neema-ink">{summary}</p>
              <ul className="flex flex-col gap-2">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px] leading-[22px] text-neema-muted-strong">
                    <Check className="mt-0.5 h-[18px] w-[18px] flex-none text-neema-success" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 md:hidden">
          {SERVICES.map((sv, i) => (
            <button key={sv.id} type="button" onClick={() => goTo(i)} aria-label={`Show ${sv.title}`} aria-current={i === active}
              className="flex h-11 min-w-[20px] items-center justify-center">
              <span className={cn('block h-2 rounded-full transition-all duration-300', i === active ? 'w-6 bg-neema-dark' : 'w-2 bg-neema-border')} />
            </button>
          ))}
        </div>

        <ScrollReveal className="mt-8 rounded-3xl bg-neema-lilac p-6 md:mt-10 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-neema-lilac-ink" />
            <h3 className="font-sans text-lg font-semibold tracking-normal text-neema-ink">Coming soon</h3>
          </div>
          <ul className="flex flex-wrap gap-2">
            {COMING_SOON.map((item) => (
              <li key={item} className="rounded-full bg-white px-4 py-2 text-[15px] font-medium text-neema-ink">{item}</li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
