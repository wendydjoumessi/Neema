import { MessageCircle, Leaf, ShoppingBag, Activity, Sun, Droplet, ChevronRight, Ruler, NotebookText, ImageIcon } from 'lucide-react';
import type { PregnancyData } from '@/types/pregnancy';
import emblem from '@/assets/neema-emblem.png';
import { JOURNEYS, SHOP, T, babySizeFor, milestoneFor } from '../data';
import { useNeema } from '../store';
import { Card, H2, SwitchRow } from '../ui';
import { fmtDate } from '../format';

const WATER_TARGET = 11;

export function HomeTab({ firstName, pregnancy }: { firstName: string; pregnancy: PregnancyData }) {
  const s = useNeema();
  const t = T[s.lang];
  const week = Math.max(1, Math.min(42, pregnancy.currentWeek));
  const daysToGo = Math.max(0, Math.ceil((new Date(pregnancy.dueDate).getTime() - Date.now()) / 86400000));
  const progress = Math.min(100, Math.round((week / 40) * 100));
  const size = babySizeFor(week);
  const journey = JOURNEYS.find((j) => j.id === s.journey)!;
  const shopDone = SHOP.filter((i) => s.shop[i.id]).length;
  const today = new Date().toLocaleDateString(s.lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const quick = [
    { label: 'Ask Neema', sub: 'Questions, any time', Icon: MessageCircle, bg: 'bg-neema-primary-soft', ink: 'text-neema-dark', onClick: () => s.setTab('ask') },
    { label: 'What to eat', sub: `Local foods for week ${week}`, Icon: Leaf, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('diet') },
    { label: 'Shopping', sub: `${shopDone} of ${SHOP.length} ready`, Icon: ShoppingBag, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('shop') },
    { label: 'Symptom checker', sub: 'How are you feeling?', Icon: Activity, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.openSymptom() },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 px-4 pb-6 pt-2">
      <div className="px-0.5 pt-1">
        <div className="text-2xl font-bold leading-8">{t.greeting}, {firstName}</div>
        <div className="text-neema-muted-strong">{today} · {s.city}</div>
      </div>

      {s.journey === 'preg' ? (
        <section className="relative flex flex-col gap-3.5 overflow-hidden rounded-2xl bg-neema-dark p-5 text-white shadow-neema-hero">
          <div aria-hidden="true" className="absolute -right-[60px] -top-[70px] h-[180px] w-[180px] rounded-full bg-neema-primary" />
          <div aria-hidden="true" className="absolute right-[34px] top-[58px] h-[90px] w-[90px] rounded-full bg-neema-ochre opacity-90" />
          <div className="relative flex flex-col gap-0.5">
            <span className="text-[13px] font-bold uppercase leading-[18px] tracking-[0.08em]">Trimester {pregnancy.trimester} · week {week} of 40</span>
            <h1 className="text-4xl font-bold leading-[44px]">Week {week}</h1>
            <span>{daysToGo} days to go · due {fmtDate(new Date(pregnancy.dueDate))}</span>
          </div>
          <div className="relative flex items-center gap-3 rounded-[14px] bg-white px-3.5 py-3 text-neema-ink">
            <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-neema-ochre-soft text-neema-ochre-ink">
              <Ruler className="h-6 w-6" />
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">About the size of {size.size}</span>
              <span className="text-[15px] leading-[21px] text-neema-muted-strong">
                Around {size.length}{size.weight ? ` and ${size.weight}` : ''}
              </span>
            </span>
          </div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-white/30" role="img" aria-label={`${progress} percent of pregnancy completed`}>
            <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
          </div>
          <p className="relative"><span className="font-bold">This week:</span> {milestoneFor(week)}</p>
        </section>
      ) : (
        <section className="relative flex flex-col gap-2 overflow-hidden rounded-2xl bg-neema-dark p-5 text-white shadow-neema-hero">
          <div aria-hidden="true" className="absolute -right-[60px] -top-[60px] h-40 w-40 rounded-full bg-neema-primary" />
          <span className="relative text-[13px] font-bold uppercase leading-[18px] tracking-[0.08em]">{journey.tag}</span>
          <h1 className="relative text-[32px] font-bold leading-10">{journey.title}</h1>
          <p className="relative">{journey.text}</p>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl bg-neema-ochre-soft shadow-neema-card">
        {/* TODO: replace with a licensed photo of a Cameroonian mother (natural light). */}
        <div className="flex h-[120px] flex-col items-center justify-center gap-1.5 bg-[#F5DDB5] px-6 text-center text-[13px] font-medium leading-[18px] text-neema-ochre-ink">
          <ImageIcon className="h-6 w-6" />
          Photo slot · Smiling Cameroonian mother peeling an orange, morning light
        </div>
        <div className="flex flex-col gap-2 px-5 pb-5 pt-4">
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-2.5 py-0.5 text-[13px] font-bold leading-[18px] text-neema-ochre-ink">
            <Sun className="h-3.5 w-3.5" /> TODAY’S TIP
          </span>
          <H2>Take your iron tablet with an orange, not with tea</H2>
          <p>Vitamin C helps your body absorb iron. Keep tea and coffee for between meals.</p>
          <span className="text-[13px] font-medium leading-[18px] text-neema-ochre-ink">Source: WHO antenatal care recommendations (2016)</span>
        </div>
      </section>

      <section aria-label="Quick actions" className="grid grid-cols-2 gap-3">
        {quick.map(({ label, sub, Icon, bg, ink, onClick }) => (
          <button key={label} type="button" onClick={onClick} className={`flex min-h-[116px] flex-col items-start justify-between gap-2 rounded-2xl p-4 text-left active:scale-[0.98] ${bg}`}>
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white ${ink}`}><Icon className="h-6 w-6" /></span>
            <span className="flex flex-col">
              <span className="font-bold">{label}</span>
              <span className="text-sm leading-5 text-neema-muted-strong">{sub}</span>
            </span>
          </button>
        ))}
      </section>

      <Card className="flex flex-col gap-3 px-5 py-4">
        <H2>Today</H2>
        <button type="button" onClick={() => s.setTab('diet')} className="flex min-h-[56px] items-center gap-3 rounded-xl bg-neema-cream px-3 py-2 text-left">
          <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-neema-water"><Droplet className="h-5 w-5" /></span>
          <span className="flex-1">Water today: <span className="font-bold">{s.water} of {WATER_TARGET} cups</span></span>
          <ChevronRight className="h-5 w-5 text-neema-muted" />
        </button>
        <button type="button" onClick={() => s.setTab('diet')} className="flex min-h-[56px] items-center gap-3 rounded-xl bg-neema-cream px-3 py-2 text-left">
          <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-neema-success-ink"><Leaf className="h-5 w-5" /></span>
          <span className="flex flex-1 flex-col">
            <span className="text-[13px] font-semibold leading-[18px] text-neema-success-ink">THIS WEEK’S DIET TIP</span>
            <span className="font-semibold">Folong with groundnuts: iron, folate and protein in one pot</span>
          </span>
          <ChevronRight className="h-5 w-5 text-neema-muted" />
        </button>
      </Card>

      <Card className="flex flex-col gap-3 px-5 pb-5 pt-4">
        <SwitchRow label="Discreet mode" sub="Neutral app name and lock-screen messages on shared phones" on={s.discreet} onToggle={() => s.setDiscreet(!s.discreet)} />
        <div className="text-[13px] font-semibold leading-[18px] text-neema-muted">LOCK-SCREEN PREVIEW</div>
        <div className="flex items-center gap-3 rounded-2xl bg-neema-ink px-3.5 py-3 text-white">
          {s.discreet ? (
            <>
              <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-[#8A8FA3]"><NotebookText className="h-[22px] w-[22px]" /></span>
              <span className="flex flex-col"><span className="text-[13px] font-semibold leading-[18px] text-[#D9DBE3]">NOTES · now</span><span>You have a new message</span></span>
            </>
          ) : (
            <>
              <img src={emblem} alt="" className="h-10 w-10 flex-none rounded-[10px] object-cover" />
              <span className="flex flex-col"><span className="text-[13px] font-semibold leading-[18px] text-[#D9DBE3]">NEEMA · now</span><span>Week {week}: time for your iron and folic acid tablet</span></span>
            </>
          )}
        </div>
      </Card>

      <p className="text-center text-sm leading-5 text-neema-muted-strong">
        Feeling unwell? The <span className="font-semibold text-neema-sos">SOS</span> button is always at the top of the screen.
      </p>
    </div>
  );
}
