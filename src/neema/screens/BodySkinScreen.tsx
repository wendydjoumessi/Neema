import { useState, type ReactNode } from 'react';
import {
  ChevronDown, Volume2, Square, AlertTriangle, Search, Ban, Lock, Unlock, Play, Check, X, Sprout, Dumbbell, Footprints, Activity, Sparkles,
  FlaskConical, ShieldCheck, Clock, CalendarDays, Hand, type LucideIcon,
} from 'lucide-react';
import { GlowArt, MotherBabyArt, PlateArt, PregnantArt } from '../art';
import { ProgressRing, Reveal } from '../motion';
import { ExerciseFigure, PROGRAMS, programSecs } from '../exerciseAnim';
import { ExercisePlayer } from './ExercisePlayer';
import { cn } from '@/lib/utils';
import type { PregnancyData } from '@/types/pregnancy';
import {
  CANT_CHANGE, CAN_CHANGE, STRETCH_HELPERS, MOVES_BUILD, MOVES_FULL, MOVES_GENERAL, MOVES_GENTLE, MOVES_PREG, QUICK_INGREDIENTS, SAFETY_LABEL,
  TUMMY_MYTHS, TUMMY_STOP, checkIngredients, type Move, type SafetyClass,
  type HelperIcon,
} from '../body';
import {
  AlmondIcon, CocoaIcon, CoconutIcon, DnaIcon, DropIcon, FadeTimeline, HandHeartIcon, HatIcon, LeafIcon, ShadeIcon, SheaIcon,
  SunscreenIcon, TubeIcon,
} from '../illustrations';
import { daysBetween, todayIso } from '../cycle';
import { useNeema, type BodySection } from '../store';
import { Card, CheckBox, H1, H2, SwitchRow, RegionalActivityTips } from '../ui';

type Nav = { goTab: (tab: 'diet' | 'ask') => void };

// ---------------------------------------------------------------------------
// Audio: read the steps aloud with the phone's own voice (works offline on most phones)
// ---------------------------------------------------------------------------
function useSpeech() {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = (id: string, text: string, lang: string) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    if (speaking === id) { setSpeaking(null); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'fr' ? 'fr-FR' : 'en-GB';
    u.rate = 0.9;
    u.onend = () => setSpeaking(null);
    setSpeaking(id);
    window.speechSynthesis.speak(u);
  };
  return { supported, speaking, speak };
}

/** One exercise as a fitness-style card: moving preview, done tick, and Start for the guided player. */
function MoveRow({ move, csection, speech, onStart }: { move: Move; csection: boolean; speech: ReturnType<typeof useSpeech>; onStart: () => void }) {
  const s = useNeema();
  const [open, setOpen] = useState(false);
  const today = todayIso();
  const done = (s.moves[today] ?? []).includes(move.id);
  const prog = PROGRAMS[move.id];
  const toggle = () => {
    const list = s.moves[today] ?? [];
    s.setMoves({ [today]: done ? list.filter((x) => x !== move.id) : [...list, move.id] });
  };
  const steps = [...move.steps, ...(csection && move.csNote ? [move.csNote] : [])];
  return (
    <li className="border-b border-neema-line last:border-b-0">
      <div className="flex items-center gap-3 py-2.5">
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="neema-press flex min-h-[64px] min-w-0 flex-1 items-center gap-3 text-left">
          <span className={cn('relative h-[64px] w-[84px] flex-none overflow-hidden rounded-2xl p-1 transition-colors duration-300', done ? 'bg-neema-success-soft' : 'bg-neema-cream')}>
            {prog && <ExerciseFigure program={prog} label={`${move.name}, animated`} className="h-full w-full" />}
            {done && <span aria-hidden="true" className="neema-check-pop absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neema-success text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-semibold leading-5">{move.name}</span>
            <span className="text-[15px] leading-[21px] text-neema-muted">{move.dose}</span>
          </span>
        </button>
        <button type="button" aria-label={`Done today: ${move.name}`} aria-pressed={done} onClick={toggle} className="-mr-2 flex h-12 w-12 flex-none items-center justify-center">
          <span key={String(done)} className={cn('block', done && 'neema-check-pop')}><CheckBox on={done} /></span>
        </button>
      </div>
      {open && (
        <div className="neema-fade mb-3 flex flex-col gap-2.5 rounded-2xl bg-neema-cream px-3.5 py-3 text-[15px] leading-[22px]">
          {prog && (
            <div className="aspect-[16/9] overflow-hidden rounded-xl bg-white p-2">
              <ExerciseFigure program={prog} label={`${move.name}, animated demonstration`} className="h-full w-full" />
            </div>
          )}
          <StepList steps={steps} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={onStart} className="neema-press neema-shine flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-neema-dark font-semibold text-white">
              <Play className="h-5 w-5" /> Start
            </button>
            {speech.supported ? (
              <button type="button" onClick={() => speech.speak(move.id, `${move.name}. ${move.dose}. ${steps.join(' ')}`, s.lang)}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-neema-border bg-white font-semibold text-neema-dark">
                {speech.speaking === move.id ? <><Square className="h-[18px] w-[18px]" /> Stop</> : <><Volume2 className="h-[18px] w-[18px]" /> Listen</>}
              </button>
            ) : <span />}
          </div>
        </div>
      )}
    </li>
  );
}

/** "Start today's routine" for every exercise in the plan except long walks, which have their own timer. */
function RoutineButton({ moves, onStart }: { moves: Move[]; onStart: (queue: Move[]) => void }) {
  const queue = moves.filter((m) => PROGRAMS[m.id] && !PROGRAMS[m.id].minutes);
  if (queue.length < 2) return null;
  const mins = Math.max(1, Math.round(queue.reduce((t, m) => t + programSecs(PROGRAMS[m.id]), 0) / 60));
  return (
    <button type="button" onClick={() => onStart(queue)} aria-label={`Start today’s routine · ${mins} min`}
      className="neema-press relative mt-3 flex min-h-[88px] items-center gap-4 overflow-hidden rounded-[22px] bg-gradient-to-br from-neema-primary to-neema-dark px-4 py-3 text-left text-white shadow-neema-hero">
      <span aria-hidden="true" className="neema-drift absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <span aria-hidden="true" className="neema-pulse relative flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white text-neema-dark">
        <Play className="relative ml-0.5 h-7 w-7" fill="currentColor" />
      </span>
      <span className="relative flex min-w-0 flex-col">
        <span className="text-lg font-bold leading-6">Start today’s routine</span>
        <span className="flex items-center gap-1.5 text-[15px] font-medium leading-[21px] text-white/90">
          <Clock className="h-4 w-4" aria-hidden="true" /> {mins} min · {queue.length} moves, guided
        </span>
      </span>
    </button>
  );
}

/** Numbered steps as small circles, easier to follow than a plain list. */
function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((st, i) => (
        <li key={st} className="flex items-start gap-2.5">
          <span aria-hidden="true" className="mt-px flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white text-[13px] font-bold text-neema-dark shadow-sm">{i + 1}</span>
          <span>{st}</span>
        </li>
      ))}
    </ol>
  );
}

/** A small coloured icon tile used in section headings. */
function HeadIcon({ Icon, tone }: { Icon: LucideIcon; tone: string }) {
  return <span aria-hidden="true" className={cn('flex h-10 w-10 flex-none items-center justify-center rounded-2xl', tone)}><Icon className="h-5 w-5" /></span>;
}

/** Gentle start → Building strength → Back to full activity, with the locked stages shown. */
const STAGES = [
  { id: 'gentle', label: 'Gentle start', Icon: Sprout },
  { id: 'build', label: 'Building strength', Icon: Dumbbell },
  { id: 'full', label: 'Back to full activity', Icon: Footprints },
] as const;
function StageSteps({ stage }: { stage: 'gentle' | 'build' | 'full' }) {
  const at = STAGES.findIndex((x) => x.id === stage);
  return (
    <ol aria-label="Your recovery stages" className="relative grid grid-cols-3 gap-1">
      <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-[22px] h-1 rounded-full bg-neema-sand" />
      <span aria-hidden="true" className="neema-bar-in absolute left-[16%] top-[22px] h-1 rounded-full bg-neema-success" style={{ width: `${at * 34}%` }} />
      {STAGES.map((st, i) => {
        const done = i < at; const now = i === at; const locked = i > at;
        return (
          <li key={st.id} aria-current={now ? 'step' : undefined} className="relative flex flex-col items-center gap-1.5 text-center">
            <span className={cn('flex h-11 w-11 items-center justify-center rounded-full ring-4 ring-white transition-colors',
              done ? 'bg-neema-success text-white' : now ? 'bg-neema-dark text-white shadow-neema-hero' : 'bg-neema-sand text-neema-muted')}>
              {done ? <Check className="h-5 w-5" strokeWidth={3} /> : locked ? <Lock className="h-4 w-4" /> : <st.Icon className="h-5 w-5" />}
            </span>
            <span className={cn('text-[13px] leading-[17px]', now ? 'font-bold text-neema-ink' : 'font-semibold text-neema-muted-strong')}>{st.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Fold({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="flex flex-col py-4">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-[48px] items-center justify-between gap-3 text-left">
        <span className="flex items-center gap-3"><HeadIcon Icon={Sparkles} tone="bg-neema-lilac text-neema-lilac-ink" /><H2>{title}</H2></span>
        <ChevronDown aria-hidden="true" className={cn('h-5 w-5 flex-none text-neema-muted transition-transform duration-300', open && 'rotate-180')} />
      </button>
      {open && <div className="neema-fade mt-2 flex flex-col gap-2">{children}</div>}
    </Card>
  );
}

function GeneticsCard({ go }: { go: (to: BodySection | 'diet') => void }) {
  return (
    <Card className="flex flex-col gap-3">
      <H2>What you can and can’t change</H2>
      <div className="rounded-xl bg-neema-sand px-3.5 py-3">
        <div className="mb-1 flex items-center gap-2 text-[13px] font-semibold uppercase leading-[18px] tracking-[0.04em] text-neema-muted-strong"><DnaIcon className="h-8 w-8" /> Mostly in your genes</div>
        <ul className="flex flex-col gap-1 text-[15px] leading-[22px]">{CANT_CHANGE.map((c) => <li key={c}>• {c}</li>)}</ul>
      </div>
      <div className="rounded-xl bg-neema-success-soft px-3.5 py-2">
        <div className="mb-1 mt-1 flex items-center gap-2 text-[13px] font-semibold uppercase leading-[18px] tracking-[0.04em] text-neema-success-ink"><HandHeartIcon className="h-8 w-8" /> In your hands</div>
        <ul className="flex flex-col">
          {CAN_CHANGE.map((c) => (
            <li key={c.text}>
              <button type="button" onClick={() => go(c.to)} className="flex min-h-[48px] w-full items-center justify-between gap-2 text-left text-[15px] font-semibold leading-[22px]">
                {c.text}<ChevronDown className="h-4 w-4 flex-none -rotate-90 text-neema-success-ink" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tummy & activity
// ---------------------------------------------------------------------------
function AfterBirthActivity({ pregnancy, goTab }: { pregnancy: PregnancyData } & Nav) {
  const s = useNeema();
  const speech = useSpeech();
  const plan = s.bodyPlan;
  const days = pregnancy.birthDate ? Math.max(0, daysBetween(pregnancy.birthDate, new Date())) : null;
  const weeks = days === null ? null : Math.floor(days / 7);
  const stage = !plan.checked ? 'gentle' : weeks !== null && weeks >= 12 ? 'full' : 'build';
  const moves = stage === 'gentle' ? MOVES_GENTLE : stage === 'build' ? [...MOVES_BUILD, MOVES_GENTLE[0], MOVES_GENTLE[1]] : [...MOVES_FULL, ...MOVES_BUILD.slice(1, 3), MOVES_GENTLE[0]];
  const doneToday = (s.moves[todayIso()] ?? []).filter((id) => moves.some((m) => m.id === id)).length;
  const [player, setPlayer] = useState<{ queue: Move[]; start: number } | null>(null);
  const womb = days === null ? null : Math.min(100, Math.round((days / 42) * 100));

  return (
    <>
      <Reveal as="section" i={0} className="flex flex-col gap-3 rounded-[24px] bg-white px-5 py-4 shadow-neema-card">
        <H2>Your tummy right now</H2>
        {womb !== null && (
          <div className="flex items-center gap-4 rounded-2xl bg-neema-success-soft/60 p-3">
            <ProgressRing value={womb / 100} size={84} stroke={9} track="#FFFFFF" label={`Womb recovery about ${womb} percent`}>
              <span className="text-lg font-bold leading-6 text-neema-success-ink">{womb}%</span>
            </ProgressRing>
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold leading-5">Womb shrinking back</span>
              <span className="text-[15px] leading-[21px] text-neema-muted-strong">{womb < 100 ? `about ${6 - Math.min(5, weeks ?? 0)} weeks to go` : 'back in your pelvis'}</span>
            </span>
          </div>
        )}
        <p className="text-[15px] leading-[22px]">
          {days === null || days < 42
            ? 'Your womb takes about 6 weeks to shrink back. Breastfeeding helps it contract, which is why you may feel cramps while feeding. A rounded tummy in these weeks is normal.'
            : 'Your womb is back to its usual size. What remains is mostly stretched skin and muscle, and some stored fat. Most of it goes gradually over 6 to 12 months with good food and regular movement.'}
        </p>
        <p className="flex items-start gap-2.5 rounded-2xl bg-neema-ochre-soft px-3.5 py-2.5 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">
          <Sprout className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
          There’s no quick fix. Slow and steady is safest, and it protects your milk.
        </p>
      </Reveal>

      <Reveal as="section" i={1} className="flex flex-col rounded-[24px] bg-white px-5 pb-2 pt-4 shadow-neema-card">
        <StageSteps stage={stage} />
        <div className="mt-4 flex items-center justify-between gap-2">
          <H2>{stage === 'gentle' ? 'Gentle start' : stage === 'build' ? 'Building strength' : 'Back to full activity'}</H2>
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-neema-cream py-0.5 pl-1 pr-2.5 text-[13px] font-semibold leading-[20px] text-neema-muted-strong">
            <ProgressRing value={moves.length ? doneToday / moves.length : 0} size={20} stroke={3} />{doneToday} of {moves.length} today
          </span>
        </div>
        <p className="mt-1 text-[15px] leading-[22px] text-neema-muted-strong">
          {stage === 'gentle'
            ? 'Safe from the first days. Watch each move, then press Start and follow along.'
            : stage === 'build' ? 'Your health worker said you can be more active. Build up a little each week.' : 'Aim for 150 active minutes a week, the same as other adults.'}
        </p>
        <div className="mt-3"><RegionalActivityTips country={s.country} region={s.region} onSetRegion={() => { s.setExtraId(null); s.setTab('profile'); }} /></div>
        <RoutineButton moves={moves} onStart={(queue) => setPlayer({ queue, start: 0 })} />
        <ul className="mt-2 flex flex-col">{moves.map((m) => <MoveRow key={m.id} move={m} csection={plan.csection} speech={speech} onStart={() => setPlayer({ queue: [m], start: 0 })} />)}</ul>
      </Reveal>
      {player && <ExercisePlayer queue={player.queue} start={player.start} csection={plan.csection} onClose={() => setPlayer(null)} />}

      <Card className="flex flex-col gap-1 py-3">
        <SwitchRow label="I had a caesarean" sub="Adds wound care tips to each exercise" on={plan.csection} onToggle={() => s.setBodyPlan({ ...plan, csection: !plan.csection })} />
        <div className="border-t border-neema-line" />
        <SwitchRow
          label="A health worker checked me and said I can do more"
          sub={plan.checked ? 'Stronger exercises are unlocked.' : 'Usually at your 6-week postnatal check. This unlocks the next stage.'}
          on={plan.checked}
          onToggle={() => s.setBodyPlan({ ...plan, checked: !plan.checked })}
        />
        {!plan.checked && <p className="flex items-center gap-1.5 pb-1 text-[13px] font-semibold leading-[18px] text-neema-muted-strong"><Lock className="h-3.5 w-3.5" /> Building strength unlocks after your check</p>}
        {plan.checked && <p className="flex items-center gap-1.5 pb-1 text-[13px] font-semibold leading-[18px] text-neema-success-ink"><Unlock className="h-3.5 w-3.5" /> {plan.csection ? 'After a caesarean, avoid heavy lifting until your health worker says it’s fine.' : 'Unlocked'}</p>}
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-3"><HeadIcon Icon={Hand} tone="bg-neema-primary-soft text-neema-dark" /><H2>Check for a tummy gap</H2></div>
        <p className="text-[15px] leading-[22px] text-neema-muted-strong">Your tummy muscles stretch apart in pregnancy. For most women the gap closes by itself. From 2 weeks after birth:</p>
        <div className="rounded-2xl bg-neema-cream px-3.5 py-3 text-[15px] leading-[22px]">
          <StepList steps={['Lie on your back with knees bent.', 'Place your fingertips just above your belly button, pointing down.', 'Lift your head a little, as if starting a sit-up, and feel how many fingers fit in the gap.']} />
        </div>
        <div role="radiogroup" aria-label="How many fingers fit in the gap?" className="grid grid-cols-2 gap-2">
          {([['small', 'Less than 2 fingers', 1], ['wide', '2 fingers or more', 3]] as const).map(([id, label, n]) => (
            <button key={id} type="button" role="radio" aria-checked={plan.gap === id} onClick={() => s.setBodyPlan({ ...plan, gap: plan.gap === id ? '' : id })}
              className={cn('neema-press flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-2 font-semibold transition-colors', plan.gap === id ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}>
              <span aria-hidden="true" className="flex items-end gap-1">
                {Array.from({ length: n }).map((_, k) => <span key={k} className={cn('h-6 w-3 rounded-full', plan.gap === id ? 'bg-neema-dark' : 'bg-[#C99A7A]')} />)}
              </span>
              {label}
            </button>
          ))}
        </div>
        {plan.gap === 'small' && <p className="neema-fade flex items-start gap-2.5 rounded-2xl bg-neema-success-soft px-3.5 py-2.5 text-[15px] leading-[22px]"><Check className="mt-0.5 h-5 w-5 flex-none text-neema-success-ink" aria-hidden="true" />That’s normal and usually closes with the exercises above.</p>}
        {plan.gap === 'wide' && (
          <p className="neema-fade rounded-2xl bg-neema-ochre-soft px-3.5 py-2.5 text-[15px] leading-[22px]">
            Keep doing belly breathing and pelvic tilts, and avoid sit-ups, crunches and heavy lifting for now. Show it to your health worker at your next visit: a physiotherapist can help if it doesn’t close.
          </p>
        )}
      </Card>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="neema-float block h-14 w-14 flex-none"><PlateArt className="h-full w-full" /></span>
          <H2>Food for a flatter tummy</H2>
        </div>
        <p className="text-[15px] leading-[22px]">No strict diet while breastfeeding: your body uses extra energy to make milk. Eat regular meals with leaves, beans, fish and fruit, drink a cup of water at every feed, and limit sugary drinks and fried snacks.</p>
        <button type="button" onClick={() => goTab('diet')} className="neema-press min-h-[48px] rounded-xl border border-neema-border font-semibold text-neema-dark">See the after-birth diet</button>
      </Card>

      <Fold title="Myths and facts">
        {TUMMY_MYTHS.map((m) => (
          <div key={m.myth} className="overflow-hidden rounded-2xl border border-neema-line">
            <div className="flex items-start gap-2.5 bg-neema-primary-soft/60 px-3.5 py-2.5">
              <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white text-neema-dark"><X className="h-3.5 w-3.5" strokeWidth={3} /></span>
              <div><div className="text-[13px] font-semibold uppercase leading-[18px] tracking-[0.04em] text-neema-muted-strong">Myth</div><div className="font-semibold">{m.myth}</div></div>
            </div>
            <div className="flex items-start gap-2.5 bg-white px-3.5 py-2.5">
              <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-neema-success-soft text-neema-success-ink"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              <div><div className="text-[13px] font-semibold uppercase leading-[18px] tracking-[0.04em] text-neema-success-ink">Fact</div><p className="text-[15px] leading-[22px]">{m.fact}</p></div>
            </div>
          </div>
        ))}
      </Fold>

      <StopCard />
    </>
  );
}

function StopCard() {
  const s = useNeema();
  return (
    <section className="flex flex-col gap-2.5 rounded-[24px] border-2 border-neema-primary-soft bg-white px-5 py-4">
      <div className="flex items-center gap-3"><HeadIcon Icon={AlertTriangle} tone="bg-neema-primary-soft text-neema-dark" /><H2>Stop and get checked if you notice</H2></div>
      <WarnList items={TUMMY_STOP} />
      <button type="button" onClick={() => s.openSymptom()} className="neema-press mt-1 min-h-[48px] rounded-xl bg-neema-dark font-semibold text-white">Check my symptoms</button>
    </section>
  );
}

function WarnList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-[15px] leading-[22px]">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5">
          <span aria-hidden="true" className="mt-[7px] h-2 w-2 flex-none rounded-full bg-neema-primary" />{t}
        </li>
      ))}
    </ul>
  );
}

function OtherActivity() {
  const s = useNeema();
  const speech = useSpeech();
  const preg = s.journey === 'preg';
  const moves = preg ? MOVES_PREG : MOVES_GENERAL;
  const [player, setPlayer] = useState<{ queue: Move[]; start: number } | null>(null);
  return (
    <>
      <Reveal as="section" i={0} className="flex flex-col rounded-[24px] bg-white px-5 pb-2 pt-4 shadow-neema-card">
        <div className="flex items-center gap-3"><HeadIcon Icon={Activity} tone="bg-neema-success-soft text-neema-success-ink" /><H2>{preg ? 'Safe activity in pregnancy' : 'Move every day'}</H2></div>
        <p className="mt-2 text-[15px] leading-[22px] text-neema-muted-strong">
          {preg
            ? 'Regular, gentle activity is safe for most pregnancies and doesn’t cause miscarriage. It can ease back pain and help you in labour. Aim for 150 minutes a week.'
            : 'Aim for 150 active minutes a week. Walking to the market, dancing and housework all count.'}
        </p>
        <RoutineButton moves={moves} onStart={(queue) => setPlayer({ queue, start: 0 })} />
        <ul className="mt-2 flex flex-col">{moves.map((m) => <MoveRow key={m.id} move={m} csection={false} speech={speech} onStart={() => setPlayer({ queue: [m], start: 0 })} />)}</ul>
      </Reveal>
      {player && <ExercisePlayer queue={player.queue} start={player.start} csection={false} onClose={() => setPlayer(null)} />}
      {preg && (
        <section className="flex flex-col gap-2.5 rounded-[24px] border-2 border-neema-primary-soft bg-white px-5 py-4">
          <div className="flex items-center gap-3"><HeadIcon Icon={AlertTriangle} tone="bg-neema-primary-soft text-neema-dark" /><H2>Stop and get checked if you notice</H2></div>
          <WarnList items={['Bleeding or fluid from the vagina', 'Pain in your belly or chest', 'Dizziness or a bad headache', 'Baby moving less than usual']} />
          <p className="text-[15px] leading-[22px] text-neema-muted-strong">If you have a complication such as bleeding or high blood pressure, ask your health worker before exercising. Avoid heavy lifting and overheating.</p>
          <button type="button" onClick={() => s.openSymptom()} className="neema-press mt-1 min-h-[48px] rounded-xl bg-neema-dark font-semibold text-white">Check my symptoms</button>
        </section>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Skin & stretch marks
// ---------------------------------------------------------------------------
const HELPER_ICON: Record<HelperIcon, (p: { className?: string }) => JSX.Element> = {
  drop: DropIcon, leaf: LeafIcon, shea: SheaIcon, cocoa: CocoaIcon, almond: AlmondIcon, coconut: CoconutIcon, tube: (p) => <TubeIcon {...p} />,
};

/** A grid of tappable ingredient tiles; the chosen one shows its details underneath. */
function HelperGrid({ items }: { items: typeof STRETCH_HELPERS }) {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = items.find((h) => h.name === picked);
  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-2 gap-2">
        {items.map((h, i) => {
          const Icon = HELPER_ICON[h.icon];
          const on = picked === h.name;
          return (
            <li key={h.name} className="neema-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <button type="button" aria-expanded={on} onClick={() => setPicked(on ? null : h.name)}
                className={cn('neema-press flex min-h-[112px] w-full flex-col items-start gap-1.5 rounded-2xl border-2 p-3 text-left transition-colors duration-300', on ? 'border-neema-primary bg-neema-primary-soft' : 'border-transparent bg-neema-cream')}>
                <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300', on && 'neema-sway scale-110')}><Icon className="h-9 w-9" /></span>
                <span className="font-semibold leading-5">{h.name}</span>
                <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{h.short}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {chosen && <p key={chosen.name} role="status" className="neema-fade rounded-2xl border-l-4 border-neema-primary bg-white px-3.5 py-3 text-[15px] leading-[22px] shadow-neema-card"><span className="font-semibold">{chosen.name}: </span>{chosen.what}</p>}
    </div>
  );
}

function IconTile({ Icon, title, sub, i = 0 }: { Icon: (p: { className?: string }) => JSX.Element; title: string; sub: string; i?: number }) {
  return (
    <div className="neema-rise flex flex-col items-center gap-1 rounded-2xl bg-neema-cream px-2 py-3 text-center" style={{ animationDelay: `${i * 80}ms` }}>
      <span className="neema-float block" style={{ animationDelay: `${i * 400}ms` }}><Icon className="h-11 w-11" /></span>
      <span className="text-[15px] font-semibold leading-5">{title}</span>
      <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{sub}</span>
    </div>
  );
}

const AVOID_TILES = [
  { name: 'Mercury', why: 'Harms kidneys and baby’s brain' },
  { name: 'Hydroquinone', why: 'Absorbed into your body' },
  { name: 'Strong steroids', why: 'Thin skin, more marks' },
  { name: 'Retinoids', why: 'Can harm a baby' },
];

function SkinSection({ go }: { go: (to: BodySection | 'diet') => void }) {
  const s = useNeema();
  const pp = s.journey === 'pp';
  const preg = s.journey === 'preg';
  const nursing = pp ? 'while breastfeeding' : 'in pregnancy';
  const now = STRETCH_HELPERS.filter((h) => h.when === 'now');
  const later = STRETCH_HELPERS.filter((h) => h.when === 'later');
  return (
    <>
      {/* 1. The honest answer, shown as a picture */}
      <Reveal as="section" i={0} className="flex flex-col gap-2 rounded-[24px] bg-white px-5 py-4 shadow-neema-card">
        <H2>{pp ? 'Can stretch marks be wiped away?' : 'Stretch marks fade with time'}</H2>
        <p className="text-lg font-semibold leading-6 text-neema-dark">{pp ? 'Not completely, but they fade a lot.' : 'Most of it depends on your genes.'}</p>
        <div className="neema-fade-steps rounded-2xl bg-neema-cream p-2"><FadeTimeline /></div>
        <p className="text-[15px] leading-[22px] text-neema-muted-strong">Over 6 to 12 months they become flatter, softer and closer to your skin colour.</p>
      </Reveal>

      {/* 2. Ingredients, as tiles */}
      <Reveal as="section" i={1} className="flex flex-col gap-3 rounded-[24px] bg-white px-5 py-4 shadow-neema-card">
        <div>
          <div className="flex items-center gap-3"><HeadIcon Icon={FlaskConical} tone="bg-neema-success-soft text-neema-success-ink" /><H2>Ingredients that help marks fade</H2></div>
          <p className="mt-1 text-[15px] leading-[22px] text-neema-muted-strong">Look for these names on any label. No brand needed. Safe {nursing}. Tap one to learn more.</p>
        </div>
        <HelperGrid items={now} />
        <div className="grid grid-cols-3 gap-2" aria-label="How to use them">
          {([['2×', 'a day', Clock], ['3+', 'months', CalendarDays], ['Massage', 'gently in', Hand]] as const).map(([big, small, Icon]) => (
            <div key={big} className="flex flex-col items-center gap-0.5 rounded-2xl bg-neema-ochre-soft px-1 py-2.5 text-neema-ochre-ink">
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-lg font-bold leading-6">{big}</span>
              <span className="text-[13px] font-semibold leading-[18px]">{small}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 3. Habits */}
      <Reveal as="section" i={2} className="flex flex-col gap-3 rounded-[24px] bg-white px-5 py-4 shadow-neema-card">
        <H2>Habits that help too</H2>
        <div className="grid grid-cols-3 gap-2">
          <IconTile i={0} Icon={HatIcon} title="Cover up" sub="Sun darkens marks" />
          <IconTile i={1} Icon={DropIcon} title="Drink water" sub={pp ? 'At every feed' : 'Through the day'} />
          <IconTile i={2} Icon={LeafIcon} title="Eat well" sub="Leaves, beans, fish" />
        </div>
      </Reveal>

      {/* 4. Later options */}
      {!preg && (
        <section className="flex flex-col gap-3 rounded-[24px] bg-white px-5 py-4 shadow-neema-card">
          <div className="flex items-center justify-between gap-2">
            <H2>{pp ? 'After breastfeeding' : 'Stronger options'}</H2>
            <span className="rounded-full bg-neema-lilac px-2.5 py-0.5 text-[13px] font-semibold text-neema-lilac-ink">Ask a doctor</span>
          </div>
          <HelperGrid items={later} />
          <p className="text-[15px] leading-[22px] text-neema-muted-strong">On dark skin, laser only with an experienced dermatologist: it can leave dark patches.</p>
        </section>
      )}

      {/* 5. Warning, as crossed-out products */}
      <section className="relative flex flex-col gap-3 overflow-hidden rounded-[24px] bg-neema-primary-soft px-5 py-4">
        <span aria-hidden="true" className="neema-drift absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/50" />
        <div className="relative flex items-center gap-3"><HeadIcon Icon={Ban} tone="bg-white text-neema-dark" /><H2>Don’t use lightening creams</H2></div>
        <ul className="relative grid grid-cols-2 gap-2">
          {AVOID_TILES.map((t, i) => (
            <li key={t.name} className="neema-rise flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm" style={{ animationDelay: `${i * 70}ms` }}>
              <TubeIcon crossed className="h-10 w-10 flex-none" />
              <span className="flex flex-col"><span className="text-[15px] font-semibold leading-5">{t.name}</span><span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{t.why}</span></span>
            </li>
          ))}
        </ul>
        <p className="relative text-[15px] leading-[22px]">Used them already? Stop now and tell your health worker. No harsh scrubs, lemon or bleach.</p>
        <button type="button" onClick={() => go('ingredients')} className="neema-press neema-shine relative flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-neema-dark font-semibold text-white"><Search className="h-5 w-5" /> Check a product’s ingredients</button>
      </section>

      {/* 6. Dark patches: where they show, as simple chips */}
      <section className="flex flex-col gap-3 rounded-[24px] bg-white px-5 py-4 shadow-neema-card">
        <H2>Dark patches are common</H2>
        <ul className="flex flex-wrap gap-2" aria-label="Where they usually show">
          {['Cheeks and forehead', 'Neck and underarms', 'Line down the belly'].map((t) => (
            <li key={t} className="rounded-full bg-neema-sand px-3.5 py-2 text-[15px] font-semibold leading-5">{t}</li>
          ))}
        </ul>
        <p className="rounded-xl bg-neema-success-soft px-3.5 py-2.5 text-[15px] font-medium leading-[22px] text-neema-success-ink">They usually fade in the months after birth. Even dark skin needs sun protection:</p>
        <div className="grid grid-cols-3 gap-2">
          <IconTile i={0} Icon={HatIcon} title="Hat" sub="Free" />
          <IconTile i={1} Icon={ShadeIcon} title="Shade" sub="Midday sun" />
          <IconTile i={2} Icon={SunscreenIcon} title="Mineral sunscreen" sub="Zinc or titanium" />
        </div>
      </section>

      {preg && (
        <section className="flex flex-col gap-2.5 rounded-[24px] border-2 border-neema-primary-soft bg-white px-5 py-4">
          <div className="flex items-center gap-3"><HeadIcon Icon={AlertTriangle} tone="bg-neema-primary-soft text-neema-dark" /><H2>When itching is a warning sign</H2></div>
          <p className="text-[15px] leading-[22px]">Severe itching on the palms and soles in late pregnancy can signal a liver problem. Get checked today.</p>
          <button type="button" onClick={() => s.openSymptom()} className="neema-press min-h-[48px] rounded-xl bg-neema-dark font-semibold text-white">Check my symptoms</button>
        </section>
      )}

      <GeneticsCard go={go} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Ingredient checker
// ---------------------------------------------------------------------------
const CLS_STYLE: Record<SafetyClass, string> = {
  avoid: 'bg-neema-primary-soft text-neema-dark',
  care: 'bg-neema-ochre-soft text-neema-ochre-ink',
  safe: 'bg-neema-success-soft text-neema-success-ink',
};
const CLS_LOOK: Record<SafetyClass, { Icon: LucideIcon; stripe: string }> = {
  avoid: { Icon: Ban, stripe: 'border-neema-dark' },
  care: { Icon: AlertTriangle, stripe: 'border-neema-ochre' },
  safe: { Icon: ShieldCheck, stripe: 'border-neema-success' },
};

function IngredientChecker() {
  const [q, setQ] = useState('');
  const results = checkIngredients(q);
  return (
    <>
      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-3"><HeadIcon Icon={ShieldCheck} tone="bg-neema-success-soft text-neema-success-ink" /><H2>Is it safe for me?</H2></div>
        <label htmlFor="ingredient-q" className="text-[15px] leading-[22px] text-neema-muted-strong">Type an ingredient, or copy the ingredient list from the label.</label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-neema-muted" />
          <textarea id="ingredient-q" rows={2} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. hydroquinone, shea butter"
            className="min-h-[56px] w-full resize-y rounded-2xl border-2 border-neema-border bg-white py-3 pl-11 pr-3.5 text-base transition-colors focus:border-neema-primary focus:outline-none" />
        </div>
        {!q && (
          <div className="flex flex-wrap gap-2">
            {QUICK_INGREDIENTS.map((name, i) => (
              <button key={name} type="button" onClick={() => setQ(name)} style={{ animationDelay: `${i * 40}ms` }} className="neema-press neema-rise min-h-[44px] rounded-full border border-neema-border bg-white px-3.5 text-[15px] font-semibold">{name}</button>
            ))}
          </div>
        )}
      </Card>

      {q.trim().length >= 3 && (
        <section aria-live="polite" className="flex flex-col gap-3">
          {results.length === 0 ? (
            <Card className="neema-fade flex flex-col gap-1">
              <span className="flex items-center gap-2 font-semibold"><Search className="h-5 w-5 text-neema-muted" aria-hidden="true" />Not in Neema’s list yet</span>
              <span className="text-[15px] leading-[22px] text-neema-muted-strong">Check the spelling, or show the product to a pharmacist or health worker before using it.</span>
            </Card>
          ) : results.map((r, i) => {
            const look = CLS_LOOK[r.cls];
            return (
            <article key={r.name} style={{ animationDelay: `${i * 70}ms` }} className={cn('neema-rise flex flex-col gap-1.5 rounded-2xl border-l-[6px] bg-white px-5 py-4 shadow-neema-card', look.stripe)}>
              <span className={cn('inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-[13px] font-bold leading-[18px]', CLS_STYLE[r.cls])}><look.Icon className="h-3.5 w-3.5" aria-hidden="true" />{SAFETY_LABEL[r.cls]}</span>
              <span className="text-lg font-semibold leading-6">{r.name}</span>
              <p className="text-[15px] leading-[22px]">{r.why}</p>
            </article>
            );
          })}
        </section>
      )}

      <p className="px-1 text-[13px] font-medium leading-[18px] text-neema-muted">
        For education only, for use in pregnancy and while breastfeeding. Neema’s list is reviewed by its clinical reviewer, but it can’t cover every product. Always consult a qualified health worker or pharmacist.
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
/** Tabs with icons and a sliding highlight. */
function SectionTabs({ value, onChange, options }: { value: BodySection; onChange: (id: BodySection) => void; options: { id: BodySection; label: string; Icon: LucideIcon }[] }) {
  const at = Math.max(0, options.findIndex((o) => o.id === value));
  return (
    <div role="tablist" aria-label="Section" className="relative grid grid-cols-3 gap-1 rounded-[16px] bg-neema-sand p-1">
      <span aria-hidden="true" className="absolute bottom-1 top-1 rounded-[12px] bg-white shadow-sm transition-transform duration-300 ease-out"
        style={{ width: 'calc((100% - 0.5rem - 0.5rem) / 3)', left: '0.25rem', transform: `translateX(calc(${at} * (100% + 0.25rem)))` }} />
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" role="tab" aria-selected={on} onClick={() => onChange(o.id)}
            className={cn('relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-[12px] px-1 text-sm font-semibold leading-[18px] transition-colors', on ? 'text-neema-dark' : 'text-neema-ink')}>
            <o.Icon aria-hidden="true" className={cn('h-[18px] w-[18px] transition-transform duration-300', on && 'scale-110')} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function BodySkinScreen({ pregnancy, goTab }: { pregnancy: PregnancyData } & Nav) {
  const s = useNeema();
  const pp = s.journey === 'pp';
  const go = (to: BodySection | 'diet') => (to === 'diet' ? goTab('diet') : s.setBodySection(to));
  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <Reveal className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-neema-primary-soft via-[#FBE3D6] to-neema-ochre-soft p-4 shadow-neema-card">
        <span aria-hidden="true" className="neema-drift absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/40" />
        <span aria-hidden="true" className="neema-drift-slow absolute -bottom-12 left-6 h-28 w-28 rounded-full bg-neema-primary/10" />
        <div className="relative flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <H1>{pp ? 'Your body after birth' : 'Healthy body & skin'}</H1>
            <p className="mt-1 text-neema-muted-strong">{pp ? 'Your tummy, stretch marks and skin: what’s normal, what helps, and what to avoid.' : 'Safe activity, skin changes and products you can trust.'}</p>
          </div>
          <span aria-hidden="true" className="neema-float block h-20 w-20 flex-none min-[380px]:h-24 min-[380px]:w-24">
            {pp ? <MotherBabyArt className="h-full w-full" /> : s.journey === 'preg' ? <PregnantArt className="h-full w-full" /> : <GlowArt className="h-full w-full" />}
          </span>
        </div>
      </Reveal>
      <SectionTabs value={s.bodySection} onChange={s.setBodySection}
        options={[{ id: 'activity', label: pp ? 'Tummy' : 'Activity', Icon: Activity }, { id: 'skin', label: 'Skin', Icon: Sparkles }, { id: 'ingredients', label: 'Ingredients', Icon: FlaskConical }]} />
      <div key={s.bodySection} className="neema-fade flex flex-col gap-4">
        {s.bodySection === 'activity' && (pp ? <AfterBirthActivity pregnancy={pregnancy} goTab={goTab} /> : <OtherActivity />)}
        {s.bodySection === 'skin' && <SkinSection go={go} />}
        {s.bodySection === 'ingredients' && <IngredientChecker />}
      </div>
    </div>
  );
}
