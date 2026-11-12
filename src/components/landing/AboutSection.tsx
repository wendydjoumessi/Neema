import { ArrowRight, Baby, CalendarHeart, Users, Languages, WifiOff, Lock, BadgeCheck, Salad, Phone } from 'lucide-react';
import nutritionImage from '@/assets/about-health-nutrition.jpg';
import familyImage from '@/assets/family-planning-new.webp';

interface AboutSectionProps {
  onGetStarted: () => void;
}

const audiences = [
  { Icon: Baby, title: 'Mothers', text: 'During pregnancy and in the months after birth: weekly care, diet, routines, shopping and support.' },
  { Icon: CalendarHeart, title: 'Women planning a family', text: 'Trying to conceive or avoiding pregnancy: cycle tracking and every method explained.' },
  { Icon: Users, title: 'Partners & support persons', text: 'Husbands, mothers and sisters get guidance and alerts the mother chooses to share, even by SMS.' },
];

const reasons = [
  { Icon: Salad, title: 'Local, not imported', text: 'Advice built on Cameroonian foods, markets and facilities, not foreign products.' },
  { Icon: Languages, title: 'English and French', text: 'Content in both languages, with audio so you can listen instead of read.' },
  { Icon: WifiOff, title: 'Works offline', text: 'Built for entry-level phones and patchy data, with SMS backup for reminders and alerts.' },
  { Icon: Lock, title: 'Private and discreet', text: 'PIN lock and discreet mode for shared phones. Your data is never sold and there are no ads.' },
  { Icon: BadgeCheck, title: 'Medically reviewed', text: 'All health content, danger-sign rules and medicine data are approved by a qualified clinician.' },
  { Icon: Phone, title: 'Help when it matters', text: 'Danger signs lead to clear next steps, the nearest maternity facilities and a one-tap call to 119.' },
];

export function AboutSection({ onGetStarted }: AboutSectionProps) {
  return (
    <section id="about-section" className="scroll-mt-4 bg-neema-cream py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-block rounded-full bg-neema-primary-soft px-4 py-1.5 text-sm font-semibold text-neema-dark">Who Neema is for</span>
            <h2 className="font-sans text-3xl font-bold tracking-normal text-neema-ink md:text-4xl">A companion for the whole family</h2>
            <div className="mt-8 flex flex-col gap-5">
              {audiences.map(({ Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white text-neema-dark shadow-neema-card"><Icon className="h-6 w-6" /></span>
                  <div>
                    <h3 className="font-sans text-lg font-semibold tracking-normal text-neema-ink">{title}</h3>
                    <p className="text-neema-muted-strong">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={nutritionImage} alt="A pregnant woman preparing fresh fruit and vegetables at home" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lg" />
            <img src={familyImage} alt="Cupped hands holding a paper cut-out of a family" className="mt-10 aspect-[4/5] w-full rounded-3xl object-cover shadow-lg" />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-center font-sans text-3xl font-bold tracking-normal text-neema-ink md:text-4xl">Why families choose Neema</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white p-5 shadow-neema-card">
                <Icon className="mb-3 h-6 w-6 text-neema-dark" />
                <h3 className="font-sans text-lg font-semibold tracking-normal text-neema-ink">{title}</h3>
                <p className="mt-1 text-neema-muted-strong">{text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[15px] leading-[22px] text-neema-muted-strong">
            Neema is an education and navigation tool, not a medical provider. It does not diagnose or prescribe, and it always tells you when to see a qualified health worker.
          </p>
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={onGetStarted} className="inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-neema-dark px-7 text-lg font-semibold text-white shadow-neema-hero hover:bg-[#9E3B1D]">
              Get started free <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
