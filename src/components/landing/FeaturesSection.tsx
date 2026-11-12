import { Check, Clock } from 'lucide-react';
import { COMING_SOON, SERVICES } from './services';

/** All of Neema's services, from the v1.9 specification. */
export function FeaturesSection() {
  return (
    <section id="services-section" className="scroll-mt-4 bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-neema-ochre-soft px-4 py-1.5 text-sm font-semibold text-neema-ochre-ink">Our services</span>
          <h2 className="font-sans text-3xl font-bold tracking-normal text-neema-ink md:text-4xl">Everything Neema does for you and your family</h2>
          <p className="mt-4 text-lg text-neema-muted-strong">
            Nine services in one free app, for mothers, women planning a family and the people who support them.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ id, title, summary, includes, Icon, tint, ink }) => (
            <article key={id} className="flex flex-col gap-4 rounded-2xl border border-neema-line bg-neema-cream p-6">
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
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-neema-lilac p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#4A3F6B]" />
            <h3 className="font-sans text-lg font-semibold tracking-normal text-neema-ink">Coming soon</h3>
          </div>
          <ul className="flex flex-wrap gap-2">
            {COMING_SOON.map((item) => (
              <li key={item} className="rounded-full bg-white px-4 py-2 text-[15px] font-medium text-neema-ink">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
