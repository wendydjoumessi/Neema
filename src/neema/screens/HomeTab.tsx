import { ReactNode } from 'react';
import {
  MessageCircle, Leaf, ShoppingBag, Activity, Droplet, ChevronRight, Ruler, CalendarHeart, ListChecks,
  Scale, MapPin, Stethoscope, Syringe, Pill as PillIcon, HeartHandshake, Baby, Sparkles, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import pregTipPhoto from '@/assets/about-health-nutrition.jpg';
import ppTipPhoto from '@/assets/pregnant-couple.jpg';
import ttcTipPhoto from '@/assets/health-nutrition.webp';
import avoidTipPhoto from '@/assets/family-planning-new.webp';
import type { PregnancyData } from '@/types/pregnancy';
import { JOURNEYS, SHOP, T, TTC_CHECK, babySizeFor, milestoneFor, waterTarget } from '../data';
import { addDays, isoDate, cycleInfo, daysBetween, fmtShort, methodStatus, nextBabyVaccine, nextPostnatalCheck, todayIso, type CycleInfo } from '../cycle';
import { useNeema, type Mood } from '../store';
import { Card, CheckBox, H2 } from '../ui';
import { HScroll, ProgressRing, Reveal, StoryRow, type Story } from '../motion';
import { BabyArt, CycleWheel, GlowArt, MoodFace, MotherBabyArt, PlateArt, ShieldArt, StethoArt, TryingArt, WaterDrops } from '../art';
import { fmtDate } from '../format';

type Quick = { label: string; sub: string; Icon: typeof Leaf; bg: string; ink: string; onClick: () => void };

// ---------------------------------------------------------------------------
// Shared building blocks (same look for every journey)
// ---------------------------------------------------------------------------
/** Hero card: short, with a gently moving picture on the right. */
function Hero({ children, art }: { children: ReactNode; art?: ReactNode }) {
  return (
    <section className="relative flex flex-col gap-3 overflow-hidden rounded-[28px] bg-gradient-to-br from-neema-primary to-neema-dark p-5 text-white shadow-neema-hero">
      <div aria-hidden="true" className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />
      <div aria-hidden="true" className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-neema-ochre/20" />
      {art ? (
        <div className="relative flex items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</div>
          <div className="flex-none">{art}</div>
        </div>
      ) : children}
    </section>
  );
}

/** A soft translucent line inside the hero, for the one detail that matters next. */
function HeroBox({ Icon, tint, children }: { Icon: typeof Leaf; tint: string; children: ReactNode }) {
  return (
    <div className="relative flex items-center gap-3 rounded-2xl bg-white px-3.5 py-2.5 text-neema-ink">
      <span aria-hidden="true" className={cn('flex h-10 w-10 flex-none items-center justify-center rounded-full', tint)}><Icon className="h-5 w-5" /></span>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="relative text-[13px] font-bold uppercase leading-[18px] tracking-[0.08em] text-white/90">{children}</span>;
}

/** Quick actions in one sideways row instead of a tall grid. */
function QuickRow({ items }: { items: Quick[] }) {
  return (
    <section aria-label="Quick actions">
      <HScroll>
        {items.map(({ label, sub, Icon, bg, ink, onClick }) => (
          <button key={label} type="button" onClick={onClick} className={cn('neema-press flex min-h-[112px] w-[140px] flex-none flex-col items-start justify-between gap-2 rounded-3xl p-3.5 text-left', bg)}>
            <span className={cn('flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm', ink)}><Icon className="h-6 w-6" /></span>
            <span className="flex flex-col">
              <span className="font-bold leading-5">{label}</span>
              <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{sub}</span>
            </span>
          </button>
        ))}
      </HScroll>
    </section>
  );
}

function Row({ Icon, ink, onClick, children }: { Icon: typeof Leaf; ink: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="neema-press flex min-h-[60px] items-center gap-3 rounded-2xl bg-neema-cream px-3 py-2 text-left">
      <span aria-hidden="true" className={cn('flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-white', ink)}><Icon className="h-5 w-5" /></span>
      <span className="flex min-w-0 flex-1 flex-col">{children}</span>
      <ChevronRight className="h-5 w-5 flex-none text-neema-muted" />
    </button>
  );
}

function TickRow({ on, onToggle, label, sub }: { on: boolean; onToggle: () => void; label: string; sub: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onToggle} className={cn('neema-press flex min-h-[60px] items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors', on ? 'bg-neema-success-soft' : 'bg-neema-cream')}>
      <CheckBox on={on} />
      <span className="flex flex-1 flex-col"><span className="font-semibold">{label}</span><span className="text-sm leading-5 text-neema-muted-strong">{sub}</span></span>
    </button>
  );
}

/** Water as drops that fill in, instead of a sentence. Tap to log in Diet. */
function WaterRow() {
  const s = useNeema();
  const total = waterTarget(s.journey);
  return (
    <button type="button" onClick={() => { s.setDietView('day'); s.setTab('diet'); }} className="neema-press flex min-h-[60px] items-center gap-3 rounded-2xl bg-neema-cream px-3 py-2.5 text-left">
      <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-white text-neema-water"><Droplet className="h-5 w-5" /></span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span>Water today: <span className="font-bold">{s.water} of {total} cups</span></span>
        <WaterDrops value={s.water} total={total} />
      </span>
      <ChevronRight className="h-5 w-5 flex-none text-neema-muted" />
    </button>
  );
}

function TodayCard({ children }: { children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-2.5 rounded-[24px] px-4 py-4">
      <H2 className="px-1">Today</H2>
      {children}
    </Card>
  );
}

const quickAsk = (sub: string, go: () => void): Quick => ({ label: 'Ask Neema', sub, Icon: MessageCircle, bg: 'bg-neema-primary-soft', ink: 'text-neema-dark', onClick: go });

/** Last 7 days (today included) that are ticked in a by-date record. */
function last7(record: Record<string, boolean>) {
  return Array.from({ length: 7 }, (_, i) => isoDate(addDays(new Date(), -i))).filter((d) => record[d]).length;
}

/** The tip story: the photo tip that used to fill half the screen. */
const tipStory = (o: { photo: string; alt: string; title: string; text: string; source: string }): Story => ({
  id: 'tip', label: 'Today’s tip', kicker: 'Today’s tip', tone: '#FBEFD9', photo: o.photo, photoAlt: o.alt,
  art: <img src={o.photo} alt="" className="h-full w-full object-cover" />, title: o.title, text: o.text, source: o.source,
});

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
  const stories: Story[] = [
    tipStory({ photo: pregTipPhoto, alt: 'A pregnant woman preparing fresh fruit and vegetables', title: 'Take your iron tablet with an orange, not with tea', text: 'Vitamin C helps your body absorb iron. Keep tea and coffee for between meals.', source: 'WHO antenatal care recommendations (2016)' }),
    { id: 'week', label: 'This week', kicker: `This week · week ${week}`, tone: '#F9D9CC', art: <BabyArt className="h-full w-full" />, title: `About the size of ${size.size}`, text: milestoneFor(week) },
    { id: 'diet', label: 'Diet tip', kicker: 'This week’s diet tip', tone: '#E4F3E8', art: <PlateArt className="h-full w-full" />, title: 'Folong with groundnuts', text: 'Iron, folate and protein in one pot.', action: { label: 'What to eat', onClick: () => s.setTab('diet') } },
    { id: 'skin', label: 'Skin', kicker: 'Body & skin', tone: '#EDE9F6', art: <GlowArt className="h-full w-full" />, title: 'Your skin in pregnancy', text: 'Stretch marks, dark patches, ingredient checker', action: { label: 'Open Body & skin', onClick: () => s.openBody('skin') } },
  ];
  return (
    <>
      <Reveal i={0}><StoryRow stories={stories} /></Reveal>
      <Reveal i={1}>
        <Hero art={(
          <ProgressRing value={progress / 100} size={104} stroke={8} color="#FFFFFF" track="rgba(255,255,255,.25)" label={`${progress} percent of pregnancy completed`}>
            <span className="neema-float block h-[76px] w-[76px]"><BabyArt className="h-full w-full" /></span>
          </ProgressRing>
        )}>
          <Eyebrow>Trimester {pregnancy.trimester} · week {week} of 40</Eyebrow>
          <h1 className="text-4xl font-bold leading-[44px]">Week {week}</h1>
          <span className="text-[15px] leading-[21px] text-white/90">{daysToGo} days to go · due {fmtDate(new Date(pregnancy.dueDate))}</span>
        </Hero>
      </Reveal>
      <Reveal i={2}>
        <div className="flex items-center gap-3 rounded-3xl bg-neema-ochre-soft px-4 py-3">
          <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-white text-neema-ochre-ink"><Ruler className="h-5 w-5" /></span>
          <span className="flex min-w-0 flex-col">
            <span className="font-semibold leading-5">About the size of {size.size}</span>
            <span className="text-[15px] leading-[21px] text-neema-muted-strong">Around {size.length}{size.weight ? ` and ${size.weight}` : ''}</span>
          </span>
        </div>
      </Reveal>
      <Reveal i={3}>
        <QuickRow items={[
          quickAsk('Questions, any time', () => s.setTab('ask')),
          { label: 'What to eat', sub: `Local foods for week ${week}`, Icon: Leaf, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('diet') },
          { label: 'Shopping', sub: `${shopDone} of ${essentials.length} essentials`, Icon: ShoppingBag, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('shop') },
          { label: 'Symptom checker', sub: 'How are you feeling?', Icon: Activity, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.openSymptom() },
        ]} />
      </Reveal>
      <Reveal i={4}>
        <TodayCard>
          <WaterRow />
          <Row Icon={Leaf} ink="text-neema-success-ink" onClick={() => s.setTab('diet')}>
            <span className="text-[13px] font-semibold leading-[18px] text-neema-success-ink">THIS WEEK’S DIET TIP</span>
            <span className="font-semibold leading-5">Folong with groundnuts: iron, folate and protein in one pot</span>
          </Row>
          <Row Icon={Sparkles} ink="text-[#4A3F6B]" onClick={() => s.openBody('skin')}>
            <span className="font-semibold leading-5">Skin changes & safe products</span>
            <span className="text-sm leading-5 text-neema-muted-strong">Stretch marks, dark patches, ingredient checker</span>
          </Row>
        </TodayCard>
      </Reveal>
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

  const stories: Story[] = [
    tipStory({ photo: ppTipPhoto, alt: 'A newborn’s feet wrapped in a soft white towel', title: 'Breastfeed on demand, day and night', text: 'Give only breast milk for the first 6 months: no water or other drinks, even in the heat. Feeding often helps your milk supply.', source: 'WHO infant feeding recommendations' }),
    { id: 'recovery', label: 'Recovery', kicker: title, tone: '#E4F3E8', art: <MotherBabyArt className="h-full w-full" />, title: 'Your recovery now', text: stage },
    ...(check ? [{ id: 'check', label: 'Next check', kicker: 'Postnatal check', tone: '#EDE9F6', art: <StethoArt className="h-full w-full" />, title: `${check.label}: by ${fmtShort(check.date)}`, text: check.text }] : []),
    { id: 'spacing', label: 'Spacing', kicker: 'Birth spacing', tone: '#FBEFD9', art: <ShieldArt className="h-full w-full" />, title: 'Birth spacing', text: 'Methods to start after birth', action: { label: 'See methods', onClick: () => s.setTab('fp') } },
  ];

  return (
    <>
      <Reveal i={0}><StoryRow stories={stories} /></Reveal>
      <Reveal i={1}>
        <Hero art={<span className="neema-float block h-[96px] w-[96px] rounded-full bg-white/90 p-1"><MotherBabyArt className="h-full w-full" /></span>}>
          <Eyebrow>After birth{birth ? ` · born ${fmtShort(birth)}` : ''}</Eyebrow>
          <h1 className="text-[32px] font-bold leading-10">{title}</h1>
          {pregnancy.babyName && <span className="font-semibold">With {pregnancy.babyName}</span>}
        </Hero>
      </Reveal>
      {(check || vaccine) && (
        <Reveal i={2}>
          {check ? (
            <HeroBox Icon={Stethoscope} tint="bg-neema-success-soft text-neema-success-ink">
              <span className="font-semibold leading-5">{check.label}: by {fmtShort(check.date)}</span>
              <span className="text-[15px] leading-[21px] text-neema-muted-strong">{check.text}</span>
            </HeroBox>
          ) : vaccine && (
            <HeroBox Icon={Syringe} tint="bg-neema-success-soft text-neema-success-ink">
              <span className="font-semibold leading-5">Baby’s {vaccine.label} vaccines: {fmtShort(vaccine.date)}</span>
              <span className="text-[15px] leading-[21px] text-neema-muted-strong">Bring baby’s vaccination card.</span>
            </HeroBox>
          )}
        </Reveal>
      )}
      <Reveal i={3}>
        <section aria-labelledby="body-card" className="flex flex-col gap-3 rounded-[24px] bg-white p-4 shadow-neema-card">
          <div className="px-1">
            <h2 id="body-card" className="text-xl font-semibold leading-7">Your body after birth</h2>
            <p className="text-[15px] leading-[21px] text-neema-muted-strong">Getting your tummy back safely, stretch marks and skin care, without harmful products.</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={() => s.openBody('activity')} className="neema-press flex min-h-[132px] flex-col items-start justify-between gap-1 overflow-hidden rounded-3xl bg-neema-success-soft p-3 text-left">
              <span className="h-14 w-14"><MotherBabyArt className="h-full w-full" /></span>
              <span className="flex flex-col">
                <span className="font-semibold leading-5">Tummy & exercise</span>
                <span className="text-[13px] font-medium leading-[18px] text-neema-success-ink">{s.bodyPlan.checked ? 'Building strength' : 'Gentle start'}</span>
              </span>
            </button>
            <button type="button" onClick={() => s.openBody('skin')} className="neema-press flex min-h-[132px] flex-col items-start justify-between gap-1 overflow-hidden rounded-3xl bg-neema-ochre-soft p-3 text-left">
              <span className="h-14 w-14"><GlowArt className="h-full w-full" /></span>
              <span className="flex flex-col">
                <span className="font-semibold leading-5">Stretch marks & skin</span>
                <span className="text-[13px] font-medium leading-[18px] text-neema-ochre-ink">What really helps</span>
              </span>
            </button>
          </div>
        </section>
      </Reveal>
      <Reveal i={4}>
        <QuickRow items={[
          quickAsk('Feeding, sleep, recovery', () => s.setTab('ask')),
          { label: 'What to eat', sub: 'Foods for recovery and feeding', Icon: Leaf, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('diet') },
          { label: 'Birth spacing', sub: 'Methods to start after birth', Icon: CalendarHeart, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('fp') },
          { label: 'Symptom checker', sub: 'For you or baby', Icon: Activity, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.openSymptom() },
        ]} />
      </Reveal>
      <Reveal i={5}>
        <TodayCard>
          <div className="flex flex-col gap-2.5 rounded-2xl bg-neema-cream p-3">
            <div className="flex items-center gap-3">
              <ProgressRing value={Math.min(1, feeds.count / 10)} size={52} stroke={5} color="#D95D39" label={`${feeds.count} feeds today`}>
                <span className="text-lg font-bold leading-5" aria-live="polite">{feeds.count}</span>
              </ProgressRing>
              <span className="flex flex-1 flex-col">
                <span>Feeds today: <span className="font-bold">{feeds.count}</span></span>
                <span className="text-sm leading-5 text-neema-muted-strong">
                  {feeds.last ? `Last feed ended on the ${feeds.last}. Start on the ${feeds.last === 'left' ? 'right' : 'left'} next time.` : 'Tap the side you fed on.'}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['left', 'right'] as const).map((side) => {
                const next = feeds.last && feeds.last !== side;
                return (
                  <button key={side} type="button" onClick={() => addFeed(side)}
                    className={cn('neema-press relative flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 bg-white font-semibold', next ? 'border-neema-primary text-neema-dark' : 'border-transparent')}>
                    <Baby className="h-5 w-5" /> + {side === 'left' ? 'Left' : 'Right'} breast
                    {next && <span className="absolute -top-2 right-2 rounded-full bg-neema-primary px-2 text-[13px] font-semibold leading-5 text-white">Next</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <WaterRow />
          <div className="flex flex-col gap-2.5 rounded-2xl bg-neema-cream p-3">
            <span className="font-semibold">How are you feeling today?</span>
            <div role="radiogroup" aria-label="How are you feeling today?" className="grid grid-cols-4 gap-1.5">
              {MOODS.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={mood === m.id} onClick={() => s.setMood({ ...s.mood, [today]: m.id })}
                  className={cn('neema-press flex min-h-[80px] flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 text-[13px] font-semibold leading-[18px] transition-colors',
                    mood === m.id ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-transparent bg-white')}>
                  <MoodFace mood={m.id} className={cn('h-10 w-10 transition-transform', mood === m.id && 'scale-110')} />
                  {m.label}
                </button>
              ))}
            </div>
            {mood && (
              <p className="neema-rise text-[15px] leading-[22px]">
                {mood === 'good' ? 'Lovely. Keep resting when baby sleeps.'
                  : mood === 'ok' ? 'Thank you for checking in. Small rests and help from family make a real difference.'
                    : 'Many mothers feel low or tearful in the first two weeks. If it lasts longer than two weeks, or you feel hopeless, talk to a health worker. You are not alone.'}
              </p>
            )}
            {(mood === 'low' || mood === 'hard') && (
              <button type="button" onClick={() => s.openSos()} className="neema-press flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-neema-ink font-semibold text-white">
                <HeartHandshake className="h-5 w-5" /> Talk to someone now
              </button>
            )}
          </div>
        </TodayCard>
      </Reveal>
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
    <div className="relative flex flex-col gap-1.5 text-neema-ink">
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
  const stories: Story[] = [
    tipStory({ photo: ttcTipPhoto, alt: 'Fresh vegetables, fish, beans and fruit on a table', title: 'Start folic acid now, not when you find out', text: 'Baby’s spine forms in the first weeks, often before a test is positive. A daily folic acid tablet is cheap at most pharmacies.', source: 'WHO preconception care recommendations' }),
    { id: 'check', label: 'Checklist', kicker: 'Getting ready', tone: '#EDE9F6', art: <TryingArt className="h-full w-full" />, title: 'Pre-conception checklist', text: `${done} of ${TTC_CHECK.length} done`, action: { label: 'Open my checklist', onClick: () => s.setTab('fp') } },
    { id: 'food', label: 'What to eat', kicker: 'Food', tone: '#E4F3E8', art: <PlateArt className="h-full w-full" />, title: 'Foods for conceiving', text: 'Local foods that build iron and folate before pregnancy.', action: { label: 'What to eat', onClick: () => s.setTab('diet') } },
  ];
  return (
    <>
      <Reveal i={0}><StoryRow stories={stories} /></Reveal>
      <Reveal i={1}>
        {c && head ? (
          <Hero art={(
            <span role="img" aria-label={`Day ${c.cycleDay} of a ${s.cycleLen}-day cycle`}>
              <CycleWheel cycleLen={s.cycleLen} periodLen={s.periodLen} day={c.cycleDay} ovulationDay={s.cycleLen - 14} size={116}>
                <span className="text-[28px] font-bold leading-8">{c.cycleDay}</span>
                <span className="text-[13px] font-semibold leading-4 text-white/90">cycle day</span>
              </CycleWheel>
            </span>
          )}>
            <Eyebrow>Trying to conceive · cycle day {c.cycleDay}</Eyebrow>
            <h1 className="text-[28px] font-bold leading-9">{head.title}</h1>
            <span className="text-[15px] leading-[21px] text-white/90">{head.sub}</span>
          </Hero>
        ) : (
          <Hero art={<span className="neema-float block h-[88px] w-[88px] rounded-full bg-white/90 p-1"><TryingArt className="h-full w-full" /></span>}>
            <Eyebrow>Trying to conceive</Eyebrow>
            <h1 className="text-[28px] font-bold leading-9">Let’s find your fertile days</h1>
          </Hero>
        )}
      </Reveal>
      <Reveal i={2}>
        {c ? (
          <div className="flex flex-col gap-2">
            <HeroBox Icon={CalendarHeart} tint="bg-neema-primary-soft text-neema-dark">
              <span className="font-semibold leading-5">Next period around {fmtShort(c.nextPeriod)}</span>
              <span className="text-[15px] leading-[21px] text-neema-muted-strong">Based on a {s.cycleLen}-day cycle. An estimate only.</span>
            </HeroBox>
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-[13px] font-semibold leading-[18px] text-neema-muted-strong" aria-hidden="true">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-neema-dark bg-white" /> Period</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#7FD49A]" /> Fertile window</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-neema-ochre" /> Today</span>
            </div>
            {c.phase === 'late' && (
              <button type="button" onClick={() => s.setJourney('preg')} className="neema-press min-h-[52px] rounded-2xl bg-neema-dark font-semibold text-white">My test is positive: I’m pregnant</button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-[24px] bg-white p-4 shadow-neema-card">
            <p className="text-[15px] leading-[21px] text-neema-muted-strong">Add the first day of your last period. Neema estimates your fertile window and next period from it.</p>
            <LastPeriodBox />
          </div>
        )}
      </Reveal>
      <Reveal i={3}>
        <QuickRow items={[
          quickAsk('Fertility questions', () => s.setTab('ask')),
          { label: 'My cycle', sub: c ? 'Calendar and settings' : 'Add your period', Icon: CalendarHeart, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('fp') },
          { label: 'Checklist', sub: `${done} of ${TTC_CHECK.length} done`, Icon: ListChecks, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.setTab('fp') },
          { label: 'What to eat', sub: 'Foods for conceiving', Icon: Leaf, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('diet') },
        ]} />
      </Reveal>
      <Reveal i={4}>
        <TodayCard>
          <TickRow on={!!s.folic[today]} onToggle={() => s.setFolic({ ...s.folic, [today]: !s.folic[today] })} label="Folic acid tablet" sub={s.folic[today] ? 'Taken today. Well done.' : 'One tablet a day, every day.'} />
          <WaterRow />
        </TodayCard>
      </Reveal>
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

  const week7 = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 6));
  const stories: Story[] = [
    tipStory({ photo: avoidTipPhoto, alt: 'Hands holding a paper cut-out of a family', title: 'Had sex without protection?', text: 'Emergency contraceptive pills work best as soon as possible, and up to 5 days after. A copper IUD fitted within 5 days is the most effective option.', source: 'WHO Family Planning: A Global Handbook' }),
    { id: 'compare', label: 'Methods', kicker: 'Compare methods', tone: '#FBEFD9', art: <ShieldArt className="h-full w-full" />, title: 'Compare methods', text: 'Side by side', action: { label: 'Compare methods', onClick: () => s.setTab('fp') } },
    { id: 'clinic', label: 'Clinics', kicker: 'Find a clinic', tone: '#E4F3E8', art: <StethoArt className="h-full w-full" />, title: 'Find a clinic', text: 'Family planning units', action: { label: 'Find a clinic', onClick: () => s.setTab('fp') } },
  ];
  return (
    <>
      <Reveal i={0}><StoryRow stories={stories} /></Reveal>
      <Reveal i={1}>
        {!st ? (
          <Hero art={<span className="neema-float block h-[88px] w-[88px] rounded-full bg-white/90 p-1"><ShieldArt className="h-full w-full" /></span>}>
            <Eyebrow>Avoiding pregnancy</Eyebrow>
            <h1 className="text-[28px] font-bold leading-9">Find a method that fits your life</h1>
          </Hero>
        ) : (
          <Hero art={<span className="neema-float block h-[80px] w-[80px] rounded-full bg-white/90 p-1"><ShieldArt className="h-full w-full" /></span>}>
            <Eyebrow>My method</Eyebrow>
            <h1 className="text-[26px] font-bold leading-8">{st.def.name.replace(/\s*\(.*\)$/, '')}</h1>
            {/\(.*\)$/.test(st.def.name) && <span className="text-[15px] leading-[21px] text-white/90">{st.def.name.match(/\((.*)\)$/)![1]}</span>}
          </Hero>
        )}
      </Reveal>
      <Reveal i={2}>
        {!st ? (
          <div className="flex flex-col gap-3 rounded-[24px] bg-white p-4 shadow-neema-card">
            <p className="text-[15px] leading-[21px] text-neema-muted-strong">Compare methods privately: how well each one works, possible side effects, and how soon you can get pregnant after stopping.</p>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => s.setTab('fp')} className="neema-press min-h-[52px] rounded-2xl bg-neema-dark font-semibold text-white">Compare methods</button>
              <button type="button" onClick={() => s.setTab('fp')} className="neema-press min-h-[52px] rounded-2xl border border-neema-border font-semibold text-neema-dark">I already use a method</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-[24px] bg-white p-4 shadow-neema-card">
            {isPill ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex flex-col">
                    <span className="font-semibold leading-5">{pillTaken ? 'Today’s pill: taken' : 'Today’s pill'}</span>
                    <span className="text-[15px] leading-[21px] text-neema-muted-strong">Taken {last7(s.pills)} of the last 7 days</span>
                  </span>
                  <PillIcon className="h-6 w-6 text-neema-dark" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
                  {week7.map((d) => {
                    const on = !!s.pills[isoDate(d)];
                    return (
                      <span key={isoDate(d)} className="flex flex-col items-center gap-1">
                        <span className={cn('flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors', on ? 'border-neema-success bg-neema-success text-white' : 'border-neema-border bg-white')}>
                          {on && <Check className="h-4 w-4" />}
                        </span>
                        <span className="text-[13px] font-semibold leading-4 text-neema-muted-strong">{d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</span>
                      </span>
                    );
                  })}
                </div>
                <button type="button" aria-pressed={pillTaken} onClick={togglePill} className={cn('neema-press min-h-[52px] rounded-2xl font-semibold', pillTaken ? 'border border-neema-border bg-white text-neema-ink' : 'bg-neema-dark text-white')}>
                  {pillTaken ? 'Undo' : 'I took it today'}
                </button>
              </>
            ) : st.def.renewDays ? (
              st.due ? (
                <div className="flex items-center gap-3">
                  <ProgressRing value={st.daysLeft! < 0 ? 1 : 1 - st.daysLeft! / st.def.renewDays} size={64} stroke={6} color={st.daysLeft! < 0 ? '#B54523' : '#2B9348'} label={`${Math.max(0, st.daysLeft!)} days left`}>
                    <span className="text-lg font-bold leading-5">{Math.max(0, st.daysLeft!)}</span>
                    <span className="text-[13px] leading-4 text-neema-muted-strong">days</span>
                  </ProgressRing>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold leading-5">{st.def.id.startsWith('inject') ? `Next injection by ${fmtShort(st.due)}` : `Protected until ${fmtDate(st.due)}`}</span>
                    <span className="text-[15px] leading-[21px] text-neema-muted-strong">
                      {st.daysLeft! < 0 ? 'Overdue: go to your clinic soon and use condoms until then.' : `${st.daysLeft} days left. ${st.def.graceText ?? st.def.note}`}
                    </span>
                  </span>
                </div>
              ) : (
                <>
                  <span className="font-semibold">Add the date to get a reminder</span>
                  <button type="button" onClick={() => s.setTab('fp')} className="neema-press min-h-[52px] rounded-2xl bg-neema-dark font-semibold text-white">Add the date</button>
                </>
              )
            ) : (
              <p className="text-[15px] leading-[22px]">{st.def.note}</p>
            )}
            <button type="button" onClick={() => s.setTab('fp')} className="min-h-[44px] self-start rounded-full px-1 font-semibold text-neema-dark underline-offset-4 hover:underline">Change method</button>
          </div>
        )}
      </Reveal>
      <Reveal i={3}>
        <QuickRow items={[
          quickAsk('Private questions', () => s.setTab('ask')),
          { label: 'Compare methods', sub: 'Side by side', Icon: Scale, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', onClick: () => s.setTab('fp') },
          { label: 'Find a clinic', sub: 'Family planning units', Icon: MapPin, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', onClick: () => s.setTab('fp') },
          { label: 'Symptom checker', sub: 'Side effects or worries', Icon: Activity, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', onClick: () => s.openSymptom() },
        ]} />
      </Reveal>
      <Reveal i={4}>
        <TodayCard>
          {isPill && <TickRow on={pillTaken} onToggle={togglePill} label="Today’s pill" sub={pillTaken ? 'Taken. See you tomorrow.' : 'At about the same time every day.'} />}
          <Row Icon={CalendarHeart} ink="text-neema-dark" onClick={() => s.setTab('fp')}>
            {c ? (
              <>
                <span className="font-semibold leading-5">Next period around {fmtShort(c.nextPeriod)}</span>
                <span className="text-sm leading-5 text-neema-muted-strong">Cycle day {c.cycleDay}. An estimate only.</span>
              </>
            ) : (
              <>
                <span className="font-semibold leading-5">Track my period</span>
                <span className="text-sm leading-5 text-neema-muted-strong">Optional. Add the first day of your last period.</span>
              </>
            )}
          </Row>
          <WaterRow />
        </TodayCard>
      </Reveal>
    </>
  );
}

// ---------------------------------------------------------------------------
export function HomeTab({ firstName, pregnancy }: { firstName: string; pregnancy: PregnancyData }) {
  const s = useNeema();
  const t = T[s.lang];
  const journey = JOURNEYS.find((j) => j.id === s.journey)!;
  const today = new Date().toLocaleDateString(s.lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 px-4 pb-8 pt-1">
      <Reveal className="px-0.5">
        <div className="text-[26px] font-bold leading-8">{t.greeting}, {firstName}</div>
        <div className="text-[15px] text-neema-muted-strong">{today}{s.city ? ` · ${s.city}` : ''}</div>
      </Reveal>

      {s.journey === 'preg' && <PregnantHome pregnancy={pregnancy} />}
      {s.journey === 'pp' && <AfterBirthHome pregnancy={pregnancy} />}
      {s.journey === 'ttc' && <TryingHome />}
      {s.journey === 'avoid' && <AvoidingHome />}

      <p className="flex items-center justify-center gap-2 px-2 text-center text-sm leading-5 text-neema-muted-strong">
        <span>{journey.id === 'pp' ? 'Heavy bleeding, fever or a baby who won’t feed?' : 'Feeling unwell?'} The <span className="font-semibold text-neema-sos">SOS</span> button is always at the top of the screen.</span>
      </p>
    </div>
  );
}
