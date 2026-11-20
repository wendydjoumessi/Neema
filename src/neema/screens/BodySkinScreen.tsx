import { useState, type ReactNode } from 'react';
import { ChevronDown, Volume2, Square, AlertTriangle, Search, Ban, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PregnancyData } from '@/types/pregnancy';
import {
  CANT_CHANGE, CAN_CHANGE, STRETCH_HELPERS, MOVES_BUILD, MOVES_FULL, MOVES_GENERAL, MOVES_GENTLE, MOVES_PREG, QUICK_INGREDIENTS, SAFETY_LABEL,
  TUMMY_MYTHS, TUMMY_STOP, checkIngredients, type Move, type SafetyClass,
  type HelperIcon,
} from '../body';
import {
  AlmondIcon, CocoaIcon, CoconutIcon, DarkPatchMap, DnaIcon, DropIcon, FadeTimeline, HandHeartIcon, HatIcon, LeafIcon, ShadeIcon, SheaIcon,
  SunscreenIcon, TubeIcon,
} from '../illustrations';
import { daysBetween, todayIso } from '../cycle';
import { useNeema, type BodySection } from '../store';
import { Card, CheckBox, H1, H2, Segmented, SwitchRow } from '../ui';

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

function MoveRow({ move, csection, speech }: { move: Move; csection: boolean; speech: ReturnType<typeof useSpeech> }) {
  const s = useNeema();
  const [open, setOpen] = useState(false);
  const today = todayIso();
  const done = (s.moves[today] ?? []).includes(move.id);
  const toggle = () => {
    const list = s.moves[today] ?? [];
    s.setMoves({ [today]: done ? list.filter((x) => x !== move.id) : [...list, move.id] });
  };
  const steps = [...move.steps, ...(csection && move.csNote ? [move.csNote] : [])];
  return (
    <li className="border-b border-neema-line last:border-b-0">
      <div className="flex items-center gap-2 py-1.5">
        <button type="button" aria-label={`Done today: ${move.name}`} aria-pressed={done} onClick={toggle} className="-ml-2.5 flex h-12 w-12 flex-none items-center justify-center">
          <CheckBox on={done} />
        </button>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-[52px] min-w-0 flex-1 items-center gap-2 text-left">
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-semibold">{move.name}</span>
            <span className="text-[15px] leading-[21px] text-neema-muted">{move.dose}</span>
          </span>
          <ChevronDown aria-hidden="true" className={cn('h-5 w-5 flex-none text-neema-muted transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      {open && (
        <div className="mb-3 ml-10 flex flex-col gap-2 rounded-xl bg-neema-cream px-3.5 py-3 text-[15px] leading-[22px]">
          <ol className="flex list-decimal flex-col gap-1.5 pl-5">{steps.map((st) => <li key={st}>{st}</li>)}</ol>
          {speech.supported && (
            <button type="button" onClick={() => speech.speak(move.id, `${move.name}. ${move.dose}. ${steps.join(' ')}`, s.lang)}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-neema-border bg-white font-semibold text-neema-dark">
              {speech.speaking === move.id ? <><Square className="h-[18px] w-[18px]" /> Stop</> : <><Volume2 className="h-[18px] w-[18px]" /> Listen</>}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function Fold({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="flex flex-col py-4">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-[48px] items-center justify-between gap-2 text-left">
        <H2>{title}</H2>
        <ChevronDown aria-hidden="true" className={cn('h-5 w-5 flex-none text-neema-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-2 flex flex-col gap-2">{children}</div>}
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
  const womb = days === null ? null : Math.min(100, Math.round((days / 42) * 100));

  return (
    <>
      <section className="flex flex-col gap-2.5 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
        <H2>Your tummy right now</H2>
        {womb !== null && (
          <>
            <div className="flex items-baseline justify-between text-[15px]">
              <span className="font-semibold">Womb shrinking back</span>
              <span className="text-neema-muted-strong">{womb < 100 ? `about ${6 - Math.min(5, weeks ?? 0)} weeks to go` : 'back in your pelvis'}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-neema-sand" role="img" aria-label={`Womb recovery about ${womb} percent`}>
              <div className="h-full rounded-full bg-neema-success" style={{ width: `${womb}%` }} />
            </div>
          </>
        )}
        <p className="text-[15px] leading-[22px]">
          {days === null || days < 42
            ? 'Your womb takes about 6 weeks to shrink back. Breastfeeding helps it contract, which is why you may feel cramps while feeding. A rounded tummy in these weeks is normal.'
            : 'Your womb is back to its usual size. What remains is mostly stretched skin and muscle, and some stored fat. Most of it goes gradually over 6 to 12 months with good food and regular movement.'}
        </p>
        <p className="rounded-xl bg-neema-ochre-soft px-3.5 py-2.5 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">
          There’s no quick fix. Slow and steady is safest, and it protects your milk.
        </p>
      </section>

      <section className="flex flex-col rounded-2xl bg-white px-5 pb-2 pt-4 shadow-neema-card">
        <div className="flex items-baseline justify-between gap-2">
          <H2>{stage === 'gentle' ? 'Gentle start' : stage === 'build' ? 'Building strength' : 'Back to full activity'}</H2>
          <span className="whitespace-nowrap text-[13px] font-semibold leading-[18px] text-neema-muted-strong">{doneToday} of {moves.length} today</span>
        </div>
        <p className="mt-1 text-[15px] leading-[22px] text-neema-muted-strong">
          {stage === 'gentle'
            ? 'Safe from the first days. Tap an exercise for the steps.'
            : stage === 'build' ? 'Your health worker said you can be more active. Build up a little each week.' : 'Aim for 150 active minutes a week, the same as other adults.'}
        </p>
        <ul className="mt-1 flex flex-col">{moves.map((m) => <MoveRow key={m.id} move={m} csection={plan.csection} speech={speech} />)}</ul>
      </section>

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

      <Card className="flex flex-col gap-2.5">
        <H2>Check for a tummy gap</H2>
        <p className="text-[15px] leading-[22px] text-neema-muted-strong">Your tummy muscles stretch apart in pregnancy. For most women the gap closes by itself. From 2 weeks after birth:</p>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-[22px]">
          <li>Lie on your back with knees bent.</li>
          <li>Place your fingertips just above your belly button, pointing down.</li>
          <li>Lift your head a little, as if starting a sit-up, and feel how many fingers fit in the gap.</li>
        </ol>
        <div role="radiogroup" aria-label="How many fingers fit in the gap?" className="grid grid-cols-2 gap-2">
          {([['small', 'Less than 2 fingers'], ['wide', '2 fingers or more']] as const).map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={plan.gap === id} onClick={() => s.setBodyPlan({ ...plan, gap: plan.gap === id ? '' : id })}
              className={cn('min-h-[52px] rounded-xl border px-2 font-semibold', plan.gap === id ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}>
              {label}
            </button>
          ))}
        </div>
        {plan.gap === 'small' && <p className="rounded-xl bg-neema-success-soft px-3.5 py-2.5 text-[15px] leading-[22px]">That’s normal and usually closes with the exercises above.</p>}
        {plan.gap === 'wide' && (
          <p className="rounded-xl bg-neema-ochre-soft px-3.5 py-2.5 text-[15px] leading-[22px]">
            Keep doing belly breathing and pelvic tilts, and avoid sit-ups, crunches and heavy lifting for now. Show it to your health worker at your next visit: a physiotherapist can help if it doesn’t close.
          </p>
        )}
      </Card>

      <Card className="flex flex-col gap-2">
        <H2>Food for a flatter tummy</H2>
        <p className="text-[15px] leading-[22px]">No strict diet while breastfeeding: your body uses extra energy to make milk. Eat regular meals with leaves, beans, fish and fruit, drink a cup of water at every feed, and limit sugary drinks and fried snacks.</p>
        <button type="button" onClick={() => goTab('diet')} className="min-h-[48px] rounded-xl border border-neema-border font-semibold text-neema-dark">See the after-birth diet</button>
      </Card>

      <Fold title="Myths and facts">
        {TUMMY_MYTHS.map((m) => (
          <div key={m.myth} className="rounded-xl bg-neema-cream px-3.5 py-3">
            <div className="text-[13px] font-semibold uppercase leading-[18px] tracking-[0.04em] text-neema-muted-strong">Myth</div>
            <div className="font-semibold">{m.myth}</div>
            <div className="mt-1.5 text-[13px] font-semibold uppercase leading-[18px] tracking-[0.04em] text-neema-success-ink">Fact</div>
            <p className="text-[15px] leading-[22px]">{m.fact}</p>
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
    <section className="flex flex-col gap-2 rounded-2xl border border-neema-line bg-white px-5 py-4">
      <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-neema-dark" /><H2>Stop and get checked if you notice</H2></div>
      <ul className="flex flex-col gap-1 text-[15px] leading-[22px]">{TUMMY_STOP.map((t) => <li key={t}>• {t}</li>)}</ul>
      <button type="button" onClick={() => s.openSymptom()} className="mt-1 min-h-[48px] rounded-xl border border-neema-border font-semibold">Check my symptoms</button>
    </section>
  );
}

function OtherActivity() {
  const s = useNeema();
  const speech = useSpeech();
  const preg = s.journey === 'preg';
  const moves = preg ? MOVES_PREG : MOVES_GENERAL;
  return (
    <>
      <section className="flex flex-col rounded-2xl bg-white px-5 pb-2 pt-4 shadow-neema-card">
        <H2>{preg ? 'Safe activity in pregnancy' : 'Move every day'}</H2>
        <p className="mt-1 text-[15px] leading-[22px] text-neema-muted-strong">
          {preg
            ? 'Regular, gentle activity is safe for most pregnancies and doesn’t cause miscarriage. It can ease back pain and help you in labour. Aim for 150 minutes a week.'
            : 'Aim for 150 active minutes a week. Walking to the market, dancing and housework all count.'}
        </p>
        <ul className="mt-1 flex flex-col">{moves.map((m) => <MoveRow key={m.id} move={m} csection={false} speech={speech} />)}</ul>
      </section>
      {preg && (
        <section className="flex flex-col gap-2 rounded-2xl border border-neema-line bg-white px-5 py-4">
          <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-neema-dark" /><H2>Stop and get checked if you notice</H2></div>
          <ul className="flex flex-col gap-1 text-[15px] leading-[22px]">
            {['Bleeding or fluid from the vagina', 'Pain in your belly or chest', 'Dizziness or a bad headache', 'Baby moving less than usual'].map((t) => <li key={t}>• {t}</li>)}
          </ul>
          <p className="text-[15px] leading-[22px] text-neema-muted-strong">If you have a complication such as bleeding or high blood pressure, ask your health worker before exercising. Avoid heavy lifting and overheating.</p>
          <button type="button" onClick={() => s.openSymptom()} className="mt-1 min-h-[48px] rounded-xl border border-neema-border font-semibold">Check my symptoms</button>
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
        {items.map((h) => {
          const Icon = HELPER_ICON[h.icon];
          const on = picked === h.name;
          return (
            <li key={h.name}>
              <button type="button" aria-expanded={on} onClick={() => setPicked(on ? null : h.name)}
                className={cn('flex min-h-[112px] w-full flex-col items-start gap-1.5 rounded-2xl border-2 p-3 text-left transition-colors', on ? 'border-neema-primary bg-neema-primary-soft' : 'border-transparent bg-neema-cream')}>
                <Icon className="h-10 w-10" />
                <span className="font-semibold leading-5">{h.name}</span>
                <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{h.short}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {chosen && <p role="status" className="rounded-xl bg-white px-3.5 py-3 text-[15px] leading-[22px] shadow-sm"><span className="font-semibold">{chosen.name}: </span>{chosen.what}</p>}
    </div>
  );
}

function IconTile({ Icon, title, sub }: { Icon: (p: { className?: string }) => JSX.Element; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-neema-cream px-2 py-3 text-center">
      <Icon className="h-11 w-11" />
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
      <section className="flex flex-col gap-2 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
        <H2>{pp ? 'Can stretch marks be wiped away?' : 'Stretch marks fade with time'}</H2>
        <p className="text-lg font-semibold leading-6 text-neema-dark">{pp ? 'Not completely, but they fade a lot.' : 'Most of it depends on your genes.'}</p>
        <FadeTimeline />
        <p className="text-[15px] leading-[22px] text-neema-muted-strong">Over 6 to 12 months they become flatter, softer and closer to your skin colour.</p>
      </section>

      {/* 2. Ingredients, as tiles */}
      <section className="flex flex-col gap-3 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
        <div>
          <H2>Ingredients that help marks fade</H2>
          <p className="mt-1 text-[15px] leading-[22px] text-neema-muted-strong">Look for these names on any label. No brand needed. Safe {nursing}. Tap one to learn more.</p>
        </div>
        <HelperGrid items={now} />
        <div className="grid grid-cols-3 gap-2" aria-label="How to use them">
          {[['2×', 'a day'], ['3+', 'months'], ['Massage', 'gently in']].map(([big, small]) => (
            <div key={big} className="flex flex-col items-center rounded-xl bg-neema-ochre-soft px-1 py-2 text-neema-ochre-ink">
              <span className="text-lg font-bold leading-6">{big}</span>
              <span className="text-[13px] font-semibold leading-[18px]">{small}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Habits */}
      <section className="flex flex-col gap-3 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
        <H2>Habits that help too</H2>
        <div className="grid grid-cols-3 gap-2">
          <IconTile Icon={HatIcon} title="Cover up" sub="Sun darkens marks" />
          <IconTile Icon={DropIcon} title="Drink water" sub={pp ? 'At every feed' : 'Through the day'} />
          <IconTile Icon={LeafIcon} title="Eat well" sub="Leaves, beans, fish" />
        </div>
      </section>

      {/* 4. Later options */}
      {!preg && (
        <section className="flex flex-col gap-3 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
          <div className="flex items-center justify-between gap-2">
            <H2>{pp ? 'After breastfeeding' : 'Stronger options'}</H2>
            <span className="rounded-full bg-neema-lilac px-2.5 py-0.5 text-[13px] font-semibold text-neema-lilac-ink">Ask a doctor</span>
          </div>
          <HelperGrid items={later} />
          <p className="text-[15px] leading-[22px] text-neema-muted-strong">On dark skin, laser only with an experienced dermatologist: it can leave dark patches.</p>
        </section>
      )}

      {/* 5. Warning, as crossed-out products */}
      <section className="flex flex-col gap-3 rounded-2xl bg-neema-primary-soft px-5 py-4">
        <div className="flex items-center gap-2"><Ban className="h-5 w-5 flex-none text-neema-dark" /><H2>Don’t use lightening creams</H2></div>
        <ul className="grid grid-cols-2 gap-2">
          {AVOID_TILES.map((t) => (
            <li key={t.name} className="flex items-center gap-2 rounded-xl bg-white p-2.5">
              <TubeIcon crossed className="h-10 w-10 flex-none" />
              <span className="flex flex-col"><span className="text-[15px] font-semibold leading-5">{t.name}</span><span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{t.why}</span></span>
            </li>
          ))}
        </ul>
        <p className="text-[15px] leading-[22px]">Used them already? Stop now and tell your health worker. No harsh scrubs, lemon or bleach.</p>
        <button type="button" onClick={() => go('ingredients')} className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-neema-dark font-semibold text-white"><Search className="h-5 w-5" /> Check a product’s ingredients</button>
      </section>

      {/* 6. Dark patches, with a body map */}
      <section className="flex flex-col gap-3 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
        <H2>Dark patches are common</H2>
        <div className="flex items-center gap-4">
          <div className="w-[104px] flex-none"><DarkPatchMap /></div>
          <ol className="flex flex-col gap-2.5 text-[15px] leading-[21px]">
            {[['Face', 'cheeks and forehead'], ['Neck', 'and underarms'], ['Belly line', 'from navel down']].map(([t, sub], i) => (
              <li key={t} className="flex items-start gap-2">
                <span aria-hidden="true" className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-neema-primary text-[13px] font-bold text-white">{i + 1}</span>
                <span><span className="font-semibold">{t}</span> <span className="text-neema-muted-strong">{sub}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <p className="rounded-xl bg-neema-success-soft px-3.5 py-2.5 text-[15px] font-medium leading-[22px] text-neema-success-ink">They usually fade in the months after birth. Even dark skin needs sun protection:</p>
        <div className="grid grid-cols-3 gap-2">
          <IconTile Icon={HatIcon} title="Hat" sub="Free" />
          <IconTile Icon={ShadeIcon} title="Shade" sub="Midday sun" />
          <IconTile Icon={SunscreenIcon} title="Mineral sunscreen" sub="Zinc or titanium" />
        </div>
      </section>

      {preg && (
        <section className="flex flex-col gap-2 rounded-2xl border border-neema-line bg-white px-5 py-4">
          <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-neema-dark" /><H2>When itching is a warning sign</H2></div>
          <p className="text-[15px] leading-[22px]">Severe itching on the palms and soles in late pregnancy can signal a liver problem. Get checked today.</p>
          <button type="button" onClick={() => s.openSymptom()} className="min-h-[48px] rounded-xl border border-neema-border font-semibold">Check my symptoms</button>
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

function IngredientChecker() {
  const [q, setQ] = useState('');
  const results = checkIngredients(q);
  return (
    <>
      <Card className="flex flex-col gap-3">
        <H2>Is it safe for me?</H2>
        <label htmlFor="ingredient-q" className="text-[15px] leading-[22px] text-neema-muted-strong">Type an ingredient, or copy the ingredient list from the label.</label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-neema-muted" />
          <textarea id="ingredient-q" rows={2} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. hydroquinone, shea butter"
            className="min-h-[56px] w-full resize-y rounded-xl border border-neema-border bg-white py-3 pl-11 pr-3.5 text-base" />
        </div>
        {!q && (
          <div className="flex flex-wrap gap-2">
            {QUICK_INGREDIENTS.map((name) => (
              <button key={name} type="button" onClick={() => setQ(name)} className="min-h-[44px] rounded-full border border-neema-border bg-white px-3.5 text-[15px] font-semibold">{name}</button>
            ))}
          </div>
        )}
      </Card>

      {q.trim().length >= 3 && (
        <section aria-live="polite" className="flex flex-col gap-3">
          {results.length === 0 ? (
            <Card className="flex flex-col gap-1">
              <span className="font-semibold">Not in Neema’s list yet</span>
              <span className="text-[15px] leading-[22px] text-neema-muted-strong">Check the spelling, or show the product to a pharmacist or health worker before using it.</span>
            </Card>
          ) : results.map((r) => (
            <article key={r.name} className="flex flex-col gap-1.5 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
              <span className={cn('self-start rounded-full px-2.5 py-0.5 text-[13px] font-bold leading-[18px]', CLS_STYLE[r.cls])}>{SAFETY_LABEL[r.cls]}</span>
              <span className="text-lg font-semibold leading-6">{r.name}</span>
              <p className="text-[15px] leading-[22px]">{r.why}</p>
            </article>
          ))}
        </section>
      )}

      <p className="px-1 text-[13px] font-medium leading-[18px] text-neema-muted">
        For education only, for use in pregnancy and while breastfeeding. Neema’s list is reviewed by its clinical reviewer, but it can’t cover every product. Always consult a qualified health worker or pharmacist.
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
export function BodySkinScreen({ pregnancy, goTab }: { pregnancy: PregnancyData } & Nav) {
  const s = useNeema();
  const pp = s.journey === 'pp';
  const go = (to: BodySection | 'diet') => (to === 'diet' ? goTab('diet') : s.setBodySection(to));
  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <div>
        <H1>{pp ? 'Your body after birth' : 'Healthy body & skin'}</H1>
        <p className="mt-1 text-neema-muted-strong">{pp ? 'Your tummy, stretch marks and skin: what’s normal, what helps, and what to avoid.' : 'Safe activity, skin changes and products you can trust.'}</p>
      </div>
      <Segmented label="Section" value={s.bodySection} onChange={s.setBodySection}
        options={[{ id: 'activity', label: pp ? 'Tummy' : 'Activity' }, { id: 'skin', label: 'Skin' }, { id: 'ingredients', label: 'Ingredients' }]} />
      {s.bodySection === 'activity' && (pp ? <AfterBirthActivity pregnancy={pregnancy} goTab={goTab} /> : <OtherActivity />)}
      {s.bodySection === 'skin' && <SkinSection go={go} />}
      {s.bodySection === 'ingredients' && <IngredientChecker />}
    </div>
  );
}
