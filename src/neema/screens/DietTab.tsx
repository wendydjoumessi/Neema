import { useState } from 'react';
import { Check, X, Search, ArrowRight, Droplet, Sun, Leaf, ChevronRight, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HScroll, ProgressRing, Reveal, Sheet } from '../motion';
import { FoodArt, PlateArt, WaterDrops } from '../art';
import { AVOID, AVOID_EVERYDAY, FOODS, IRON, STAGES, SWAPS, waterTarget } from '../data';
import { useNeema } from '../store';
import { CheckBox, H1, H2, Pill, Segmented } from '../ui';

type StageId = keyof typeof STAGES;
const PREG_STAGES: StageId[] = ['t1', 't2', 't3', 'pp'];
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

  const [food, setFood] = useState<(typeof FOODS)[number] | null>(null);
  const [problemOpen, setProblemOpen] = useState(false);
  const [allSwaps, setAllSwaps] = useState(false);
  const shownSwaps = q || allSwaps ? swaps : swaps.slice(0, 3);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4 pb-8">
      <Reveal>
        <H1>{title}</H1>
        <p className="mt-1 text-[15px] leading-[21px] text-neema-muted-strong">{pregnancyStages ? 'Local foods for each stage, with a focus on iron and folate.' : 'Local foods that keep your iron and folate up.'}</p>
      </Reveal>

      <Reveal i={1}>
        <div role="tablist" aria-label="Diet view" className="grid grid-cols-2 gap-1 rounded-2xl bg-neema-sand p-1">
          {([['food', 'What to eat', Leaf], ['day', 'My day', Droplet]] as const).map(([id, label, Icon]) => (
            <button key={id} type="button" role="tab" aria-selected={s.dietView === id} onClick={() => s.setDietView(id)}
              className={cn('neema-press flex min-h-[48px] items-center justify-center gap-2 rounded-xl font-semibold transition-colors', s.dietView === id ? 'bg-white text-neema-dark shadow-sm' : 'text-neema-muted-strong')}>
              <Icon className="h-5 w-5" /> {label}
            </button>
          ))}
        </div>
      </Reveal>

      {s.dietView === 'food' && pregnancyStages && (
        <Reveal i={2}>
          <Segmented label="Stage" value={stageId} onChange={setStageId} options={PREG_STAGES.map((k) => ({ id: k, label: STAGES[k].short }))} />
        </Reveal>
      )}

      {s.dietView === 'food' && (<>
      {/* Stage at a glance */}
      <Reveal i={3}>
        <section key={stageId} className="neema-fade flex flex-col gap-3 overflow-hidden rounded-[28px] bg-white p-4 shadow-neema-card">
          <div className="flex items-start gap-3">
            <span className="h-16 w-16 flex-none"><PlateArt className="h-full w-full" /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <H2>{st.label} · {st.weeks}</H2>
                {stageId === current && <Pill className="whitespace-nowrap bg-neema-primary-soft text-neema-dark">Your stage</Pill>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {st.nutrients.map((n) => <Pill key={n} className="bg-neema-ochre-soft px-3 py-1 text-neema-ochre-ink">{n}</Pill>)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-neema-cream px-3.5 py-3">
            <div className="text-[13px] font-semibold leading-[18px] text-neema-muted-strong">{pregnancyStages ? 'MORE NUTRIENTS, NOT DOUBLE FOOD' : 'WHAT MATTERS MOST'}</div>
            <div className="text-[15px] leading-[22px]">{st.extra}</div>
          </div>
          <div>
            <div className="mb-1.5 text-[13px] font-semibold leading-[18px] text-neema-muted">SIMPLE MEAL IDEAS</div>
            <HScroll>
              {st.meals.map((m) => (
                <span key={m} className="flex w-[180px] flex-none items-start gap-2 rounded-2xl bg-neema-success-soft px-3 py-2.5 text-[15px] leading-[21px]">
                  <Check className="mt-0.5 h-[18px] w-[18px] flex-none text-neema-success" strokeWidth={2.5} />{m}
                </span>
              ))}
            </HScroll>
          </div>
          <button type="button" onClick={() => setProblemOpen(true)} className="neema-press flex min-h-[52px] items-center justify-between gap-2 rounded-2xl border border-neema-line px-3.5 text-left">
            <span><span className="font-semibold">Common problem · </span><span className="text-neema-muted-strong">{st.problem.split(':')[0]}</span></span>
            <ChevronRight className="h-5 w-5 flex-none text-neema-muted" />
          </button>
        </section>
      </Reveal>
      <Sheet open={problemOpen} onClose={() => setProblemOpen(false)} title="Common problem">
        <p className="text-lg leading-7">{st.problem}</p>
      </Sheet>

      </>)}

      {/* Daily habits */}
      {s.dietView === 'day' && (
      <Reveal i={2}>
        <section className="flex flex-col gap-4 rounded-[28px] bg-white p-4 shadow-neema-card">
          <div className="flex items-center justify-between">
            <H2>My daily habits</H2>
            <Pill className="bg-neema-ochre-soft text-neema-ochre-ink">4 green days</Pill>
          </div>
          {/* TODO: fetch today's temperature for the user's city and raise the water target on hot days. */}
          <div className="flex items-center gap-2.5 rounded-2xl bg-neema-ochre-soft px-3 py-2.5 text-sm font-medium leading-5 text-neema-ochre-ink">
            <Sun className="h-[22px] w-[22px] flex-none" />
            <span>Hot, humid day: water target raised to about {(WATER_TARGET * 0.25).toFixed(1).replace('.0', '')} L.</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <ProgressRing value={s.water / WATER_TARGET} size={72} stroke={8} color="#3A7CA5" label={`${s.water} of ${WATER_TARGET} cups of water`}>
                <Droplet className="h-6 w-6 text-[#3A7CA5]" aria-hidden="true" />
              </ProgressRing>
              <div className="font-bold">{s.water}/{WATER_TARGET}</div>
              <div className="text-[13px] font-medium leading-[18px] text-neema-muted">cups of water</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ProgressRing value={ironCount / IRON.length} size={72} stroke={8} color="#2B9348" label={`${ironCount} of ${IRON.length} iron habits done`}>
                <Leaf className="h-6 w-6 text-neema-success" aria-hidden="true" />
              </ProgressRing>
              <div className="font-bold">{ironCount}/{IRON.length}</div>
              <div className="text-[13px] font-medium leading-[18px] text-neema-muted">iron habits</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ProgressRing value={s.activeWeek / 150} size={72} stroke={8} color="#E09F3E" label={`${s.activeWeek} of 150 active minutes this week`}>
                <Footprints className="h-6 w-6 text-neema-ochre" aria-hidden="true" />
              </ProgressRing>
              <div className="font-bold">{s.activeWeek}/150</div>
              <div className="text-[13px] font-medium leading-[18px] text-neema-muted">active min this week</div>
            </div>
          </div>
          <WaterDrops value={s.water} total={WATER_TARGET} className="justify-center" />
          <div className="flex gap-2">
            <button type="button" onClick={() => s.setWater(Math.min(s.water + 1, 20))} className="neema-press flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl bg-neema-dark font-semibold tracking-wide text-white">
              <Droplet className="h-5 w-5" /> +1 CUP
            </button>
            <button type="button" onClick={() => s.setWater(Math.max(s.water - 1, 0))} className="neema-press min-h-[56px] min-w-[72px] rounded-2xl border border-neema-border bg-white font-semibold">Undo</button>
          </div>
          <div>
            <div className="mb-2 text-[13px] font-semibold leading-[18px] text-neema-muted">TODAY’S IRON HABITS</div>
            <div className="grid grid-cols-2 gap-2">
              {ironLabels.map((label, i) => (
                <button key={label} type="button" aria-pressed={!!s.iron[i]} onClick={() => s.setIron({ ...s.iron, [i]: !s.iron[i] })}
                  className={cn('neema-press flex min-h-[56px] items-center gap-2 rounded-2xl px-2.5 py-2 text-left text-[15px] leading-5 transition-colors', s.iron[i] ? 'bg-neema-success-soft font-semibold' : 'bg-neema-cream')}>
                  <CheckBox on={!!s.iron[i]} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-[13px] font-semibold leading-[18px] text-neema-muted">LOG EVERYDAY ACTIVITY</div>
            <div className="flex flex-wrap gap-2">
              {[['+15 min walk to market', 15], ['+10 min housework', 10], ['+20 min dancing at church', 20]].map(([label, n]) => (
                <button key={label} type="button" onClick={() => s.setActiveWeek(s.activeWeek + (n as number))} className="neema-press min-h-[48px] rounded-full border border-neema-border bg-white px-3.5 text-[15px] font-medium">{label}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-neema-cream p-3">
            <p className="text-[15px] leading-[21px] text-neema-muted-strong">Very tired, breathless, or pale inside your eyelids? Check a symptom and ask for a haemoglobin test. Neema does not diagnose anaemia.</p>
            <button type="button" onClick={() => s.openSymptom()} className="neema-press min-h-[48px] rounded-xl border border-neema-border bg-white font-semibold text-neema-dark">Check a symptom</button>
          </div>
        </section>
      </Reveal>
      )}

      {s.dietView === 'food' && (<>
      {/* Foods as a swipeable shelf */}
      <Reveal i={4} className="flex flex-col gap-2.5">
        <H2 className="px-1">Iron and folate first: local foods</H2>
        <HScroll label="Local foods">
          {FOODS.map((f) => (
            <button key={f.name} type="button" onClick={() => setFood(f)} className="neema-press flex w-[172px] flex-none flex-col gap-1.5 rounded-3xl bg-white p-3.5 text-left shadow-neema-card">
              <FoodArt name={f.name} className="h-14 w-14" />
              <div className="font-semibold leading-[22px]">{f.name}</div>
              <div className="text-[13px] font-medium leading-[18px] text-neema-muted">{f.local}</div>
              <div className="flex flex-wrap gap-1">
                {f.tags.map((tag) => <span key={tag} className="rounded-full bg-neema-success-soft px-2 text-[13px] font-semibold leading-[20px] text-neema-success-ink">{tag}</span>)}
              </div>
              <div className="line-clamp-3 text-[15px] leading-[21px]">{f.benefit}</div>
            </button>
          ))}
        </HScroll>
        <p className="px-1 text-[15px] leading-[21px] text-neema-muted-strong">Eat leaves with orange, pineapple or tomato. {s.journey === 'preg' ? 'Food supports, but never replaces, the iron and folic acid tablets from your antenatal visit.' : s.journey === 'ttc' ? 'Food supports, but doesn’t replace, a daily folic acid tablet.' : 'Vitamin C helps your body take in the iron.'}</p>
      </Reveal>
      <Sheet open={!!food} onClose={() => setFood(null)} title={food?.name ?? ''}>
        {food && (
          <div className="flex flex-col gap-3">
            <FoodArt name={food.name} className="h-24 w-24" />
            <div className="text-neema-muted-strong">{food.local}</div>
            <div className="flex flex-wrap gap-1.5">{food.tags.map((tag) => <Pill key={tag} className="bg-neema-success-soft text-neema-success-ink">{tag}</Pill>)}</div>
            <p className="text-lg leading-7">{food.benefit}</p>
          </div>
        )}
      </Sheet>

      {/* Swaps: three at a time, search for more */}
      <Reveal i={5}>
        <section className="flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-neema-card">
          <H2>Local market swaps</H2>
          <div className="flex h-[52px] items-center gap-2 rounded-2xl border border-neema-border px-3">
            <Search className="h-5 w-5 text-neema-muted" />
            <label htmlFor="neema-swap" className="sr-only">Search an ingredient to swap</label>
            <input id="neema-swap" type="text" placeholder="Search e.g. quinoa, salmon, kale" value={query} onChange={(e) => setQuery(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-base outline-none" />
          </div>
          {shownSwaps.map((w) => (
            <div key={w.from} className="flex items-center gap-3 rounded-2xl bg-neema-cream px-3 py-2.5">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neema-muted line-through">{w.from}</span>
                  <ArrowRight className="h-[18px] w-[18px] text-neema-primary" />
                  <span className="font-semibold">{w.to}</span>
                </div>
                <div className="text-[15px] leading-[21px] text-neema-muted-strong">{w.why}</div>
              </div>
            </div>
          ))}
          {swaps.length === 0 && <p className="text-neema-muted">No local swap listed yet for that ingredient. Ask Neema or try another word.</p>}
          {!q && swaps.length > 3 && (
            <button type="button" onClick={() => setAllSwaps(!allSwaps)} className="min-h-[48px] rounded-2xl font-semibold text-neema-dark">
              {allSwaps ? 'Show fewer' : `Show all ${swaps.length} swaps`}
            </button>
          )}
        </section>
      </Reveal>

      <Reveal i={6}>
        <section className="flex flex-col gap-2 rounded-[28px] bg-white p-4 shadow-neema-card">
          <H2 className="mb-1">Avoid or limit</H2>
          <div className="grid gap-2">
            {avoidList.map((a) => (
              <div key={a.what} className="flex items-start gap-2.5 rounded-2xl bg-neema-primary-soft/60 px-3 py-2.5">
                <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white text-neema-dark"><X className="h-4 w-4" strokeWidth={3} /></span>
                <span className="text-[15px] leading-[21px]"><span className="font-semibold">{a.what}</span> — {a.why}</span>
              </div>
            ))}
          </div>
          <div className="mt-1 text-[13px] font-medium leading-[18px] text-neema-muted">{s.journey === 'avoid' ? 'Based on WHO healthy diet guidance.' : 'Based on WHO African-region antenatal guidance.'} Reviewed by Neema’s clinical reviewer.</div>
        </section>
      </Reveal>
      </>)}
    </div>
  );
}
