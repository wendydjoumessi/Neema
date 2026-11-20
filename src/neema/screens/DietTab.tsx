import { useState } from 'react';
import { Check, X, Search, ArrowRight, Droplet, Sun, Leaf } from 'lucide-react';
import { AVOID, AVOID_EVERYDAY, FOODS, IRON, STAGES, SWAPS, waterTarget } from '../data';
import { useNeema } from '../store';
import { Card, CheckBox, H1, H2, Pill, Segmented } from '../ui';

type StageId = keyof typeof STAGES;
const PREG_STAGES: StageId[] = ['t1', 't2', 't3', 'pp'];
const RING = 2 * Math.PI * 26;

function Ring({ value, color, label }: { value: number; color: string; label: string }) {
  const p = Math.max(0, Math.min(1, value));
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" role="img" aria-label={label}>
      <circle cx="32" cy="32" r="26" fill="none" stroke="#EFE9E0" strokeWidth="8" />
      <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${RING * p} ${RING}`} transform="rotate(-90 32 32)" />
    </svg>
  );
}

export function DietTab({ trimester }: { trimester: 1 | 2 | 3 }) {
  const s = useNeema();
  const pregnancyStages = s.journey === 'preg' || s.journey === 'pp';
  const current: StageId = s.journey === 'pp' ? 'pp' : s.journey === 'ttc' ? 'ttc' : s.journey === 'avoid' ? 'every' : (`t${trimester}` as StageId);
  const WATER_TARGET = waterTarget(s.journey);
  const ironLabels = IRON.map((l, i) => (i > 0 ? l : s.journey === 'ttc' ? 'Folic acid tablet' : s.journey === 'avoid' ? 'Iron-rich breakfast (beans, eggs)' : l));
  const avoidList = s.journey === 'avoid' ? AVOID_EVERYDAY : AVOID;
  const title = s.journey === 'ttc' ? 'Eating to conceive' : s.journey === 'avoid' ? 'Healthy eating' : 'Diet for each stage';
  const [stageId, setStageId] = useState<StageId>(current);
  const [query, setQuery] = useState('');
  const st = STAGES[stageId];
  const q = query.trim().toLowerCase();
  const swaps = SWAPS.filter((w) => !q || `${w.from} ${w.to}`.toLowerCase().includes(q));
  const ironCount = IRON.filter((_, i) => s.iron[i]).length;

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4">
      <div>
        <H1>{title}</H1>
        <p className="mt-1 text-neema-muted-strong">{pregnancyStages ? 'Local foods for each stage, with a focus on iron and folate.' : 'Local foods that keep your iron and folate up.'}</p>
      </div>

      {pregnancyStages && (
        <Segmented
          label="Stage"
          value={stageId}
          onChange={setStageId}
          options={PREG_STAGES.map((k) => ({ id: k, label: STAGES[k].short }))}
        />
      )}

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <H2>{st.label} · {st.weeks}</H2>
          {stageId === current && <Pill className="whitespace-nowrap bg-neema-primary-soft text-neema-dark">Your stage</Pill>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {st.nutrients.map((n) => <Pill key={n} className="bg-neema-ochre-soft px-3 py-1 text-neema-ochre-ink">{n}</Pill>)}
        </div>
        <div className="rounded-xl bg-neema-cream px-3.5 py-3">
          <div className="text-[13px] font-semibold leading-[18px] text-neema-muted-strong">{pregnancyStages ? 'MORE NUTRIENTS, NOT DOUBLE FOOD' : 'WHAT MATTERS MOST'}</div>
          <div>{st.extra}</div>
        </div>
        <div>
          <div className="mb-1.5 text-[13px] font-semibold leading-[18px] text-neema-muted">SIMPLE MEAL IDEAS</div>
          {st.meals.map((m) => (
            <div key={m} className="flex items-start gap-2.5 py-1"><Check className="mt-0.5 h-5 w-5 flex-none text-neema-success" strokeWidth={2.5} /><span>{m}</span></div>
          ))}
        </div>
        <div className="border-t border-neema-line pt-3"><span className="font-semibold">Common problem · </span>{st.problem}</div>
      </Card>

      <H2 className="mt-1">Iron and folate first: local foods</H2>
      <div className="grid grid-cols-2 gap-3">
        {FOODS.map((f) => (
          <article key={f.name} className="flex flex-col gap-1.5 rounded-2xl bg-white p-3 shadow-neema-card">
            <span aria-hidden="true" className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-neema-success-soft text-neema-success-ink"><Leaf className="h-5 w-5" /></span>
            <div className="font-semibold leading-[22px]">{f.name}</div>
            <div className="text-[13px] font-medium leading-[18px] text-neema-muted">{f.local}</div>
            <div className="flex flex-wrap gap-1">
              {f.tags.map((tag) => <span key={tag} className="rounded-full bg-neema-success-soft px-2 text-[13px] font-semibold leading-[20px] text-neema-success-ink">{tag}</span>)}
            </div>
            <div className="text-[15px] leading-[21px]">{f.benefit}</div>
          </article>
        ))}
      </div>
      <p className="text-neema-muted-strong">Eat leaves with orange, pineapple or tomato. {s.journey === 'preg' ? 'Food supports, but never replaces, the iron and folic acid tablets from your antenatal visit.' : s.journey === 'ttc' ? 'Food supports, but doesn’t replace, a daily folic acid tablet.' : 'Vitamin C helps your body take in the iron.'}</p>

      <Card className="flex flex-col gap-3">
        <H2>Local market swaps</H2>
        <div className="flex h-[52px] items-center gap-2 rounded-xl border border-neema-border px-3">
          <Search className="h-5 w-5 text-neema-muted" />
          <label htmlFor="neema-swap" className="sr-only">Search an ingredient to swap</label>
          <input id="neema-swap" type="text" placeholder="Search e.g. quinoa, salmon, kale" value={query} onChange={(e) => setQuery(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-base outline-none" />
        </div>
        {swaps.map((w) => (
          <div key={w.from} className="flex flex-col gap-1 border-b border-neema-line py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neema-muted line-through">{w.from}</span>
              <ArrowRight className="h-[18px] w-[18px] text-neema-primary" />
              <span className="font-semibold">{w.to}</span>
            </div>
            <div className="text-[15px] leading-[21px] text-neema-muted">{w.why}</div>
          </div>
        ))}
        {swaps.length === 0 && <p className="text-neema-muted">No local swap listed yet for that ingredient. Ask Neema or try another word.</p>}
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <H2>My daily habits</H2>
          <Pill className="bg-neema-ochre-soft text-neema-ochre-ink">4 green days</Pill>
        </div>
        {/* TODO: fetch today's temperature for the user's city and raise the water target on hot days. */}
        <div className="flex items-center gap-2.5 rounded-xl bg-neema-ochre-soft px-3 py-2.5 text-sm font-medium leading-5 text-neema-ochre-ink">
          <Sun className="h-[22px] w-[22px] flex-none" />
          <span>Hot, humid day: water target raised to about {(WATER_TARGET * 0.25).toFixed(1).replace('.0', '')} L.</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <Ring value={s.water / WATER_TARGET} color="#3A7CA5" label={`${s.water} of ${WATER_TARGET} cups of water`} />
            <div className="font-bold">{s.water}/{WATER_TARGET}</div>
            <div className="text-[13px] font-medium leading-[18px] text-neema-muted">cups of water</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Ring value={ironCount / IRON.length} color="#2B9348" label={`${ironCount} of ${IRON.length} iron habits done`} />
            <div className="font-bold">{ironCount}/{IRON.length}</div>
            <div className="text-[13px] font-medium leading-[18px] text-neema-muted">iron habits</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Ring value={s.activeWeek / 150} color="#E09F3E" label={`${s.activeWeek} of 150 active minutes this week`} />
            <div className="font-bold">{s.activeWeek}/150</div>
            <div className="text-[13px] font-medium leading-[18px] text-neema-muted">active min this week</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => s.setWater(Math.min(s.water + 1, 20))} className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-neema-dark font-semibold tracking-wide text-white active:scale-[0.98]">
            <Droplet className="h-5 w-5" /> +1 CUP
          </button>
          <button type="button" onClick={() => s.setWater(Math.max(s.water - 1, 0))} className="min-h-[56px] min-w-[72px] rounded-xl border border-neema-border bg-white font-semibold">Undo</button>
        </div>
        <div>
          <div className="mb-1 text-[13px] font-semibold leading-[18px] text-neema-muted">TODAY’S IRON HABITS</div>
          {ironLabels.map((label, i) => (
            <button key={label} type="button" aria-pressed={!!s.iron[i]} onClick={() => s.setIron({ ...s.iron, [i]: !s.iron[i] })} className="flex min-h-[52px] w-full items-center gap-3 border-b border-neema-line text-left">
              <CheckBox on={!!s.iron[i]} /> {label}
            </button>
          ))}
        </div>
        <div>
          <div className="mb-2 text-[13px] font-semibold leading-[18px] text-neema-muted">LOG EVERYDAY ACTIVITY</div>
          <div className="flex flex-wrap gap-2">
            {[['+15 min walk to market', 15], ['+10 min housework', 10], ['+20 min dancing at church', 20]].map(([label, n]) => (
              <button key={label} type="button" onClick={() => s.setActiveWeek(s.activeWeek + (n as number))} className="min-h-[48px] rounded-full border border-neema-border bg-white px-3.5 text-[15px] font-medium">{label}</button>
            ))}
          </div>
        </div>
        <p className="text-neema-muted">Very tired, breathless, or pale inside your eyelids? Check a symptom and ask for a haemoglobin test. Neema does not diagnose anaemia.</p>
        <button type="button" onClick={() => s.openSymptom()} className="min-h-[48px] rounded-xl border border-neema-border bg-white font-semibold text-neema-dark">Check a symptom</button>
      </Card>

      <Card className="flex flex-col gap-2">
        <H2 className="mb-1">Avoid or limit</H2>
        {avoidList.map((a) => (
          <div key={a.what} className="flex items-start gap-2.5"><X className="mt-0.5 h-5 w-5 flex-none text-neema-dark" strokeWidth={2.5} /><span><span className="font-semibold">{a.what}</span> — {a.why}</span></div>
        ))}
        <div className="mt-1 text-[13px] font-medium leading-[18px] text-neema-muted">{s.journey === 'avoid' ? 'Based on WHO healthy diet guidance.' : 'Based on WHO African-region antenatal guidance.'} Reviewed by Neema’s clinical reviewer.</div>
      </Card>
    </div>
  );
}
