import { useEffect, useRef, useState } from 'react';
import { Lock, MapPin, Leaf, Minus, Plus, Clock, CalendarHeart, Check, ShieldCheck, Syringe, Anchor, Pill, Baby, CalendarDays, Undo2, Scissors, SlidersHorizontal, Sprout, Sparkle, Droplet, ListChecks, Stethoscope, ChevronDown } from 'lucide-react';
import { HScroll, ProgressRing, Reveal, Sheet } from '../motion';
import { CycleWheel, FoodArt, ShieldArt, SupportArt, TryingArt } from '../art';
import { MY_METHODS, cycleInfo, fmtShort, methodStatus, type MyMethodId } from '../cycle';
import { fmtDate } from '../format';
import { cn } from '@/lib/utils';
import { CMP_TABS, FP_FILTERS, JOURNEYS, METHODS, TTC_CHECK, TTC_FOODS } from '../data';
import { useNeema } from '../store';
import { Card, CheckBox, Disclaimer, H1, H2, PrimaryButton, Segmented } from '../ui';

const DAY = 86400000;
const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const isoDate = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function Clinics() {
  return (
    <div className="mt-1.5 flex flex-col gap-1.5">
      {/* TODO: replace with the facility directory (GPS distance, opening hours, services). */}
      <div className="rounded-[10px] bg-white px-3 py-2.5">
        <div className="font-semibold">Hôpital Gynéco-Obstétrique et Pédiatrique de Douala</div>
        <div className="text-[13px] font-medium leading-[18px] text-neema-muted">Yassa, Douala</div>
      </div>
      <div className="rounded-[10px] bg-white px-3 py-2.5">
        <div className="font-semibold">Hôpital Gynéco-Obstétrique et Pédiatrique de Yaoundé</div>
        <div className="text-[13px] font-medium leading-[18px] text-neema-muted">Ngousso, Yaoundé</div>
      </div>
      <div className="rounded-[10px] bg-white px-3 py-2.5">
        <div className="font-semibold">Hôpital Laquintinie · family planning unit</div>
        <div className="text-[13px] font-medium leading-[18px] text-neema-muted">Douala</div>
      </div>
    </div>
  );
}

/** Last period date, period length and cycle length: shared by "trying to conceive" and "avoiding pregnancy". */
function PeriodSettings() {
  const s = useNeema();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="neema-lmp" className="font-semibold">First day of my last period</label>
        <input id="neema-lmp" type="date" max={isoDate(new Date())} value={s.lastPeriod} onChange={(e) => s.setLastPeriod(e.target.value)}
          className="h-[52px] rounded-xl border border-neema-border bg-white px-3.5 text-base" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="flex flex-col">
          <span className="font-semibold">My period lasts</span>
          <span className="text-sm leading-5 text-neema-muted">Usually 2–8 days</span>
        </span>
        <div role="group" aria-label="Period length in days" className="flex items-center gap-1 rounded-[14px] bg-neema-cream p-1">
          <button type="button" aria-label="One day shorter" disabled={s.periodLen <= 2} onClick={() => s.setPeriodLen(s.periodLen - 1)} className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-white disabled:opacity-40">
            <Minus className="h-5 w-5" />
          </button>
          <span aria-live="polite" className="min-w-[64px] text-center font-bold">{s.periodLen} days</span>
          <button type="button" aria-label="One day longer" disabled={s.periodLen >= 10} onClick={() => s.setPeriodLen(s.periodLen + 1)} className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-white disabled:opacity-40">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div>
        <div className="mb-1.5 font-semibold">My usual cycle length</div>
        <Segmented role="radiogroup" label="Cycle length" value={s.cycleLen} onChange={s.setCycleLen}
          options={[26, 28, 30, 32].map((n) => ({ id: n, label: `${n} days` }))} />
      </div>
    </div>
  );
}

/** The method she uses now, with the date that drives her reminder. */
function MyMethodCard() {
  const s = useNeema();
  const st = methodStatus(s.method);
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <H2>My method</H2>
        <span className="flex items-center gap-1 text-[13px] font-semibold leading-[18px] text-neema-muted-strong"><Lock className="h-3.5 w-3.5" /> Private</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="my-method" className="font-semibold">What I use now</label>
        <select id="my-method" value={s.method.id} onChange={(e) => s.setMethod({ id: e.target.value as MyMethodId | '', start: '' })}
          className="h-[52px] rounded-xl border border-neema-border bg-white px-3 text-base">
          <option value="">Not using a method yet</option>
          {MY_METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      {st?.def.dateLabel && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="method-date" className="font-semibold">{st.def.dateLabel}</label>
          <input id="method-date" type="date" max={isoDate(new Date())} value={s.method.start} onChange={(e) => s.setMethod({ ...s.method, start: e.target.value })}
            className="h-[52px] rounded-xl border border-neema-border bg-white px-3.5 text-base" />
        </div>
      )}
      {st && (
        <div className="flex items-start gap-3 rounded-xl bg-neema-success-soft px-3.5 py-3 text-neema-ink">
          <Clock className="mt-0.5 h-5 w-5 flex-none text-neema-success-ink" />
          <div className="flex flex-col gap-0.5">
            {st.due && (
              <span className="font-semibold">
                {st.def.id.startsWith('inject') ? `Next injection by ${fmtDate(st.due)}` : `Replace or remove by ${fmtDate(st.due)}`}
              </span>
            )}
            <span className="text-[15px] leading-[22px]">{st.def.graceText ?? st.def.note}</span>
          </div>
        </div>
      )}
      {!st && <p className="text-[15px] leading-[22px] text-neema-muted-strong">Not sure yet? Compare methods below, then talk to a health worker.</p>}
    </Card>
  );
}

function EmergencyCard() {
  const [showClinics, setShowClinics] = useState(false);
  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-neema-primary-soft px-5 py-4">
      <H2>Had sex without protection, or a condom broke?</H2>
      <p>Emergency contraceptive pills from a pharmacy work best as soon as possible, and up to 5 days (120 hours) after. A copper IUD fitted at a clinic within 5 days is the most effective option and keeps protecting you after.</p>
      <p className="text-[15px] leading-[22px] text-neema-muted-strong">Emergency pills don’t end a pregnancy and are not for regular use. Consider an HIV and STI test too.</p>
      <button type="button" onClick={() => setShowClinics(!showClinics)} className="mt-1 min-h-[52px] rounded-xl bg-neema-dark font-semibold text-white">Find a family planning clinic</button>
      {showClinics && <Clinics />}
    </section>
  );
}

/** Optional period tracking while avoiding pregnancy. */
function PeriodTracking() {
  const s = useNeema();
  const [open, setOpen] = useState(!!s.lastPeriod);
  const c = cycleInfo(s.lastPeriod, s.cycleLen, s.periodLen);
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <H2>My period</H2>
        <span className="text-[13px] font-semibold leading-[18px] text-neema-muted-strong">Optional</span>
      </div>
      {c && (
        <div className="rounded-xl bg-neema-cream px-3.5 py-3">
          <div className="text-[13px] font-bold leading-[18px] tracking-[0.04em] text-neema-dark">CYCLE DAY {c.cycleDay} · ESTIMATE</div>
          <div className="text-lg font-bold leading-[26px]">{c.phase === 'late' ? 'Your period may be late' : `Next period around ${fmtShort(c.nextPeriod)}`}</div>
          {c.phase === 'late' && <div className="text-[15px] leading-[22px]">If it is more than a week late, take a pregnancy test.</div>}
        </div>
      )}
      {open ? <PeriodSettings /> : (
        <button type="button" onClick={() => setOpen(true)} className="min-h-[48px] rounded-xl border border-neema-border bg-white font-semibold">Track my period</button>
      )}
      <p className="text-[15px] leading-[22px] text-neema-muted-strong">Period dates help you notice changes. Counting days alone is not a reliable way to avoid pregnancy.</p>
    </Card>
  );
}

/** Period and cycle length only (the date is asked for separately on the My cycle page). */
function LengthSettings() {
  const s = useNeema();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex flex-col">
          <span className="font-semibold">My period lasts</span>
          <span className="text-sm leading-5 text-neema-muted">Usually 2–8 days</span>
        </span>
        <div role="group" aria-label="Period length in days" className="flex items-center gap-1 rounded-[14px] bg-white p-1 shadow-sm">
          <button type="button" aria-label="One day shorter" disabled={s.periodLen <= 2} onClick={() => s.setPeriodLen(s.periodLen - 1)} className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-neema-cream disabled:opacity-40"><Minus className="h-5 w-5" /></button>
          <span aria-live="polite" className="min-w-[64px] text-center font-bold">{s.periodLen} days</span>
          <button type="button" aria-label="One day longer" disabled={s.periodLen >= 10} onClick={() => s.setPeriodLen(s.periodLen + 1)} className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-neema-cream disabled:opacity-40"><Plus className="h-5 w-5" /></button>
        </div>
      </div>
      <div>
        <div className="mb-1.5 font-semibold">My usual cycle length</div>
        <Segmented role="radiogroup" label="Cycle length" value={s.cycleLen} onChange={s.setCycleLen} options={[26, 28, 30, 32].map((n) => ({ id: n, label: `${n} days` }))} />
      </div>
    </div>
  );
}

/** One checklist item: tick on the left, tap the name to read why it matters. */
function TtcItem({ id, label, sub }: { id: string; label: string; sub: string }) {
  const s = useNeema();
  const [open, setOpen] = useState(false);
  const on = !!s.ttc[id];
  return (
    <div className={cn('mt-1.5 flex flex-col rounded-2xl transition-colors', on ? 'bg-neema-success-soft' : 'bg-neema-cream')}>
      <div className="flex items-center gap-1">
        <button type="button" aria-pressed={on} aria-label={`Done: ${label}`} onClick={() => s.setTtc({ ...s.ttc, [id]: !on })} className="flex h-14 w-12 flex-none items-center justify-center">
          <CheckBox on={on} />
        </button>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-[56px] min-w-0 flex-1 items-center gap-2 py-2 pr-3 text-left">
          <span className={cn('flex-1 font-semibold leading-5', on && 'text-neema-success-ink')}>{label}</span>
          <ChevronDown aria-hidden="true" className={cn('h-5 w-5 flex-none text-neema-muted transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      {open && <p className="neema-fade px-3 pb-3 pl-12 text-[15px] leading-[21px] text-neema-muted-strong">{sub}</p>}
    </div>
  );
}

const TTC_FOOD_ART: Record<string, string> = { 'Folate-rich greens': 'leaf', 'Iron stores': 'beans', 'For him too': 'groundnut', 'Healthy weight': 'plantain' };

function TryingToConceive() {
  const s = useNeema();
  const [showClinics, setShowClinics] = useState(false);
  const [settings, setSettings] = useState(false);
  const [view, setView] = useState<'check' | 'food' | 'help'>('check');
  const todayRef = useRef<HTMLDivElement>(null);
  const c = cycleInfo(s.lastPeriod, s.cycleLen, s.periodLen);
  const ttcDone = TTC_CHECK.filter((x) => s.ttc[x.id]).length;
  const ovu = s.cycleLen - 14;
  const fStart = ovu - 5;
  const fEnd = ovu + 1;
  useEffect(() => { todayRef.current?.scrollIntoView?.({ inline: 'center', block: 'nearest' }); }, [s.lastPeriod, s.cycleLen]);

  const lmp = s.lastPeriod ? new Date(s.lastPeriod + 'T00:00:00') : null;
  const dayDate = (n: number) => new Date((lmp?.getTime() ?? 0) + (n - 1) * DAY);
  const fertileText = !c ? ''
    : c.cycleDay < fStart ? `Fertile window: ${fmt(c.fertileStart)} – ${fmt(c.fertileEnd)}`
      : c.cycleDay <= fEnd ? `You are in your fertile window (until ${fmt(c.fertileEnd)})`
        : c.cycleDay <= s.cycleLen ? 'Fertile window has passed this cycle'
          : 'Your period may be due. Update the date when it starts.';

  return (
    <div className="flex flex-col gap-4">
      {!c ? (
        <Reveal className="flex flex-col items-center gap-3 rounded-[28px] bg-white p-5 text-center shadow-neema-card">
          <span className="neema-float h-28 w-28"><TryingArt className="h-full w-full" /></span>
          <H2>When did your last period start?</H2>
          <p className="text-[15px] leading-[22px] text-neema-muted-strong">Neema uses it to estimate your fertile window and your next period. Nothing is shown until you add it.</p>
          <div className="flex w-full flex-col gap-1.5 text-left">
            <label htmlFor="neema-lmp" className="font-semibold">First day of my last period</label>
            <input id="neema-lmp" type="date" max={isoDate(new Date())} value={s.lastPeriod} onChange={(e) => s.setLastPeriod(e.target.value)}
              className="h-[56px] rounded-2xl border border-neema-border bg-white px-3.5 text-base" />
          </div>
          <button type="button" onClick={() => setSettings(true)} className="flex min-h-[48px] items-center gap-2 font-semibold text-neema-dark">
            <SlidersHorizontal className="h-5 w-5" /> Period {s.periodLen} days · cycle {s.cycleLen} days
          </button>
        </Reveal>
      ) : (
        <>
          {/* The cycle at a glance */}
          <Reveal>
            <section className="relative flex flex-col items-center gap-3 overflow-hidden rounded-[28px] bg-gradient-to-br from-neema-primary to-neema-dark px-5 pb-5 pt-4 text-white shadow-neema-hero">
              <div aria-hidden="true" className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />
              <div className="relative flex w-full items-center justify-between">
                <h2 className="text-lg font-semibold leading-6">My fertile window</h2>
                <button type="button" onClick={() => setSettings(true)} aria-label="Cycle settings" className="neema-press flex h-11 w-11 items-center justify-center rounded-full bg-white/15"><SlidersHorizontal className="h-5 w-5" /></button>
              </div>
              <span role="img" aria-label={`Cycle of ${s.cycleLen} days with a ${s.periodLen}-day period. Today is day ${c.cycleDay}. ${fertileText}`} className="relative">
                <CycleWheel cycleLen={s.cycleLen} periodLen={s.periodLen} day={c.cycleDay} ovulationDay={ovu} size={184}>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white/85">Cycle day</span>
                  <span className="text-5xl font-bold leading-[52px]">{c.cycleDay}</span>
                  <span className="text-[13px] font-semibold text-white/85">of {s.cycleLen}</span>
                </CycleWheel>
              </span>
              <div className="relative text-center">
                <div className="text-xl font-bold leading-7">{fertileText}</div>
                <div className="text-[15px] leading-[21px] text-white/85">Calendar estimates are a guide for conceiving, not a contraceptive method.</div>
              </div>
            </section>
          </Reveal>

          {/* The three dates that matter */}
          <Reveal i={1} className="grid grid-cols-3 gap-2">
            {[
              { Icon: Sprout, tint: 'bg-neema-success-soft text-neema-success-ink', label: 'Fertile window', value: c.fertileStart.getMonth() === c.fertileEnd.getMonth() ? `${c.fertileStart.getDate()}–${fmt(c.fertileEnd)}` : `${fmt(c.fertileStart)}–${fmt(c.fertileEnd)}` },
              { Icon: Sparkle, tint: 'bg-neema-ochre-soft text-neema-ochre-ink', label: 'Likely ovulation', value: `~${fmt(c.ovulation)}` },
              { Icon: Droplet, tint: 'bg-neema-primary-soft text-neema-dark', label: 'Next period', value: `~${fmt(c.nextPeriod)}` },
            ].map((t) => (
              <div key={t.label} className="flex flex-col gap-1.5 rounded-3xl bg-white p-3 shadow-neema-card">
                <span aria-hidden="true" className={cn('flex h-9 w-9 items-center justify-center rounded-xl', t.tint)}><t.Icon className="h-[18px] w-[18px]" /></span>
                <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{t.label}</span>
                <span className="text-[15px] font-bold leading-5">{t.value}</span>
              </div>
            ))}
          </Reveal>

          {/* Swipeable day strip instead of a grid */}
          <Reveal i={2} className="flex flex-col gap-2">
            <HScroll label="Days of this cycle" className="gap-2">
              {Array.from({ length: s.cycleLen }, (_, i) => i + 1).map((n) => {
                const fertile = n >= fStart && n <= fEnd;
                const period = n <= s.periodLen;
                const isToday = n === c.cycleDay;
                const d = dayDate(n);
                return (
                  <div key={n} ref={isToday ? todayRef : undefined} aria-current={isToday ? 'date' : undefined} className="flex-none">
                    <span className={cn('flex h-[68px] w-12 flex-none flex-col items-center justify-center gap-0.5 rounded-2xl border-2 text-center',
                      fertile ? 'border-transparent bg-neema-success text-white' : period ? 'border-transparent bg-[#F3D5CB] text-neema-dark' : 'border-transparent bg-white',
                      n === ovu && 'ring-2 ring-neema-ochre ring-offset-2 ring-offset-neema-cream',
                      isToday && 'border-neema-ink')}>
                      <span className="text-[13px] font-semibold leading-4 opacity-80">{d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</span>
                      <span className="text-lg font-bold leading-6">{d.getDate()}</span>
                      <span className="text-[13px] leading-4 opacity-75">{isToday ? 'today' : `d${n}`}</span>
                    </span>
                  </div>
                );
              })}
            </HScroll>
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-[13px] font-medium leading-[18px] text-neema-muted-strong">
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-[#F3D5CB]" />Period</span>
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-neema-success" />Fertile window</span>
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-full ring-2 ring-neema-ochre" />Ovulation</span>
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded border-2 border-neema-ink" />Today</span>
            </div>
            <button type="button" onClick={() => s.setLastPeriod('')} className="min-h-[44px] self-start px-1 text-[15px] font-semibold text-neema-dark">My period started: update the date</button>
          </Reveal>
        </>
      )}

      <Sheet open={settings} onClose={() => setSettings(false)} title="Cycle settings">
        <div className="flex flex-col gap-4 pb-2">
          {c && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="neema-lmp-edit" className="font-semibold">First day of my last period</label>
              <input id="neema-lmp-edit" type="date" max={isoDate(new Date())} value={s.lastPeriod} onChange={(e) => s.setLastPeriod(e.target.value)} className="h-[52px] rounded-2xl border border-neema-border bg-white px-3.5 text-base" />
            </div>
          )}
          <LengthSettings />
        </div>
      </Sheet>

      {/* Everything else, one section at a time */}
      <Reveal i={3}>
        <div role="tablist" aria-label="More for trying to conceive" className="grid grid-cols-3 gap-1 rounded-2xl bg-neema-sand p-1">
          {([['check', 'Checklist', ListChecks], ['food', 'Food', Leaf], ['help', 'Get help', Stethoscope]] as const).map(([id, label, Icon]) => (
            <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}
              className={cn('neema-press flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl text-[15px] font-semibold transition-colors', view === id ? 'bg-white text-neema-dark shadow-sm' : 'text-neema-muted-strong')}>
              <Icon className="h-[18px] w-[18px]" /> {label}
            </button>
          ))}
        </div>
      </Reveal>

      {view === 'check' && (
        <section key="check" className="neema-fade flex flex-col rounded-[28px] bg-white p-4 shadow-neema-card">
          <div className="mb-2 flex items-center gap-3">
            <ProgressRing value={ttcDone / TTC_CHECK.length} size={60} stroke={6} label={`${ttcDone} of ${TTC_CHECK.length} done`}>
              <span className="text-[15px] font-bold leading-5 text-neema-success-ink">{ttcDone}/{TTC_CHECK.length}</span>
            </ProgressRing>
            <div className="flex flex-col">
              <H2>Pre-conception checklist</H2>
              <span className="text-[15px] font-semibold leading-[21px] text-neema-success-ink">{ttcDone} of {TTC_CHECK.length} done</span>
            </div>
          </div>
          {TTC_CHECK.map((x) => <TtcItem key={x.id} id={x.id} label={x.label} sub={x.sub} />)}
        </section>
      )}

      {view === 'food' && (
        <section key="food" className="neema-fade flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-neema-card">
          <H2>Eating to conceive</H2>
          <div className="grid grid-cols-2 gap-2.5">
            {TTC_FOODS.map((f) => (
              <div key={f.title} className="flex flex-col gap-1.5 rounded-3xl bg-neema-cream p-3">
                <FoodArt name={TTC_FOOD_ART[f.title] ?? 'leaf'} className="h-12 w-12" />
                <span className="font-semibold leading-5">{f.title}</span>
                <span className="text-[15px] leading-[21px] text-neema-muted-strong">{f.text}</span>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => s.setTab('diet')} className="neema-press min-h-[52px] rounded-2xl border border-neema-border bg-white font-semibold">See local foods in Diet</button>
        </section>
      )}

      {view === 'help' && (
        <section key="help" className="neema-fade flex flex-col gap-3 rounded-[28px] bg-neema-lilac p-5">
          <div className="flex items-center gap-3">
            <span className="h-16 w-16 flex-none"><SupportArt className="h-full w-full" /></span>
            <H2>When to see a health worker together</H2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white p-3 text-center"><div className="text-2xl font-bold">12 months</div><div className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">of trying, if you are under 35</div></div>
            <div className="rounded-2xl bg-white p-3 text-center"><div className="text-2xl font-bold">6 months</div><div className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">if you are 35 or older</div></div>
          </div>
          <p className="text-[15px] leading-[22px]">If you are under 35 and haven’t conceived after 12 months of regular sex without contraception, or after 6 months if you are 35 or older. Fertility problems affect men as often as women, so go as a couple.</p>
          <button type="button" onClick={() => setShowClinics(!showClinics)} className="neema-press min-h-[52px] rounded-2xl bg-neema-ink font-semibold text-white">Find a fertility or family planning clinic</button>
          {showClinics && <Clinics />}
        </section>
      )}
      <Disclaimer />
    </div>
  );
}

/** Typical-use effectiveness as a number for the little bar ("Over 99%", "About 93%", "77–98%"). */
function effPercent(eff: string) {
  const nums = (eff.match(/\d+/g) ?? []).map(Number);
  return nums.length ? Math.min(...nums) : 50;
}

const METHOD_ICON: Record<string, typeof ShieldCheck> = {
  implant: Syringe, cuiud: Anchor, hiud: Anchor, inject: Syringe, coc: Pill, pop: Pill, mcondom: ShieldCheck, fcondom: ShieldCheck,
  lam: Baby, fam: CalendarDays, withdraw: Undo2, steril: Scissors,
};

function CompareMethods() {
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string[]>(['implant', 'inject']);
  const [cmpTab, setCmpTab] = useState<(typeof CMP_TABS)[number]['id']>('pros');
  const [showClinics, setShowClinics] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const active = FP_FILTERS.filter((f) => filters[f.id]);
  const visible = METHODS.filter((m) => active.every((f) => f.test(m)));
  const full = selected.length >= 3;
  const chosen = selected.map((id) => METHODS.find((m) => m.id === id)!).filter(Boolean);

  const toggle = (id: string) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : sel.length < 3 ? [...sel, id] : sel));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neema-muted-strong">Compare modern methods side by side. Pick up to 3.</p>
      <div className="flex items-center gap-2.5 rounded-xl bg-neema-lilac px-3 py-2.5 text-sm font-medium leading-5">
        <Lock className="h-5 w-5 flex-none" />
        <span>Private: your choices are never shared with your partner, and discreet mode covers them.</span>
      </div>
      <div>
        <div className="mb-2 text-[13px] font-semibold leading-[18px] text-neema-muted-strong">WHAT MATTERS TO YOU?</div>
        <div className="flex flex-wrap gap-2">
          {FP_FILTERS.map((f) => {
            const on = !!filters[f.id];
            return (
              <button key={f.id} type="button" aria-pressed={on} onClick={() => setFilters({ ...filters, [f.id]: !on })} className={cn('min-h-[44px] rounded-full border px-3.5 text-sm font-semibold', on ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="rounded-[24px] bg-white px-3 py-1.5 shadow-neema-card">
        {(showAll ? visible : visible.slice(0, 6)).map((m, i) => {
          const on = selected.includes(m.id);
          const Icon = METHOD_ICON[m.id] ?? ShieldCheck;
          const pct = effPercent(m.eff);
          return (
            <button key={m.id} type="button" aria-pressed={on} onClick={() => toggle(m.id)}
              className={cn('neema-press neema-rise flex min-h-[64px] w-full items-center gap-3 border-b border-neema-line py-2 text-left last:border-b-0', !on && full && 'opacity-50')}
              style={{ animationDelay: `${i * 40}ms` }}>
              <span aria-hidden="true" className={cn('flex h-11 w-11 flex-none items-center justify-center rounded-2xl transition-colors', on ? 'bg-neema-dark text-white' : 'bg-neema-cream text-neema-dark')}>
                {on ? <Check className="h-5 w-5" strokeWidth={3} /> : <Icon className="h-5 w-5" />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-semibold leading-5">{m.name}</span>
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-16 flex-none overflow-hidden rounded-full bg-neema-sand">
                    <span className="neema-bar-in block h-full rounded-full bg-neema-success" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="text-[13px] font-medium leading-[18px] text-neema-muted">{m.eff} effective (typical use)</span>
                </span>
              </span>
            </button>
          );
        })}
        {visible.length === 0 && <p className="my-3 px-1 text-neema-muted">No method matches all of those. Try removing a filter.</p>}
        {visible.length > 6 && (
          <button type="button" onClick={() => setShowAll(!showAll)} className="min-h-[48px] w-full font-semibold text-neema-dark">
            {showAll ? 'Show fewer' : `Show all ${visible.length} methods`}
          </button>
        )}
      </section>

      {chosen.length >= 2 ? (
        <Card className="flex flex-col gap-3 p-4">
          <H2>Side by side</H2>
          <div role="tablist" aria-label="Compare by" className="flex gap-1.5 overflow-x-auto">
            {CMP_TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={t.id === cmpTab} onClick={() => setCmpTab(t.id)} className={cn('min-h-[44px] flex-none rounded-[10px] px-3 text-sm font-semibold', t.id === cmpTab ? 'bg-neema-ink text-white' : 'bg-neema-cream')}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="-mx-4 overflow-x-auto px-4">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${chosen.length}, minmax(150px, 1fr))` }}>
              {chosen.map((m) => (
                <div key={m.id} className="flex flex-col gap-2 rounded-xl bg-neema-cream p-3">
                  <div className="font-bold leading-[22px]">{m.name}</div>
                  <div className="self-start rounded-full bg-neema-ochre-soft px-2 text-[13px] font-semibold leading-[18px] text-neema-ochre-ink">{m.eff}</div>
                  {cmpTab === 'bfText' && (
                    <div className={cn('self-start rounded-full px-2 text-[13px] font-semibold leading-[18px]', m.bf ? 'bg-neema-success-soft text-neema-success-ink' : 'bg-neema-ochre-soft text-neema-ochre-ink')}>
                      {m.bf ? 'Breastfeeding OK' : 'Check first'}
                    </div>
                  )}
                  <div className="text-[15px] leading-[22px]">{m[cmpTab]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 rounded-xl bg-neema-primary-soft px-3.5 py-3">
            <div className="font-semibold">Talk to a health worker before starting</div>
            <div className="text-[15px] leading-[22px]">They can check what suits your health and help you start safely. Only condoms protect against STIs and HIV.</div>
            <PrimaryButton onClick={() => setShowClinics(!showClinics)}><MapPin className="h-5 w-5" />FIND A FAMILY PLANNING CLINIC</PrimaryButton>
            {showClinics && <Clinics />}
          </div>
        </Card>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-neema-border p-4 text-center text-neema-muted-strong">
          Select 2 or 3 methods above to compare pros, cons, return to fertility and breastfeeding side by side.
        </p>
      )}
      <p className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">Content baseline: WHO Family Planning: A Global Handbook and Cameroon national guidelines. Effectiveness is approximate, with typical use.</p>
      <Disclaimer />
    </div>
  );
}

export function FamilyPlanningTab() {
  const s = useNeema();
  const journey = JOURNEYS.find((j) => j.id === s.journey)!;
  const title = s.journey === 'ttc' ? 'My cycle' : s.journey === 'avoid' ? 'My family planning' : s.journey === 'pp' ? 'Birth spacing' : 'Family planning';
  const banner =
    s.journey === 'preg'
      ? 'Plan ahead: many methods can start right after birth, even while breastfeeding. WHO advises waiting at least 24 months after a birth before the next pregnancy.'
      : s.journey === 'pp'
        ? 'Birth spacing: WHO advises waiting at least 24 months before your next pregnancy. Breastfeeding alone (LAM) protects only for 6 months and only if all its conditions are met.'
        : '';

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4 pb-8">
      <Reveal className="flex items-center justify-between gap-2">
        <H1>{title}</H1>
        <button type="button" onClick={() => s.setTab('profile')} className="neema-press flex min-h-[44px] flex-none items-center gap-1.5 rounded-full border border-[#E3C9BE] bg-white px-3.5 text-sm font-semibold">
          {journey.short} · <span className="text-neema-dark">Change</span>
        </button>
      </Reveal>
      {banner && (
        <Reveal i={1} className="flex items-start gap-3 rounded-[24px] bg-neema-ochre-soft p-3.5">
          <span className="h-14 w-14 flex-none"><ShieldArt className="h-full w-full" /></span>
          <p className="text-[15px] font-medium leading-[22px] text-neema-ochre-ink">{banner}</p>
        </Reveal>
      )}
      {s.journey === 'ttc' ? <TryingToConceive /> : s.journey === 'avoid' ? (
        <>
          <MyMethodCard />
          <EmergencyCard />
          <H2 className="mt-1">Compare methods</H2>
          <CompareMethods />
          <PeriodTracking />
        </>
      ) : <CompareMethods />}
    </div>
  );
}
