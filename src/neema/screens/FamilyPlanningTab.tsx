import { useState } from 'react';
import { Lock, MapPin, Leaf, Minus, Plus } from 'lucide-react';
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

function TryingToConceive() {
  const s = useNeema();
  const [showClinics, setShowClinics] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lmp = s.lastPeriod ? new Date(s.lastPeriod + 'T00:00:00') : new Date(today.getTime() - 12 * DAY);
  const dayDate = (n: number) => new Date(lmp.getTime() + (n - 1) * DAY);
  const cycleDay = Math.floor((today.getTime() - lmp.getTime()) / DAY) + 1;
  const ovu = s.cycleLen - 14;
  const fStart = ovu - 5;
  const fEnd = ovu + 1;
  const fertileText =
    cycleDay < fStart ? `Fertile window: ${fmt(dayDate(fStart))} – ${fmt(dayDate(fEnd))}`
      : cycleDay <= fEnd ? `You are in your fertile window (until ${fmt(dayDate(fEnd))})`
        : cycleDay <= s.cycleLen ? 'Fertile window has passed this cycle'
          : 'Your period may be due. Update the date when it starts.';
  const ttcDone = TTC_CHECK.filter((c) => s.ttc[c.id]).length;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <H2>My fertile window</H2>
          <span className="text-[13px] font-semibold leading-[18px] text-neema-muted-strong">Estimate</span>
        </div>
        <div className="rounded-xl bg-neema-primary-soft px-3.5 py-3">
          <div className="text-[13px] font-bold leading-[18px] tracking-[0.04em] text-neema-dark">CYCLE DAY {cycleDay} · TODAY</div>
          <div className="text-lg font-bold leading-[26px]">{fertileText}</div>
          <div className="text-[15px] leading-[22px]">Likely ovulation: about {fmt(dayDate(ovu))} (day {ovu})</div>
        </div>
        <div role="img" aria-label={`Cycle of ${s.cycleLen} days with a ${s.periodLen}-day period. Today is day ${cycleDay}. ${fertileText}`} className="grid grid-cols-7 gap-1">
          {Array.from({ length: s.cycleLen }, (_, i) => i + 1).map((n) => {
            const fertile = n >= fStart && n <= fEnd;
            const period = n <= s.periodLen;
            return (
              <div
                key={n}
                className={cn(
                  'flex h-9 items-center justify-center rounded-lg border-2 text-[13px] font-semibold',
                  fertile ? 'bg-neema-dark text-white' : period ? 'bg-[#F3D5CB]' : 'bg-neema-cream',
                  n === cycleDay ? 'border-neema-ink' : 'border-transparent',
                )}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 text-[13px] font-medium leading-[18px] text-neema-muted-strong">
          <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-[#F3D5CB]" />Period</span>
          <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-neema-dark" />Fertile window</span>
          <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded border-2 border-neema-ink" />Today</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="neema-lmp" className="font-semibold">First day of my last period</label>
          <input
            id="neema-lmp"
            type="date"
            max={isoDate(today)}
            value={s.lastPeriod || isoDate(lmp)}
            onChange={(e) => s.setLastPeriod(e.target.value)}
            className="h-[52px] rounded-xl border border-neema-border bg-white px-3.5 text-base"
          />
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
          <Segmented
            role="radiogroup"
            label="Cycle length"
            value={s.cycleLen}
            onChange={s.setCycleLen}
            options={[26, 28, 30, 32].map((n) => ({ id: n, label: `${n} days` }))}
          />
        </div>
        <p className="text-[15px] leading-[22px] text-neema-muted-strong">Calendar estimates are a guide for conceiving, not a contraceptive method.</p>
      </Card>

      <Card className="flex flex-col px-5 pb-5 pt-4">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <H2>Pre-conception checklist</H2>
          <span className="whitespace-nowrap text-[13px] font-semibold leading-[18px] text-neema-success-ink">{ttcDone} of {TTC_CHECK.length} done</span>
        </div>
        {TTC_CHECK.map((c) => (
          <button key={c.id} type="button" aria-pressed={!!s.ttc[c.id]} onClick={() => s.setTtc({ ...s.ttc, [c.id]: !s.ttc[c.id] })} className="flex min-h-[60px] w-full items-start gap-3 border-b border-neema-line py-2.5 text-left">
            <span className="mt-0.5"><CheckBox on={!!s.ttc[c.id]} /></span>
            <span className="flex flex-col"><span className="font-semibold">{c.label}</span><span className="text-[15px] leading-[21px] text-neema-muted">{c.sub}</span></span>
          </button>
        ))}
      </Card>

      <Card className="flex flex-col gap-2.5">
        <H2>Eating to conceive</H2>
        {TTC_FOODS.map((f) => (
          <div key={f.title} className="flex items-start gap-3">
            <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-neema-success-soft text-neema-success-ink"><Leaf className="h-5 w-5" /></span>
            <span className="flex flex-col"><span className="font-semibold">{f.title}</span><span className="text-[15px] leading-[22px]">{f.text}</span></span>
          </div>
        ))}
        <button type="button" onClick={() => s.setTab('diet')} className="min-h-[48px] rounded-xl border border-neema-border bg-white font-semibold">See local foods in Diet</button>
      </Card>

      <section className="flex flex-col gap-1.5 rounded-2xl bg-neema-lilac px-5 py-4">
        <H2>When to see a health worker together</H2>
        <p>If you are under 35 and haven’t conceived after 12 months of regular sex without contraception, or after 6 months if you are 35 or older. Fertility problems affect men as often as women, so go as a couple.</p>
        <button type="button" onClick={() => setShowClinics(!showClinics)} className="mt-1.5 min-h-[52px] rounded-xl bg-neema-ink font-semibold text-white">Find a fertility or family planning clinic</button>
        {showClinics && <Clinics />}
      </section>
      <Disclaimer />
    </div>
  );
}

function CompareMethods() {
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string[]>(['implant', 'inject']);
  const [cmpTab, setCmpTab] = useState<(typeof CMP_TABS)[number]['id']>('pros');
  const [showClinics, setShowClinics] = useState(false);
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

      <section className="rounded-2xl bg-white px-4 py-2 shadow-neema-card">
        {visible.map((m) => {
          const on = selected.includes(m.id);
          return (
            <button key={m.id} type="button" aria-pressed={on} onClick={() => toggle(m.id)} className={cn('flex min-h-[60px] w-full items-center gap-3 border-b border-neema-line py-1.5 text-left', !on && full && 'opacity-50')}>
              <CheckBox on={on} tone="terracotta" />
              <span className="flex flex-1 flex-col">
                <span className="font-semibold">{m.name}</span>
                <span className="text-[13px] font-medium leading-[18px] text-neema-muted">{m.eff} effective (typical use)</span>
              </span>
            </button>
          );
        })}
        {visible.length === 0 && <p className="my-3 text-neema-muted">No method matches all of those. Try removing a filter.</p>}
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
  const title = s.journey === 'ttc' ? 'Trying to conceive' : s.journey === 'avoid' ? 'Avoiding pregnancy' : 'Family planning';
  const banner =
    s.journey === 'preg'
      ? 'Plan ahead: many methods can start right after birth, even while breastfeeding. WHO advises waiting at least 24 months after a birth before the next pregnancy.'
      : s.journey === 'pp'
        ? 'Birth spacing: WHO advises waiting at least 24 months before your next pregnancy. Breastfeeding alone (LAM) protects only for 6 months and only if all its conditions are met.'
        : '';

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4">
      <div className="flex flex-col gap-2">
        <H1>{title}</H1>
        <button type="button" onClick={() => s.setTab('profile')} className="flex min-h-[44px] items-center gap-1.5 self-start rounded-full border border-[#E3C9BE] bg-white px-3.5 text-sm font-semibold">
          Journey: {journey.short} · <span className="text-neema-dark">Change</span>
        </button>
      </div>
      {banner && <div className="rounded-xl bg-neema-ochre-soft px-3.5 py-3 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">{banner}</div>}
      {s.journey === 'ttc' ? <TryingToConceive /> : <CompareMethods />}
    </div>
  );
}
