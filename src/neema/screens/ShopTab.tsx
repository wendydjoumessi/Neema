import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { ChevronDown, Share2, Plus, Trash2, PartyPopper, CalendarClock, ShieldCheck, Pencil, RotateCcw, Heart, Baby, Milk, Stethoscope, Lock, Check, ShoppingBag, Briefcase, Info, type LucideIcon } from 'lucide-react';
import { fieldErrors, shopItemSchema } from '@/lib/form-validation';
import { cn } from '@/lib/utils';
import { BAGS, READY, SHOP, SHOP_CATS, SHOP_STAGES, ShopItem } from '../data';
import { useNeema, type CustomItem } from '../store';
import { Card, CheckBox, H1, H2, Segmented, SwitchRow } from '../ui';
import { ProgressRing, Reveal } from '../motion';
import { BabyArt, BagArt } from '../art';

/** When each stage opens (by pregnancy week) and when it should be done. */
const STAGE_TIMING: Record<string, { from: number; by: string }> = {
  t2: { from: 14, by: 'Get by week 28' },
  t3: { from: 24, by: 'Get by week 32' },
  bag: { from: 30, by: 'Pack by week 36' },
};
const STAGE_ORDER = ['t2', 't3', 'bag'] as const;

type View = 'now' | 'bag' | 'all' | 'pp';
type Row = { id: string; name: string; qty?: string; tip?: string; guide?: string[]; ess: boolean; custom?: boolean; cat?: string };

const toRow = (it: ShopItem): Row => ({ id: it.id, name: it.name, qty: it.qty, tip: it.tip, guide: 'guide' in it ? it.guide : undefined, ess: it.ess, cat: it.cat });
const customRow = (c: CustomItem): Row => ({ id: c.id, name: c.name, qty: c.qty || 'Added by you', ess: true, custom: true, cat: c.group });

/** A small coloured icon per category, so the list can be scanned at a glance. */
const CAT_STYLE: Record<string, { Icon: LucideIcon; bg: string; ink: string; label: string }> = {
  mother: { Icon: Heart, bg: 'bg-neema-primary-soft', ink: 'text-neema-dark', label: 'For you' },
  baby: { Icon: Baby, bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', label: 'For baby' },
  feed: { Icon: Milk, bg: 'bg-neema-success-soft', ink: 'text-neema-success-ink', label: 'Feeding' },
  kit: { Icon: Stethoscope, bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', label: 'Mama kit' },
};

/** Each pregnancy stage's own icon and colour (timeline and section headings). */
const STAGE_STYLE: Record<string, { Icon: LucideIcon; short: string; bg: string; ink: string; bar: string }> = {
  t2: { Icon: ShoppingBag, short: 'Trimester 2', bg: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink', bar: 'bg-neema-ochre' },
  t3: { Icon: Baby, short: 'Trimester 3', bg: 'bg-neema-primary-soft', ink: 'text-neema-dark', bar: 'bg-neema-primary' },
  bag: { Icon: Briefcase, short: 'Hospital bag', bg: 'bg-neema-lilac', ink: 'text-[#4A3F6B]', bar: 'bg-[#7A6BA8]' },
};

const reducedMotion = () => typeof window === 'undefined' || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToId = (id: string) => window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' }), 60);

function ItemEditor({ row, onDone }: { row: Row; onDone: () => void }) {
  const s = useNeema();
  const [name, setName] = useState(row.name);
  const [qty, setQty] = useState(row.qty === 'Added by you' ? '' : row.qty ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const original = SHOP.find((it) => it.id === row.id);
  const edited = !row.custom && !!(s.shopEdits[row.id]?.name || s.shopEdits[row.id]?.qty !== undefined);

  const save = (e: FormEvent) => {
    e.preventDefault();
    const r = shopItemSchema.safeParse({ name, qty });
    if (!r.success) { setErrors(fieldErrors(r.error)); document.getElementById(`edit-name-${row.id}`)?.focus(); return; }
    const v = r.data as { name: string; qty: string };
    if (row.custom) {
      s.setShopCustom(s.shopCustom.map((c) => (c.id === row.id ? { ...c, name: v.name, qty: v.qty } : c)));
    } else {
      s.setShopEdits({ ...s.shopEdits, [row.id]: { name: v.name === original?.name ? undefined : v.name, qty: v.qty === original?.qty ? undefined : v.qty } });
    }
    onDone();
  };
  const reset = () => {
    const { [row.id]: _drop, ...rest } = s.shopEdits;
    void _drop;
    s.setShopEdits(rest);
    onDone();
  };
  const field = 'h-12 w-full rounded-xl border bg-white px-3 text-base';
  return (
    <form onSubmit={save} noValidate className="mb-3 flex flex-col gap-2.5 rounded-xl bg-neema-cream p-3.5">
      <div className="flex flex-col gap-1">
        <label htmlFor={`edit-name-${row.id}`} className="font-semibold">Item</label>
        <input id={`edit-name-${row.id}`} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name}
          className={cn(field, errors.name ? 'border-neema-dark' : 'border-neema-border')} />
        {errors.name && <p className="text-[15px] font-medium text-neema-dark">{errors.name}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`edit-qty-${row.id}`} className="font-semibold">How many <span className="font-normal text-neema-muted-strong">(optional)</span></label>
        <input id={`edit-qty-${row.id}`} value={qty} maxLength={80} placeholder="e.g. 2 packs" onChange={(e) => setQty(e.target.value)} className={cn(field, 'border-neema-border')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onDone} className="min-h-[48px] rounded-xl border border-neema-border bg-white font-semibold">Cancel</button>
        <button type="submit" className="min-h-[48px] rounded-xl bg-neema-dark font-semibold text-white">Save</button>
      </div>
      {edited && <button type="button" onClick={reset} className="min-h-[48px] font-semibold text-neema-dark">Go back to Neema’s version</button>}
    </form>
  );
}

function ItemRow({ row, exitOnTick = false, showCat = false }: { row: Row; exitOnTick?: boolean; showCat?: boolean }) {
  const s = useNeema();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit' | 'remove'>('view');
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const on = !!s.shop[row.id] || leaving;
  const cat = showCat ? CAT_STYLE[row.cat ?? ''] : undefined;
  // In "Get now", a ticked item gives a little check, then glides off the list.
  const toggle = () => {
    if (exitOnTick && !on && !reducedMotion()) {
      setLeaving(true);
      timer.current = window.setTimeout(() => s.setShop({ ...s.shop, [row.id]: true }), 520);
      return;
    }
    s.setShop({ ...s.shop, [row.id]: !on });
  };

  const remove = () => {
    const { [row.id]: _tick, ...ticks } = s.shop;
    void _tick;
    s.setShop(ticks);
    if (row.custom) s.setShopCustom(s.shopCustom.filter((c) => c.id !== row.id));
    else s.setShopEdits({ ...s.shopEdits, [row.id]: { ...s.shopEdits[row.id], hidden: true } });
  };

  return (
    <li className={cn('border-b border-neema-line last:border-b-0', leaving && 'neema-tick-out')}>
      <div className="flex items-center gap-1.5 py-1.5">
        <button type="button" aria-label={`Got it: ${row.name}`} aria-pressed={on} onClick={toggle} className="-ml-2.5 flex h-12 w-12 flex-none items-center justify-center">
          <span key={String(on)} className={cn('block', on && 'neema-check-pop')}><CheckBox on={on} /></span>
        </button>
        {cat && (
          <span aria-hidden="true" title={cat.label} className={cn('flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-opacity', cat.bg, cat.ink, on && 'opacity-50')}>
            <cat.Icon className="h-[18px] w-[18px]" />
          </span>
        )}
        <button type="button" onClick={() => { setOpen(!open); setMode('view'); }} aria-expanded={open}
          className="ml-1 flex min-h-[52px] min-w-0 flex-1 items-center gap-2 text-left">
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex flex-wrap items-center gap-x-2">
              <span className={cn('font-semibold', on && 'text-neema-muted line-through')}>{row.name}</span>
              {!row.ess && <span className="rounded-full bg-neema-sand px-2 text-[13px] font-semibold leading-[20px] text-neema-muted-strong">Optional</span>}
            </span>
            {row.qty && <span className="text-[15px] leading-[21px] text-neema-muted">{row.qty}</span>}
          </span>
          <ChevronDown aria-hidden="true" className={cn('h-5 w-5 flex-none text-neema-muted transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      {open && mode === 'edit' && <div className="neema-fade ml-10"><ItemEditor row={row} onDone={() => setMode('view')} /></div>}
      {open && mode !== 'edit' && (
        <div className="neema-fade mb-3 ml-10 flex flex-col gap-2 rounded-xl bg-neema-cream px-3.5 py-3 text-[15px] leading-[22px]">
          {row.tip && <p>{row.tip}</p>}
          {row.guide && (
            <>
              <div className="text-[13px] font-semibold uppercase leading-[18px] text-neema-dark">How to use</div>
              <ol className="flex list-decimal flex-col gap-1.5 pl-5">{row.guide.map((g) => <li key={g}>{g}</li>)}</ol>
            </>
          )}
          {mode === 'remove' ? (
            <div role="alert" className="flex flex-col gap-2 rounded-xl bg-white p-3">
              <span>Remove “{row.name}” from your list?{row.custom ? '' : ' You can put it back later from Everything.'}</span>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setMode('view')} className="min-h-[48px] rounded-xl border border-neema-border font-semibold">Keep</button>
                <button type="button" onClick={remove} className="min-h-[48px] rounded-xl border-2 border-neema-dark font-semibold text-neema-dark">Remove</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMode('edit')} aria-label={`Edit ${row.name}`} className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-neema-border bg-white font-semibold">
                <Pencil className="h-[18px] w-[18px]" /> Edit
              </button>
              <button type="button" onClick={() => setMode('remove')} aria-label={`Remove ${row.name}`} className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-neema-border bg-white font-semibold text-neema-dark">
                <Trash2 className="h-[18px] w-[18px]" /> Remove
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

/** Neema's items she removed, with a way to put each back. */
function RemovedItems({ removed }: { removed: ShopItem[] }) {
  const s = useNeema();
  const [open, setOpen] = useState(false);
  if (!removed.length) return null;
  const restore = (id: string) => {
    const { hidden: _h, ...rest } = s.shopEdits[id] ?? {};
    void _h;
    s.setShopEdits({ ...s.shopEdits, [id]: rest });
  };
  return (
    <Card className="flex flex-col gap-1 py-4">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-[48px] items-center justify-between gap-2 text-left">
        <span className="font-semibold">Removed from my list ({removed.length})</span>
        <ChevronDown className={cn('h-5 w-5 text-neema-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <ul className="flex flex-col">
          {removed.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-2 border-b border-neema-line py-1.5 last:border-b-0">
              <span className="text-neema-muted-strong">{it.name}</span>
              <button type="button" onClick={() => restore(it.id)} aria-label={`Put back ${it.name}`} className="flex min-h-[48px] flex-none items-center gap-1.5 rounded-xl px-3 font-semibold text-neema-dark hover:bg-neema-cream">
                <RotateCcw className="h-[18px] w-[18px]" /> Put back
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Section({ id, title, note, rows, badge, children, Icon, tone, exitOnTick, i = 0 }: {
  id?: string; title: string; note?: string; rows: Row[]; badge?: string; children?: ReactNode; Icon?: LucideIcon; tone?: string; exitOnTick?: boolean; i?: number;
}) {
  const s = useNeema();
  const done = rows.filter((r) => s.shop[r.id]).length;
  // Category icons help only when a section mixes categories.
  const showCat = new Set(rows.map((r) => r.cat)).size > 1;
  return (
    <Reveal i={i} className="scroll-mt-4">
      <section id={id} className="flex scroll-mt-4 flex-col rounded-[24px] bg-white px-4 pb-2 pt-4 shadow-neema-card">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex min-w-0 items-center gap-2.5">
            {Icon && <span aria-hidden="true" className={cn('flex h-10 w-10 flex-none items-center justify-center rounded-2xl', tone)}><Icon className="h-5 w-5" /></span>}
            <H2>{title}</H2>
          </div>
          <span className="whitespace-nowrap rounded-full bg-neema-cream px-2.5 py-0.5 text-[13px] font-semibold leading-[20px] text-neema-muted-strong">{badge ?? `${done} of ${rows.length}`}</span>
        </div>
        {!badge && rows.length > 0 && (
          <div aria-hidden="true" className="mx-1 mt-3 h-1.5 overflow-hidden rounded-full bg-neema-sand">
            <div className="h-full rounded-full bg-neema-success transition-[width] duration-500" style={{ width: `${(100 * done) / rows.length}%` }} />
          </div>
        )}
        {note && <p className="mt-2 px-1 text-[15px] leading-[21px] text-neema-muted-strong">{note}</p>}
        <ul className="mt-1 flex flex-col">{rows.map((r) => <ItemRow key={r.id} row={r} exitOnTick={exitOnTick} showCat={showCat} />)}</ul>
        {children}
      </section>
    </Reveal>
  );
}

function AddItem({ group, label }: { group: CustomItem['group']; label: string }) {
  const s = useNeema();
  const [name, setName] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    s.setShopCustom([...s.shopCustom, { id: `c_${Date.now()}`, name: n.slice(0, 80), group }]);
    setName('');
  };
  return (
    <form onSubmit={submit} className="mb-2 mt-2 flex gap-2 border-t border-neema-line pt-3">
      <label htmlFor={`add-${group}`} className="sr-only">{label}</label>
      <input id={`add-${group}`} value={name} onChange={(e) => setName(e.target.value)} placeholder={label}
        className="h-12 min-w-0 flex-1 rounded-xl border border-neema-border bg-white px-3 text-base" />
      <button type="submit" aria-label="Add item" disabled={!name.trim()} className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-neema-dark text-white disabled:opacity-40">
        <Plus className="h-5 w-5" />
      </button>
    </form>
  );
}

function ReadinessCard() {
  const s = useNeema();
  const done = READY.filter((r) => s.shop[r.id]).length;
  return (
    <section className="flex flex-col rounded-[24px] bg-neema-lilac px-5 pb-3 pt-4">
      <div className="flex items-baseline justify-between gap-2">
        <H2>Ready for labour?</H2>
        <span className="whitespace-nowrap text-[13px] font-semibold leading-[18px] text-[#4A3F6B]">{done} of {READY.length}</span>
      </div>
      <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div className="h-full rounded-full bg-[#7A6BA8] transition-[width] duration-500" style={{ width: `${(100 * done) / READY.length}%` }} />
      </div>
      <p className="mt-2 text-[15px] leading-[21px]">Not things to buy, but the plans that matter most when labour starts.</p>
      <ul className="mt-1 flex flex-col">
        {READY.map((r) => {
          const on = !!s.shop[r.id];
          return (
            <li key={r.id}>
              <button type="button" aria-pressed={on} onClick={() => s.setShop({ ...s.shop, [r.id]: !on })} className="flex min-h-[60px] w-full items-start gap-3 border-b border-[#D9D2EA] py-2.5 text-left last:border-b-0">
                <span key={String(on)} className={cn('mt-0.5', on && 'neema-check-pop')}><CheckBox on={on} tone="ink" /></span>
                <span className="flex flex-col"><span className="font-semibold">{r.label}</span><span className="text-[15px] leading-[21px] text-neema-muted-strong">{r.sub}</span></span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ShopTab({ week = 20 }: { week?: number }) {
  const s = useNeema();
  const afterBirth = s.journey === 'pp';
  const [view, setView] = useState<View>(afterBirth ? 'pp' : 'now');
  const [groupBy, setGroupBy] = useState<'cat' | 'stage'>('cat');
  const [essOnly, setEssOnly] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [shared, setShared] = useState('');

  // Neema's list with her own edits applied and removed items left out.
  const items = SHOP.filter((it) => !s.shopEdits[it.id]?.hidden).map((it) => ({ ...it, name: s.shopEdits[it.id]?.name || it.name, qty: s.shopEdits[it.id]?.qty ?? it.qty }));
  const removed = SHOP.filter((it) => s.shopEdits[it.id]?.hidden);
  const custom = (g: CustomItem['group']) => s.shopCustom.filter((c) => c.group === g).map(customRow);
  const ppMother = items.filter((i) => i.cat === 'mother' && (i.when === 'pp' || ['pads', 'bras', 'nipple'].includes(i.id))).map(toRow);
  const ppFeed = [...items.filter((i) => i.cat === 'feed').map(toRow), ...custom('feed')];
  const ppBaby = items.filter((i) => i.cat === 'baby' && (i.when === 'pp' || ['nappies', 'cotton', 'soap', 'thermo', 'net'].includes(i.id))).map(toRow);
  // After birth, progress counts only what she still needs now (not the hospital bag).
  const essentials = afterBirth
    ? [...ppMother, ...ppFeed, ...ppBaby].filter((r) => r.ess)
    : [...items.filter((i) => i.ess).map(toRow), ...s.shopCustom.map(customRow)];
  const essDone = essentials.filter((r) => s.shop[r.id]).length;
  const pct = essentials.length ? Math.round((100 * essDone) / essentials.length) : 0;
  const bagRows = items.filter((i) => i.when === 'bag');
  const bagDone = bagRows.filter((i) => s.shop[i.id]).length + s.shopCustom.filter((c) => c.group !== 'feed' && s.shop[c.id]).length;
  const bagTotal = bagRows.length + s.shopCustom.filter((c) => c.group !== 'feed').length;

  const open = STAGE_ORDER.filter((st) => week >= STAGE_TIMING[st].from);
  const next = STAGE_ORDER.find((st) => week < STAGE_TIMING[st].from);
  const stageRows = (st: string) => items.filter((i) => i.when === st && !(essOnly && !i.ess)).map(toRow);
  const nowRows = open.flatMap((st) => stageRows(st)).filter((r) => !s.shop[r.id]);

  const share = async () => {
    const todo = (view === 'bag' ? [...bagRows.map(toRow), ...custom('mother'), ...custom('baby'), ...custom('kit')]
      : view === 'pp' ? [...ppMother, ...ppFeed, ...ppBaby]
        : essentials).filter((r) => !s.shop[r.id]);
    const text = `Neema checklist: still needed\n${todo.map((r) => `• ${r.name}${r.qty && !r.custom ? ` (${r.qty})` : ''}`).join('\n')}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Neema checklist', text }); setShared('Shared.'); return; }
    } catch { /* cancelled: fall back to WhatsApp */ }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    setShared('Opening WhatsApp…');
  };

  const views = afterBirth
    ? [{ id: 'pp' as View, label: 'After birth' }, { id: 'all' as View, label: 'Everything' }]
    : [{ id: 'now' as View, label: 'Get now' }, { id: 'bag' as View, label: 'Hospital bag' }, { id: 'all' as View, label: 'Everything' }];

  const stageCount = (st: string) => {
    const rows = items.filter((i) => i.when === st);
    return { done: rows.filter((i) => s.shop[i.id]).length, total: rows.length };
  };
  const goStage = (st: string) => {
    if (st === 'bag') { setView('bag'); scrollToId('shop-bags'); return; }
    setView('now'); scrollToId(`shop-${st}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4">
      <Reveal>
        <H1>{afterBirth ? 'After-birth checklist' : 'Getting ready for baby'}</H1>
        <p className="mt-1 text-neema-muted-strong">{afterBirth ? 'Only what helps now. Breastfeeding itself needs no equipment.' : 'What to get, and when. You don’t need everything at once.'}</p>
      </Reveal>

      {/* Summary */}
      <Reveal i={1}>
        <section className="relative flex flex-col gap-2.5 overflow-hidden rounded-[28px] bg-gradient-to-br from-neema-primary-soft via-[#FBE3D6] to-neema-ochre-soft p-4 shadow-neema-card">
          <div aria-hidden="true" className="neema-drift absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/40" />
          <div className="relative flex items-center gap-3.5">
            <span className="rounded-full bg-white/80 p-1">
              <ProgressRing value={pct / 100} size={76} stroke={8} track="#F1E4DA" label={`${essDone} of ${essentials.length} essentials ready`}>
                <span className="text-xl font-bold leading-6 text-neema-success-ink">{pct}%</span>
              </ProgressRing>
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-lg font-semibold leading-6">Essentials: {essDone} of {essentials.length} ready</span>
              <span className="text-[15px] leading-[21px] text-neema-muted-strong">{pct === 100 ? 'All set. Well done!' : 'Tick items as you get them.'}</span>
            </span>
            {afterBirth && <span aria-hidden="true" className="neema-sway hidden h-16 w-16 flex-none min-[380px]:block"><BabyArt className="h-full w-full" /></span>}
          </div>
          {!afterBirth && (
            <div className="relative flex items-center gap-2.5 rounded-2xl bg-white/70 py-2 pl-1.5 pr-3">
              <span aria-hidden="true" className="neema-sway block h-12 w-12 flex-none"><BagArt className="h-full w-full" /></span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[15px] leading-[20px] text-neema-muted-strong">Week {week} · Hospital bag {bagDone} of {bagTotal} packed{week >= 32 && bagDone < bagTotal ? ' — pack it by week 36' : ''}</span>
                <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-neema-sand">
                  <div className="neema-bar-in h-full rounded-full bg-[#7A6BA8]" style={{ width: `${bagTotal ? (100 * bagDone) / bagTotal : 0}%` }} />
                </div>
              </div>
            </div>
          )}
          <button type="button" onClick={share} className="neema-press relative flex min-h-[48px] items-center justify-center gap-2 self-start rounded-full bg-white px-4 text-[15px] font-semibold text-neema-dark shadow-sm">
            <Share2 className="h-[18px] w-[18px]" /> Share the list with family
          </button>
          {shared && <p role="status" className="relative text-center text-[15px] text-neema-muted-strong">{shared}</p>}
        </section>
      </Reveal>

      {/* When to get what: a timeline through pregnancy */}
      {!afterBirth && (
        <Reveal i={2}>
          <nav aria-label="Shopping stages" className="relative grid grid-cols-3 gap-2">
            <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-[26px] border-t-2 border-dashed border-neema-border" />
            {STAGE_ORDER.map((st) => {
              const { done, total } = stageCount(st);
              const locked = week < STAGE_TIMING[st].from;
              const complete = !locked && total > 0 && done === total;
              const style = STAGE_STYLE[st];
              const when = locked ? `From week ${STAGE_TIMING[st].from}` : STAGE_TIMING[st].by.replace('Get by', 'By').replace('Pack by', 'By');
              return (
                <button key={st} type="button" onClick={() => goStage(st)}
                  aria-label={`${style.short}: ${locked ? `opens from week ${STAGE_TIMING[st].from}` : `${done} of ${total} got`}. ${STAGE_TIMING[st].by}`}
                  className={cn('neema-press relative flex flex-col items-center gap-1 rounded-2xl bg-white px-1.5 pb-2 pt-2 text-center shadow-neema-card', locked && 'bg-white/70')}>
                  <span className={cn('relative flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-neema-cream', complete ? 'bg-neema-success text-white' : locked ? 'bg-neema-sand text-neema-muted' : cn(style.bg, style.ink))}>
                    {complete ? <Check className="neema-check-pop h-5 w-5" strokeWidth={3} /> : locked ? <Lock className="h-4 w-4" /> : <style.Icon className="h-[18px] w-[18px]" />}
                  </span>
                  <span className="text-[13px] font-bold leading-[17px]">{style.short}</span>
                  <span className="text-[13px] leading-[17px] text-neema-muted-strong">{when}</span>
                  <span aria-hidden="true" className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-neema-sand">
                    {!locked && <span className={cn('neema-bar-in block h-full rounded-full', complete ? 'bg-neema-success' : style.bar)} style={{ width: `${total ? (100 * done) / total : 0}%` }} />}
                  </span>
                </button>
              );
            })}
          </nav>
        </Reveal>
      )}

      <Segmented label="Show" value={view} onChange={setView} options={views} />

      {view === 'now' && (
        <>
          {open.length === 0 ? (
            <Card className="neema-rise flex flex-col gap-2">
              <span className="neema-float flex h-12 w-12 items-center justify-center rounded-2xl bg-neema-success-soft"><ShieldCheck className="h-7 w-7 text-neema-success-ink" /></span>
              <H2>Nothing to buy yet</H2>
              <p className="text-neema-muted-strong">In the first trimester, your energy and money are best spent on antenatal visits, iron and folic acid, and good food. Many families start getting things ready from week 14.</p>
            </Card>
          ) : nowRows.length === 0 ? (
            <Card className="neema-rise relative flex flex-col gap-2 overflow-hidden">
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16">
                {['#D95D39', '#E09F3E', '#2B9348', '#7A6BA8', '#D95D39', '#E09F3E'].map((c, i) => (
                  <span key={i} className="neema-confetti absolute top-0 h-2 w-2 rounded-sm" style={{ left: `${12 + i * 15}%`, background: c, animationDelay: `${i * 90}ms` }} />
                ))}
              </span>
              <span className="neema-sway flex h-12 w-12 items-center justify-center rounded-2xl bg-neema-success-soft"><PartyPopper className="h-7 w-7 text-neema-success-ink" /></span>
              <H2>You’re up to date</H2>
              <p className="text-neema-muted-strong">Everything for this stage is ticked.{next ? ` More from week ${STAGE_TIMING[next].from}.` : ''}</p>
            </Card>
          ) : (
            open.map((st, i) => {
              const rows = stageRows(st).filter((r) => !s.shop[r.id]);
              if (!rows.length) return null;
              const title = SHOP_STAGES.find((x) => x.id === st)!.title.split(' · ')[0];
              const style = STAGE_STYLE[st];
              return <Section key={st} id={`shop-${st}`} i={i} Icon={style.Icon} tone={cn(style.bg, style.ink)} title={st === 'bag' ? 'Hospital bag' : title} badge={STAGE_TIMING[st].by} rows={rows} exitOnTick />;
            })
          )}
          {week >= 28 && <ReadinessCard />}
          {next && (
            <Card className="flex flex-col gap-2 border-2 border-dashed border-neema-border bg-white/70 py-4 shadow-none">
              <button type="button" aria-expanded={showNext} onClick={() => setShowNext(!showNext)} className="flex min-h-[48px] items-center justify-between gap-3 text-left">
                <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-neema-sand text-neema-muted-strong"><Lock className="h-5 w-5" /></span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-semibold">Coming up from week {STAGE_TIMING[next].from}</span>
                  <span className="text-[15px] leading-[21px] text-neema-muted-strong">{stageRows(next).length} items · {STAGE_TIMING[next].by.toLowerCase()}</span>
                </span>
                <ChevronDown className={cn('h-5 w-5 text-neema-muted transition-transform', showNext && 'rotate-180')} />
              </button>
              {showNext && <ul className="neema-fade flex flex-col">{stageRows(next).map((r) => <ItemRow key={r.id} row={r} showCat />)}</ul>}
            </Card>
          )}
        </>
      )}

      {view === 'bag' && (
        <>
          <div id="shop-bags" aria-hidden="true" className="-mb-4 scroll-mt-4" />
          <Reveal className="grid grid-cols-3 gap-2">
            {BAGS.map((b) => {
              const rows = [...items.filter((i) => i.when === 'bag' && i.cat === b.id).map(toRow), ...custom(b.id as CustomItem['group'])];
              const done = rows.filter((r) => s.shop[r.id]).length;
              const style = CAT_STYLE[b.id];
              return (
                <button key={b.id} type="button" onClick={() => scrollToId(`bag-${b.id}`)} aria-label={`${b.title}: ${done} of ${rows.length} packed`}
                  className="neema-press flex flex-col items-center gap-1 rounded-2xl bg-white px-1.5 py-3 shadow-neema-card">
                  <ProgressRing value={rows.length ? done / rows.length : 0} size={58} stroke={6} color={done === rows.length && rows.length ? '#2B9348' : '#D95D39'}>
                    <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', style.bg, style.ink)}><style.Icon className="h-[18px] w-[18px]" /></span>
                  </ProgressRing>
                  <span className="text-[13px] font-bold leading-[17px]">{style.label}</span>
                  <span className="text-[13px] leading-[17px] text-neema-muted-strong">{done} of {rows.length}</span>
                </button>
              );
            })}
          </Reveal>
          <p className="flex items-start gap-2.5 rounded-2xl bg-neema-ochre-soft px-3.5 py-3 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">
            <CalendarClock className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
            Pack by week 36 and keep the bags by the door. Labour can start early.
          </p>
          {BAGS.map((b, i) => (
            <Section key={b.id} id={`bag-${b.id}`} i={i} Icon={CAT_STYLE[b.id].Icon} tone={cn(CAT_STYLE[b.id].bg, CAT_STYLE[b.id].ink)} title={b.title} note={b.note}
              rows={[...items.filter((i) => i.when === 'bag' && i.cat === b.id).map(toRow), ...custom(b.id as CustomItem['group'])]}>
              <AddItem group={b.id as CustomItem['group']} label={b.id === 'kit' ? 'Add an item from your clinic’s list' : 'Add your own item'} />
            </Section>
          ))}
          <ReadinessCard />
        </>
      )}

      {view === 'pp' && (
        <>
          <Section title="For you" Icon={Heart} tone="bg-neema-primary-soft text-neema-dark" rows={ppMother} />
          <Section title="Feeding" Icon={Milk} tone="bg-neema-success-soft text-neema-success-ink" note={SHOP_CATS.find((c) => c.id === 'feed')!.note} rows={ppFeed}>
            <AddItem group="feed" label="Add your own item" />
          </Section>
          <Section title="For baby" Icon={Baby} tone="bg-neema-ochre-soft text-neema-ochre-ink" rows={ppBaby} />
        </>
      )}

      {view === 'all' && (
        <>
          <div className="flex flex-col gap-2">
            <Segmented label="Group the list" value={groupBy} onChange={setGroupBy} options={[{ id: 'cat', label: 'By category' }, { id: 'stage', label: 'By stage' }]} />
            <div className="rounded-[14px] bg-white px-4 shadow-sm">
              <SwitchRow label="Essentials only" on={essOnly} onToggle={() => setEssOnly(!essOnly)} className="min-h-[56px]" />
            </div>
          </div>
          {(groupBy === 'cat' ? SHOP_CATS : SHOP_STAGES).map((g) => {
            const rows = [
              ...items.filter((it) => (groupBy === 'cat' ? it.cat : it.when) === g.id && !(essOnly && !it.ess)).map(toRow),
              ...(groupBy === 'cat' ? custom(g.id as CustomItem['group']) : []),
            ];
            const style = groupBy === 'cat' ? CAT_STYLE[g.id] : STAGE_STYLE[g.id];
            return rows.length ? <Section key={g.id} title={g.title} note={g.note} rows={rows} Icon={style?.Icon ?? CalendarClock} tone={style ? cn(style.bg, style.ink) : 'bg-neema-cream text-neema-muted-strong'} /> : null;
          })}
          <RemovedItems removed={removed} />
        </>
      )}

      <p className="flex items-start gap-2.5 rounded-2xl bg-neema-ochre-soft px-3.5 py-3 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">
        <Info className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
        Choose unperfumed products for baby, and never use skin lighteners or talc. Lay baby on their back on a firm, flat surface, under a treated net.
      </p>
    </div>
  );
}
