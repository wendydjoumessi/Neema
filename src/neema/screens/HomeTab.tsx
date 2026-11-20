import { ReactNode } from 'react';
import {
  MessageCircle, Leaf, ShoppingBag, Activity, Sun, Droplet, ChevronRight, Ruler, NotebookText, CalendarHeart, ListChecks,
  Scale, MapPin, Stethoscope, Syringe, Pill as PillIcon, ShieldCheck, HeartHandshake, Baby,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import pregTipPhoto from '@/assets/about-health-nutrition.jpg';
import ppTipPhoto from '@/assets/pregnant-couple.jpg';
import ttcTipPhoto from '@/assets/health-nutrition.webp';
import avoidTipPhoto from '@/assets/family-planning-new.webp';
import type { PregnancyData } from '@/types/pregnancy';
import emblem from '@/assets/neema-emblem.png';
import { JOURNEYS, SHOP, T, TTC_CHECK, babySizeFor, milestoneFor, waterTarget } from '../data';
import { addDays, isoDate, cycleInfo, daysBetween, fmtShort, methodStatus, nextBabyVaccine, nextPostnatalCheck, todayIso, type CycleInfo } from '../cycle';
import { useNeema, type Mood } from '../store';
import { Card, CheckBox, H2, SwitchRow } from '../ui';
import { fmtDate } from '../format';

type Quick = { label: string; sub: string; Icon: typeof Leaf; bg: string; ink: string; onClick: () => void };

// ---------------------------------------------------------------------------
// Shared building blocks (same look for every journey)
// ---------------------------------------------------------------------------
/** The ochre circle only suits the short pregnancy headline; longer headlines keep the plain corner circle so text stays readable. */
function Hero({ children, ochre = false }: { children: ReactNode; ochre?: boolean }) {
  return (
    <section className="relative flex flex-col gap-3.5 overflow-hidden rounded-2xl bg-neema-dark p-5 text-white shadow-neema-hero">
      <div aria-hidden="true" className={cn('absolute rounded-full bg-neema-primary', ochre ? '-right-[60px] -top-[70px] h-[180px] w-[180px]' : '-right-[60px] -top-[60px] h-40 w-40')} />
      {ochre && <div aria-hidden="true" className="absolute right-[34px] top-[58px] h-[90px] w-[90px] rounded-full bg-neema-ochre opacity-90" />}
      {children}
    </section>
  );
}

function HeroBox({ Icon, tint, children }: { Icon: typeof Leaf; tint: string; children: ReactNode }) {
  return (
    <div className="relative flex items-center gap-3 rounded-[14px] bg-white px-3.5 py-3 text-neema-ink">
      <span aria-hidden="true" className={cn('flex h-12 w-12 flex-none items-center justify-center rounded-full', tint)}><Icon className="h-6 w-6" /></span>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="relative text-[13px] font-bold uppercase leading-[18px] tracking-[0.08em]">{children}</span>;
}

function Tip({ photo, alt, title, text, source }: { photo: string; alt: string; title: string; text: string; source: string }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-neema-ochre-soft shadow-neema-card">
      <img src={photo} alt={alt} className="h-40 w-full object-cover object-[center_40%]" />
      <div className="flex flex-col gap-2 px-5 pb-5 pt-4">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-2.5 py-0.5 text-[13px] font-bold leading-[18px] text-neema-ochre-ink">
          <Sun className="h-3.5 w-3.5" /> TODAY’S TIP
        </span>
        <H2>{title}</H2>
        <p>{text}</p>
        <span className="text-[13px] font-medium leading-[18px] text-neema-ochre-ink">Source: {source}</span>
      </div>
    </section>
  );
}

function QuickGrid({ items }: { items: Quick[] }) {
  return (
    <section aria-label="Quick actions" className="grid grid-cols-2 gap-3">
      {items.map(({ label, sub, Icon, bg, ink, onClick }) => (
        <button key={label} type="button" onClick={onClick} className={`flex min-h-[116px] flex-col items-start justify-between gap-2 rounded-2xl p-4 text-left active:scale-[0.98] ${bg}`}>
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white ${ink}`}><Icon className="h-6 w-6" /></span>
          <span className="flex flex-col">
            <span className="font-bold">{label}</span>
            <span className="text-sm leading-5 text-neema-muted-strong">{sub}</span>
          </span>
        </button>
      ))}
    </section>
  );
}

function Row({ Icon, ink, onClick, children }: { Icon: typeof Leaf; ink: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-[56px] items-center gap-3 rounded-xl bg-neema-cream px-3 py-2 text-left">
      <span aria-hidden="true" className={cn('flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white', ink)}><Icon className="h-5 w-5" /></span>
      <span className="flex flex-1 flex-col">{children}</span>
      <ChevronRight className="h-5 w-5 text-neema-muted" />
    </button>
  );
}

function TickRow({ on, onToggle, label, sub }: { on: boolean; onToggle: () => void; label: string; sub: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onToggle} className="flex min-h-[56px] items-center gap-3 rounded-xl bg-neema-cream px-3 py-2 text-left">
      <CheckBox on={on} />
      <span className="flex flex-1 flex-col"><span className="font-semibold">{label}</span><span className="text-sm leading-5 text-neema-muted-strong">{sub}</span></span>
    </button>
  );
}

function WaterRow() {
  const s = useNeema();
  return (
    <Row Icon={Droplet} ink="text-neema-water" onClick={() => s.setTab('diet')}>
      <span>Water today: <span className="font-bold">{s.water} of {waterTarget(s.journey)} cups</span></span>
    </Row>
  );
}

const quickAsk = (sub: string, go: () => void): Quick => ({ label: 'Ask Neema', sub, Icon: MessageCircle, bg: 'bg-neema-primary-soft', ink: 'text-neema-dark', onClick: go });

/** Last 7 days (today included) that are ticked in a by-date record. */
function last7(record: Record<string, boolean>) {
  return Array.from({ length: 7 }, (_, i) => isoDate(addDays(new Date(), -i))).filter((d) => record[d]).length;
}

// ---------------------------------------------------------------------------
// Pregnant
// ---------------------------------------------------------------------------
function PregnantHome({ pregnancy }: { pregnancy: PregnancyData }) {
  const s = useNeema();
  const week = Math.max(1, Math.min(42, pregnancy.currentWeek));
  const daysToGo = Math.max(0, Math.ceil((new Date(pregnancy.dueDate).getTime() - Date.now()) / 86400000));
  const progress = Math.min(100, Math.round((week / 40) * 100));
  const size = babySizeFor(week);
  const essentials = SHOP.filter((i) => i.ess && !s.shopEdits[i.id]?.hidden);
  const shopDone = essentials.filter((i) => s.shop[i.id]).length;
  return (
    <>
      <Hero ochre>
        <div className="relative flex flex-col gap-0.5">
          <Eyebrow>Trimester {pregnancy.trimester} · week {week} of 40</Eyebrow>
          <h1 className="text-4xl font-bold leading-[44px]">Week {week}</h1>
          <span>{daysToGo} days to go · due {fmtDate(new Date(pregnancy.dueDate))}</span>
        </div>
        <HeroBox Icon={Ruler} tint="bg-neema-ochre-soft text-neema-ochre-ink">
          <span className="font-semibold">About the size of {size.size}</span>
          <span className="text-[15px] leading-[21px] text-neema-muted-strong">Around {size.length}{size.weight ? ` and ${size.weight}` : ''}</span>
        </HeroBox>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-white/30" role="img" aria-label={`${progress} percent of pregnancy completed`}>
          <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <p className="relative"><span className="font-bold">This week:</span> {milestoneFor(week)}</p>
      </Hero>
      <Tip photo={pregTipPhoto} alt="A pregnant woman preparing fresh fruit and vegetables" title="Take your iron tablet with an orange, not with tea" text="Vitamin C helps your body absorb iron. Keep tea and coffee for between meals." source="WHO antenatal care recommendations (2016)" />
      <QuickGrid items={[
        quickAsk('Questions, any time', () => s.setTab('ask')),
        { label: 'What to eat', sub: `Local foods for week ${week}`, Icon: Leaf, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('diet') },
        { label: 'Shopping', sub: `${shopDone} of ${essentials.length} essentials`, Icon: ShoppingBag, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('shop') },
        { label: 'Symptom checker', sub: 'How are you feeling?', Icon: Activity, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.openSymptom() },
      ]} />
      <Card className="flex flex-col gap-3 px-5 py-4">
        <H2>Today</H2>
        <WaterRow />
        <Row Icon={Leaf} ink="text-neema-success-ink" onClick={() => s.setTab('diet')}>
          <span className="text-[13px] font-semibold leading-[18px] text-neema-success-ink">THIS WEEK’S DIET TIP</span>
          <span className="font-semibold">Folong with groundnuts: iron, folate and protein in one pot</span>
        </Row>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// After birth
// ---------------------------------------------------------------------------
const MOODS: { id: Mood; label: string }[] = [
  { id: 'good', label: 'Good' }, { id: 'ok', label: 'Okay' }, { id: 'low', label: 'Low' }, { id: 'hard', label: 'Struggling' },
];

function AfterBirthHome({ pregnancy }: { pregnancy: PregnancyData }) {
  const s = useNeema();
  const birth = pregnancy.birthDate;
  const days = birth ? Math.max(0, daysBetween(birth, new Date())) : null;
  const title = days === null ? 'After birth' : days < 14 ? `${days} day${days === 1 ? '' : 's'} after birth` : `${Math.floor(days / 7)} weeks after birth`;
  const stage = days === null || days < 7
    ? 'The first week: rest whenever baby sleeps. Bleeding is heavy at first and should slowly get lighter. Breastfeed often, 8 to 12 times a day.'
    : days < 42
      ? 'Bleeding gets lighter and changes from red to brown, then pale. Eat well, drink a cup of water at every feed, and accept help.'
      : 'Your body is still recovering. WHO advises waiting at least 24 months before your next pregnancy, so this is a good time to choose a method.';
  const check = birth ? nextPostnatalCheck(birth) : null;
  const vaccine = birth ? nextBabyVaccine(birth) : null;
  const today = todayIso();
  const feeds = s.feeds.date === today ? s.feeds : { date: today, count: 0, last: '' as const };
  const addFeed = (side: 'left' | 'right') => s.setFeeds({ date: today, count: feeds.count + 1, last: side });
  const mood = s.mood[today];

  return (
    <>
      <Hero>
        <div className="relative flex flex-col gap-0.5">
          <Eyebrow>After birth{birth ? ` · born ${fmtShort(birth)}` : ''}</Eyebrow>
          <h1 className="text-[32px] font-bold leading-10">{title}</h1>
          {pregnancy.babyName && <span className="font-semibold">With {pregnancy.babyName}</span>}
        </div>
        {check ? (
          <HeroBox Icon={Stethoscope} tint="bg-neema-success-soft text-neema-success-ink">
            <span className="font-semibold">{check.label}: by {fmtShort(check.date)}</span>
            <span className="text-[15px] leading-[21px] text-neema-muted-strong">{check.text}</span>
          </HeroBox>
        ) : vaccine && (
          <HeroBox Icon={Syringe} tint="bg-neema-success-soft text-neema-success-ink">
            <span className="font-semibold">Baby’s {vaccine.label} vaccines: {fmtShort(vaccine.date)}</span>
            <span className="text-[15px] leading-[21px] text-neema-muted-strong">Bring baby’s vaccination card.</span>
          </HeroBox>
        )}
        <p className="relative">{stage}</p>
      </Hero>
      <Tip photo={ppTipPhoto} alt="A newborn’s feet wrapped in a soft white towel" title="Breastfeed on demand, day and night" text="Give only breast milk for the first 6 months: no water or other drinks, even in the heat. Feeding often helps your milk supply." source="WHO infant feeding recommendations" />
      <QuickGrid items={[
        quickAsk('Feeding, sleep, recovery', () => s.setTab('ask')),
        { label: 'What to eat', sub: 'Foods for recovery and feeding', Icon: Leaf, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('diet') },
        { label: 'Birth spacing', sub: 'Methods to start after birth', Icon: CalendarHeart, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('fp') },
        { label: 'Symptom checker', sub: 'For you or baby', Icon: Activity, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.openSymptom() },
      ]} />
      <Card className="flex flex-col gap-3 px-5 py-4">
        <H2>Today</H2>
        <div className="flex flex-col gap-2 rounded-xl bg-neema-cream px-3 py-3">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-neema-dark"><Baby className="h-5 w-5" /></span>
            <span className="flex flex-1 flex-col">
              <span>Feeds today: <span className="font-bold" aria-live="polite">{feeds.count}</span></span>
              <span className="text-sm leading-5 text-neema-muted-strong">
                {feeds.last ? `Last feed ended on the ${feeds.last}. Start on the ${feeds.last === 'left' ? 'right' : 'left'} next time.` : 'Tap the side you fed on.'}
              </span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['left', 'right'] as const).map((side) => (
              <button key={side} type="button" onClick={() => addFeed(side)} className="min-h-[48px] rounded-xl border border-neema-border bg-white font-semibold active:scale-[0.98]">
                + {side === 'left' ? 'Left' : 'Right'} breast
              </button>
            ))}
          </div>
        </div>
        <WaterRow />
        <div className="flex flex-col gap-2 rounded-xl bg-neema-cream px-3 py-3">
          <span className="font-semibold">How are you feeling today?</span>
          <div role="radiogroup" aria-label="How are you feeling today?" className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-4">
            {MOODS.map((m) => (
              <button key={m.id} type="button" role="radio" aria-checked={mood === m.id} onClick={() => s.setMood({ ...s.mood, [today]: m.id })}
                className={cn('min-h-[48px] rounded-xl border px-2 font-semibold', mood === m.id ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}>
                {m.label}
              </button>
            ))}
          </div>
          {mood && (
            <p className="text-[15px] leading-[22px]">
              {mood === 'good' ? 'Lovely. Keep resting when baby sleeps.'
                : mood === 'ok' ? 'Thank you for checking in. Small rests and help from family make a real difference.'
                  : 'Many mothers feel low or tearful in the first two weeks. If it lasts longer than two weeks, or you feel hopeless, talk to a health worker. You are not alone.'}
            </p>
          )}
          {(mood === 'low' || mood === 'hard') && (
            <button type="button" onClick={() => s.openSos()} className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-neema-ink font-semibold text-white">
              <HeartHandshake className="h-5 w-5" /> Talk to someone now
            </button>
          )}
        </div>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// Trying to conceive
// ---------------------------------------------------------------------------
function cycleHeadline(c: CycleInfo) {
  switch (c.phase) {
    case 'period': return { title: 'Period days', sub: `Fertile window from about ${fmtShort(c.fertileStart)}` };
    case 'before': { const d = daysBetween(new Date(), c.fertileStart); return { title: `Fertile window in ${d} day${d === 1 ? '' : 's'}`, sub: `${fmtShort(c.fertileStart)} – ${fmtShort(c.fertileEnd)}` }; }
    case 'fertile': return { title: 'Your fertile window is now', sub: `Until about ${fmtShort(c.fertileEnd)}. Likely ovulation ${fmtShort(c.ovulation)}.` };
    case 'after': return { title: 'Fertile window has passed', sub: 'If your period doesn’t come, take a pregnancy test.' };
    default: return { title: 'Your period may be late', sub: 'A pregnancy test from the pharmacy can tell you. A week late? Take one.' };
  }
}

function LastPeriodBox() {
  const s = useNeema();
  return (
    <div className="relative flex flex-col gap-1.5 rounded-[14px] bg-white px-3.5 py-3 text-neema-ink">
      <label htmlFor="home-lmp" className="font-semibold">First day of my last period</label>
      <input id="home-lmp" type="date" max={todayIso()} value={s.lastPeriod} onChange={(e) => s.setLastPeriod(e.target.value)}
        className="h-[52px] rounded-xl border border-neema-border bg-white px-3.5 text-base" />
    </div>
  );
}

function TryingHome() {
  const s = useNeema();
  const c = cycleInfo(s.lastPeriod, s.cycleLen, s.periodLen);
  const head = c && cycleHeadline(c);
  const done = TTC_CHECK.filter((x) => s.ttc[x.id]).length;
  const today = todayIso();
  return (
    <>
      <Hero>
        {c && head ? (
          <>
            <div className="relative flex flex-col gap-0.5">
              <Eyebrow>Trying to conceive · cycle day {c.cycleDay}</Eyebrow>
              <h1 className="text-[32px] font-bold leading-10">{head.title}</h1>
              <span>{head.sub}</span>
            </div>
            <HeroBox Icon={CalendarHeart} tint="bg-neema-primary-soft text-neema-dark">
              <span className="font-semibold">Next period around {fmtShort(c.nextPeriod)}</span>
              <span className="text-[15px] leading-[21px] text-neema-muted-strong">Based on a {s.cycleLen}-day cycle. An estimate only.</span>
            </HeroBox>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/30" role="img" aria-label={`Day ${c.cycleDay} of a ${s.cycleLen}-day cycle`}>
              <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, Math.round((c.cycleDay / s.cycleLen) * 100))}%` }} />
            </div>
            {c.phase === 'late' && (
              <button type="button" onClick={() => s.setJourney('preg')} className="relative min-h-[48px] rounded-xl bg-white font-semibold text-neema-dark">My test is positive: I’m pregnant</button>
            )}
          </>
        ) : (
          <>
            <div className="relative flex flex-col gap-0.5">
              <Eyebrow>Trying to conceive</Eyebrow>
              <h1 className="text-[32px] font-bold leading-10">Let’s find your fertile days</h1>
              <span>Add the first day of your last period. Neema estimates your fertile window and next period from it.</span>
            </div>
            <LastPeriodBox />
          </>
        )}
      </Hero>
      <Tip photo={ttcTipPhoto} alt="Fresh vegetables, fish, beans and fruit on a table" title="Start folic acid now, not when you find out" text="Baby’s spine forms in the first weeks, often before a test is positive. A daily folic acid tablet is cheap at most pharmacies." source="WHO preconception care recommendations" />
      <QuickGrid items={[
        quickAsk('Fertility questions', () => s.setTab('ask')),
        { label: 'My cycle', sub: c ? 'Calendar and settings' : 'Add your period', Icon: CalendarHeart, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('fp') },
        { label: 'Checklist', sub: `${done} of ${TTC_CHECK.length} done`, Icon: ListChecks, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.setTab('fp') },
        { label: 'What to eat', sub: 'Foods for conceiving', Icon: Leaf, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('diet') },
      ]} />
      <Card className="flex flex-col gap-3 px-5 py-4">
        <H2>Today</H2>
        <TickRow on={!!s.folic[today]} onToggle={() => s.setFolic({ ...s.folic, [today]: !s.folic[today] })} label="Folic acid tablet" sub={s.folic[today] ? 'Taken today. Well done.' : 'One tablet a day, every day.'} />
        <WaterRow />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// Avoiding pregnancy
// ---------------------------------------------------------------------------
function AvoidingHome() {
  const s = useNeema();
  const st = methodStatus(s.method);
  const c = cycleInfo(s.lastPeriod, s.cycleLen, s.periodLen);
  const today = todayIso();
  const isPill = s.method.id === 'coc' || s.method.id === 'pop';
  const pillTaken = !!s.pills[today];
  const togglePill = () => s.setPills({ ...s.pills, [today]: !pillTaken });

  return (
    <>
      <Hero>
        {!st ? (
          <>
            <div className="relative flex flex-col gap-0.5">
              <Eyebrow>Avoiding pregnancy</Eyebrow>
              <h1 className="text-[32px] font-bold leading-10">Find a method that fits your life</h1>
              <span>Compare methods privately: how well each one works, possible side effects, and how soon you can get pregnant after stopping.</span>
            </div>
            <div className="relative flex flex-col gap-2">
              <button type="button" onClick={() => s.setTab('fp')} className="min-h-[52px] rounded-xl bg-white font-semibold text-neema-dark active:scale-[0.98]">Compare methods</button>
              <button type="button" onClick={() => s.setTab('fp')} className="min-h-[48px] rounded-xl border border-white/60 font-semibold text-white">I already use a method</button>
            </div>
          </>
        ) : (
          <>
            <div className="relative flex flex-col gap-0.5">
              <Eyebrow>My method</Eyebrow>
              <h1 className="text-[28px] font-bold leading-9">{st.def.name.replace(/\s*\(.*\)$/, '')}</h1>
              {/\(.*\)$/.test(st.def.name) && <span>{st.def.name.match(/\((.*)\)$/)![1]}</span>}
            </div>
            {isPill ? (
              <HeroBox Icon={PillIcon} tint="bg-neema-primary-soft text-neema-dark">
                <span className="font-semibold">{pillTaken ? 'Today’s pill: taken' : 'Today’s pill'}</span>
                <span className="text-[15px] leading-[21px] text-neema-muted-strong">Taken {last7(s.pills)} of the last 7 days</span>
                <button type="button" aria-pressed={pillTaken} onClick={togglePill} className={cn('mt-2 min-h-[48px] rounded-xl font-semibold', pillTaken ? 'border border-neema-border bg-white text-neema-ink' : 'bg-neema-dark text-white')}>
                  {pillTaken ? 'Undo' : 'I took it today'}
                </button>
              </HeroBox>
            ) : st.def.renewDays ? (
              <HeroBox Icon={st.def.id.startsWith('inject') ? Syringe : ShieldCheck} tint="bg-neema-success-soft text-neema-success-ink">
                {st.due ? (
                  <>
                    <span className="font-semibold">{st.def.id.startsWith('inject') ? `Next injection by ${fmtShort(st.due)}` : `Protected until ${fmtDate(st.due)}`}</span>
                    <span className="text-[15px] leading-[21px] text-neema-muted-strong">
                      {st.daysLeft! < 0 ? 'Overdue: go to your clinic soon and use condoms until then.' : `${st.daysLeft} days left. ${st.def.graceText ?? st.def.note}`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Add the date to get a reminder</span>
                    <button type="button" onClick={() => s.setTab('fp')} className="mt-2 min-h-[48px] rounded-xl bg-neema-dark font-semibold text-white">Add the date</button>
                  </>
                )}
              </HeroBox>
            ) : (
              <p className="relative">{st.def.note}</p>
            )}
            <button type="button" onClick={() => s.setTab('fp')} className="relative min-h-[48px] self-start rounded-full border border-white/60 px-4 font-semibold">Change method</button>
          </>
        )}
      </Hero>
      <Tip photo={avoidTipPhoto} alt="Hands holding a paper cut-out of a family" title="Had sex without protection?" text="Emergency contraceptive pills work best as soon as possible, and up to 5 days after. A copper IUD fitted within 5 days is the most effective option." source="WHO Family Planning: A Global Handbook" />
      <QuickGrid items={[
        quickAsk('Private questions', () => s.setTab('ask')),
        { label: 'Compare methods', sub: 'Side by side', Icon: Scale, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('fp') },
        { label: 'Find a clinic', sub: 'Family planning units', Icon: MapPin, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('fp') },
        { label: 'Symptom checker', sub: 'Side effects or worries', Icon: Activity, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.openSymptom() },
      ]} />
      <Card className="flex flex-col gap-3 px-5 py-4">
        <H2>Today</H2>
        {isPill && <TickRow on={pillTaken} onToggle={togglePill} label="Today’s pill" sub={pillTaken ? 'Taken. See you tomorrow.' : 'At about the same time every day.'} />}
        <Row Icon={CalendarHeart} ink="text-neema-dark" onClick={() => s.setTab('fp')}>
          {c ? (
            <>
              <span className="font-semibold">Next period around {fmtShort(c.nextPeriod)}</span>
              <span className="text-sm leading-5 text-neema-muted-strong">Cycle day {c.cycleDay}. An estimate only.</span>
            </>
          ) : (
            <>
              <span className="font-semibold">Track my period</span>
              <span className="text-sm leading-5 text-neema-muted-strong">Optional. Add the first day of your last period.</span>
            </>
          )}
        </Row>
        <WaterRow />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
export function HomeTab({ firstName, pregnancy }: { firstName: string; pregnancy: PregnancyData }) {
  const s = useNeema();
  const t = T[s.lang];
  const journey = JOURNEYS.find((j) => j.id === s.journey)!;
  const today = new Date().toLocaleDateString(s.lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const st = methodStatus(s.method);
  const lockMessage =
    s.journey === 'preg' ? `Week ${Math.max(1, pregnancy.currentWeek)}: time for your iron and folic acid tablet`
      : s.journey === 'pp' ? 'Time for a feed and a cup of water'
        : s.journey === 'ttc' ? 'Time for your folic acid tablet'
          : s.method.id === 'coc' || s.method.id === 'pop' ? 'Time for your pill'
            : st?.due ? `Reminder: your next appointment is on ${fmtShort(st.due)}` : 'You have a new reminder';

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 px-4 pb-6 pt-2">
      <div className="px-0.5 pt-1">
        <div className="text-2xl font-bold leading-8">{t.greeting}, {firstName}</div>
        <div className="text-neema-muted-strong">{today}{s.city ? ` · ${s.city}` : ''}</div>
      </div>

      {s.journey === 'preg' && <PregnantHome pregnancy={pregnancy} />}
      {s.journey === 'pp' && <AfterBirthHome pregnancy={pregnancy} />}
      {s.journey === 'ttc' && <TryingHome />}
      {s.journey === 'avoid' && <AvoidingHome />}

      <Card className="flex flex-col gap-3 px-5 pb-5 pt-4">
        <SwitchRow label="Discreet mode" sub={s.journey === 'avoid' ? 'Recommended on a shared phone: neutral app name and lock-screen messages' : 'Neutral app name and lock-screen messages on shared phones'} on={s.discreet} onToggle={() => s.setDiscreet(!s.discreet)} />
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
              <span className="flex flex-col"><span className="text-[13px] font-semibold leading-[18px] text-[#D9DBE3]">NEEMA · now</span><span>{lockMessage}</span></span>
            </>
          )}
        </div>
      </Card>

      <p className="text-center text-sm leading-5 text-neema-muted-strong">
        {journey.id === 'pp' ? 'Heavy bleeding, fever or a baby who won’t feed?' : 'Feeling unwell?'} The <span className="font-semibold text-neema-sos">SOS</span> button is always at the top of the screen.
      </p>
    </div>
  );
}
