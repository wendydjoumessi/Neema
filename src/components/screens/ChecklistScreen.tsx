import { useEffect, useRef, useState } from 'react';
import { Timer, Play, Square, RotateCcw, Shirt, Droplets, Baby, Briefcase, Phone, AlertTriangle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChecklistItem } from '@/types/pregnancy';
import { Card, CheckBox, H1, H2, Segmented } from '@/neema/ui';

interface ChecklistScreenProps {
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
  /** Show the preparation checklist. Mothers have the full list in the Shopping tab, so they see the labour tools only. */
  showChecklist?: boolean;
  /** Called by the "Open my shopping list" link when the checklist is hidden. */
  onOpenShopping?: () => void;
}

type CategoryId = ChecklistItem['category'];
const CATEGORIES: { id: CategoryId; label: string; Icon: typeof Shirt }[] = [
  { id: 'clothes', label: 'Clothes', Icon: Shirt },
  { id: 'hygiene', label: 'Hygiene', Icon: Droplets },
  { id: 'equipment', label: 'Equipment', Icon: Baby },
  { id: 'hospital-bag', label: 'Hospital', Icon: Briefcase },
];

// TODO: clinical reviewer to approve the labour guidance below.
const GO_WHEN = [
  'Contractions come regularly, about every 5 minutes, each lasting about a minute, for an hour.',
  'Go earlier if you live far from the facility, have no transport at night, or this is not your first baby.',
];
const GO_NOW = [
  'Your waters break, especially if the fluid is green or brown',
  'Bleeding from the vagina',
  'Baby moves less or stops moving',
  'Fever, fits, severe headache or blurred vision',
  'Constant, severe belly pain',
];

const fmt = (secs: number) => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

type Contraction = { start: number; duration: number };

function ContractionTimer() {
  const [running, setRunning] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [list, setList] = useState<Contraction[]>([]);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = running ? Math.floor((now - startRef.current) / 1000) : 0;
  const start = () => { startRef.current = Date.now(); setNow(Date.now()); setRunning(true); };
  const stop = () => {
    setRunning(false);
    setList((l) => [{ start: startRef.current, duration: Math.floor((Date.now() - startRef.current) / 1000) }, ...l].slice(0, 20));
  };
  const recent = list.slice(0, 5);
  const gaps = recent.slice(0, -1).map((c, i) => Math.round((c.start - recent[i + 1].start) / 1000));
  const avgGap = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0;
  const avgLen = recent.length ? Math.round(recent.reduce((a, c) => a + c.duration, 0) / recent.length) : 0;

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <H2 className="flex items-center gap-2 self-start"><Timer className="h-5 w-5 text-neema-primary" />Contraction timer</H2>
      <div
        aria-live="polite"
        className={cn('flex h-40 w-40 flex-col items-center justify-center rounded-full text-white transition-colors', running ? 'bg-neema-dark shadow-neema-hero' : 'bg-neema-primary')}
      >
        <span className="text-[13px] font-bold uppercase tracking-[0.08em]">{running ? 'Contraction' : 'Ready'}</span>
        <span className="text-4xl font-bold tabular-nums">{fmt(elapsed)}</span>
      </div>
      <button
        type="button"
        onClick={running ? stop : start}
        className={cn('flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl font-semibold tracking-wide active:scale-[0.98]', running ? 'border-2 border-neema-ink bg-white text-neema-ink' : 'bg-neema-dark text-white')}
      >
        {running ? <><Square className="h-5 w-5" />STOP — CONTRACTION ENDED</> : <><Play className="h-5 w-5" />START — CONTRACTION BEGINS</>}
      </button>
      {recent.length > 0 && (
        <div className="flex w-full flex-col gap-2 text-left">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-neema-cream px-3 py-2.5"><div className="text-[13px] font-medium text-neema-muted-strong">Average length</div><div className="text-lg font-bold">{fmt(avgLen)}</div></div>
            <div className="rounded-xl bg-neema-cream px-3 py-2.5"><div className="text-[13px] font-medium text-neema-muted-strong">Average time apart</div><div className="text-lg font-bold">{gaps.length ? fmt(avgGap) : '—'}</div></div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {recent.map((c, i) => (
              <li key={c.start} className="flex justify-between rounded-xl border border-neema-line px-3 py-2.5 text-[15px]">
                <span>{new Date(c.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>lasted <span className="font-semibold">{fmt(c.duration)}</span>{gaps[i] ? <> · {fmt(gaps[i])} apart</> : null}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setList([])} className="flex min-h-[48px] items-center justify-center gap-2 font-semibold text-neema-dark">
            <RotateCcw className="h-[18px] w-[18px]" />Clear and start again
          </button>
        </div>
      )}
    </Card>
  );
}

export function ChecklistScreen({ checklist, onToggleItem, showChecklist = true, onOpenShopping }: ChecklistScreenProps) {
  const [category, setCategory] = useState<CategoryId>('clothes');
  const done = checklist.filter((i) => i.completed).length;
  const pct = checklist.length ? Math.round((100 * done) / checklist.length) : 0;
  const items = checklist.filter((i) => i.category === category);

  return (
    <div className="flex flex-col gap-4 bg-neema-cream p-4 pb-8 font-sans text-neema-ink [&>*]:shrink-0">
      <div>
        <H1>{showChecklist ? 'Getting ready for birth' : 'Labour and contractions'}</H1>
        <p className="mt-1 text-neema-muted-strong">Time your contractions and know when to go to the maternity unit.</p>
      </div>

      <ContractionTimer />

      <Card className="flex flex-col gap-3">
        <H2>When to go to the maternity unit</H2>
        <ul className="flex flex-col gap-2">
          {GO_WHEN.map((t) => <li key={t} className="flex items-start gap-2.5"><span className="mt-2.5 h-2 w-2 flex-none rounded-full bg-neema-primary" />{t}</li>)}
        </ul>
        <div className="rounded-xl bg-neema-primary-soft px-3.5 py-3">
          <div className="mb-1.5 flex items-center gap-2 font-semibold text-neema-dark"><AlertTriangle className="h-5 w-5" />Go straight away if</div>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {GO_NOW.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <a href="tel:119" className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-neema-sos bg-neema-sos-soft font-semibold text-neema-sos">
          <Phone className="h-5 w-5" />Call 119 for an ambulance
        </a>
        <p className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">Educational guidance only. Your midwife may give you different advice — follow hers.</p>
      </Card>

      {showChecklist ? (
        <>
          <section className="flex flex-col gap-2.5 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold">{done} of {checklist.length} ready</span>
              <span className="font-bold text-neema-success-ink">{pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-neema-sand" role="img" aria-label={`${done} of ${checklist.length} items ready`}>
              <div className="h-full rounded-full bg-neema-success" style={{ width: `${pct}%` }} />
            </div>
          </section>
          <Segmented label="Category" value={category} onChange={setCategory} options={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))} />
          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.completed}
                onClick={() => onToggleItem(item.id)}
                className="flex min-h-[60px] items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-neema-card"
              >
                <CheckBox on={item.completed} />
                <span className="flex flex-1 flex-col">
                  <span className={cn('font-semibold', item.completed && 'text-neema-muted line-through')}>{item.name}</span>
                  {item.quantity ? <span className="text-[15px] text-neema-muted">Quantity: {item.quantity}</span> : null}
                </span>
                <span className={cn('rounded-full px-2.5 text-[13px] font-semibold capitalize leading-[22px]',
                  item.priority === 'essential' ? 'bg-neema-success-soft text-neema-success-ink' : item.priority === 'recommended' ? 'bg-neema-ochre-soft text-neema-ochre-ink' : 'bg-neema-sand')}>
                  {item.priority}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <Card className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-neema-ochre-soft text-neema-ochre-ink"><ShoppingBag className="h-6 w-6" /></span>
          <div className="flex-1">
            <H2>Hospital bag and mama kit</H2>
            <p className="text-neema-muted-strong">Your full checklist is in the Shopping tab.</p>
          </div>
          {onOpenShopping && (
            <button type="button" onClick={onOpenShopping} className="min-h-[48px] rounded-xl bg-neema-dark px-4 font-semibold text-white">Open</button>
          )}
        </Card>
      )}
    </div>
  );
}
