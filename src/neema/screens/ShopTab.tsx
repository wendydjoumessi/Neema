import { FormEvent, ReactNode, useState } from 'react';
import { ChevronDown, Share2, Plus, Trash2, PartyPopper, CalendarClock, ShieldCheck, Pencil, RotateCcw } from 'lucide-react';
import { fieldErrors, shopItemSchema } from '@/lib/form-validation';
import { cn } from '@/lib/utils';
import { BAGS, READY, SHOP, SHOP_CATS, SHOP_STAGES, ShopItem } from '../data';
import { useNeema, type CustomItem } from '../store';
import { Card, CheckBox, H1, H2, Segmented, SwitchRow } from '../ui';

/** When each stage opens (by pregnancy week) and when it should be done. */
const STAGE_TIMING: Record<string, { from: number; by: string }> = {
  t2: { from: 14, by: 'Get by week 28' },
  t3: { from: 24, by: 'Get by week 32' },
  bag: { from: 30, by: 'Pack by week 36' },
};
const STAGE_ORDER = ['t2', 't3', 'bag'] as const;

type View = 'now' | 'bag' | 'all' | 'pp';
type Row = { id: string; name: string; qty?: string; tip?: string; guide?: string[]; ess: boolean; custom?: boolean };

const toRow = (it: ShopItem): Row => ({ id: it.id, name: it.name, qty: it.qty, tip: it.tip, guide: 'guide' in it ? it.guide : undefined, ess: it.ess });
const customRow = (c: CustomItem): Row => ({ id: c.id, name: c.name, qty: c.qty || 'Added by you', ess: true, custom: true });

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

function ItemRow({ row }: { row: Row }) {
  const s = useNeema();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit' | 'remove'>('view');
  const on = !!s.shop[row.id];

  const remove = () => {
    const { [row.id]: _tick, ...ticks } = s.shop;
    void _tick;
    s.setShop(ticks);
    if (row.custom) s.setShopCustom(s.shopCustom.filter((c) => c.id !== row.id));
    else s.setShopEdits({ ...s.shopEdits, [row.id]: { ...s.shopEdits[row.id], hidden: true } });
  };

  return (
    <li className="border-b border-neema-line last:border-b-0">
      <div className="flex items-center gap-2 py-1.5">
        <button type="button" aria-label={`Got it: ${row.name}`} aria-pressed={on} onClick={() => s.setShop({ ...s.shop, [row.id]: !on })} className="-ml-2.5 flex h-12 w-12 flex-none items-center justify-center">
          <CheckBox on={on} />
        </button>
        <button type="button" onClick={() => { setOpen(!open); setMode('view'); }} aria-expanded={open}
          className="flex min-h-[52px] min-w-0 flex-1 items-center gap-2 text-left">
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
      {open && mode === 'edit' && <div className="ml-10"><ItemEditor row={row} onDone={() => setMode('view')} /></div>}
      {open && mode !== 'edit' && (
        <div className="mb-3 ml-10 flex flex-col gap-2 rounded-xl bg-neema-cream px-3.5 py-3 text-[15px] leading-[22px]">
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

function Section({ title, note, rows, badge, children }: { title: string; note?: string; rows: Row[]; badge?: string; children?: ReactNode }) {
  const s = useNeema();
  const done = rows.filter((r) => s.shop[r.id]).length;
  return (
    <Card className="flex flex-col px-4 pb-2 pt-4">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <H2>{title}</H2>
        <span className="whitespace-nowrap text-[13px] font-semibold leading-[18px] text-neema-muted-strong">{badge ?? `${done} of ${rows.length}`}</span>
      </div>
      {note && <p className="mt-1 px-1 text-[15px] leading-[21px] text-neema-muted-strong">{note}</p>}
      <ul className="mt-1 flex flex-col">{rows.map((r) => <ItemRow key={r.id} row={r} />)}</ul>
      {children}
    </Card>
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
    <section className="flex flex-col rounded-2xl bg-neema-lilac px-5 pb-3 pt-4">
      <div className="flex items-baseline justify-between gap-2">
        <H2>Ready for labour?</H2>
        <span className="whitespace-nowrap text-[13px] font-semibold leading-[18px] text-[#4A3F6B]">{done} of {READY.length}</span>
      </div>
      <p className="mt-1 text-[15px] leading-[21px]">Not things to buy, but the plans that matter most when labour starts.</p>
      <ul className="mt-1 flex flex-col">
        {READY.map((r) => {
          const on = !!s.shop[r.id];
          return (
            <li key={r.id}>
              <button type="button" aria-pressed={on} onClick={() => s.setShop({ ...s.shop, [r.id]: !on })} className="flex min-h-[60px] w-full items-start gap-3 border-b border-[#D9D2EA] py-2.5 text-left last:border-b-0">
                <span className="mt-0.5"><CheckBox on={on} tone="ink" /></span>
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

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4">
      <div>
        <H1>{afterBirth ? 'After-birth checklist' : 'Getting ready for baby'}</H1>
        <p className="mt-1 text-neema-muted-strong">{afterBirth ? 'Only what helps now. Breastfeeding itself needs no equipment.' : 'What to get, and when. You don’t need everything at once.'}</p>
      </div>

      {/* Summary */}
      <section className="flex flex-col gap-2.5 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold leading-6">Essentials: {essDone} of {essentials.length} ready</span>
          <span className="font-bold text-neema-success-ink">{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-neema-sand" role="img" aria-label={`${essDone} of ${essentials.length} essentials ready`}>
          <div className="h-full rounded-full bg-neema-success" style={{ width: `${pct}%` }} />
        </div>
        {!afterBirth && (
          <div className="flex items-center gap-2 text-[15px] leading-[21px] text-neema-muted-strong">
            <CalendarClock className="h-[18px] w-[18px] flex-none" />
            <span>Week {week} · Hospital bag {bagDone} of {bagTotal} packed{week >= 32 && bagDone < bagTotal ? ' — pack it by week 36' : ''}</span>
          </div>
        )}
        <button type="button" onClick={share} className="mt-1 flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-neema-border bg-white font-semibold text-neema-dark">
          <Share2 className="h-5 w-5" /> Share the list with family
        </button>
        {shared && <p role="status" className="text-center text-[15px] text-neema-muted-strong">{shared}</p>}
      </section>

      <Segmented label="Show" value={view} onChange={setView} options={views} />

      {view === 'now' && (
        <>
          {open.length === 0 ? (
            <Card className="flex flex-col gap-2">
              <ShieldCheck className="h-7 w-7 text-neema-success-ink" />
              <H2>Nothing to buy yet</H2>
              <p className="text-neema-muted-strong">In the first trimester, your energy and money are best spent on antenatal visits, iron and folic acid, and good food. Many families start getting things ready from week 14.</p>
            </Card>
          ) : nowRows.length === 0 ? (
            <Card className="flex flex-col gap-2">
              <PartyPopper className="h-7 w-7 text-neema-success-ink" />
              <H2>You’re up to date</H2>
              <p className="text-neema-muted-strong">Everything for this stage is ticked.{next ? ` More from week ${STAGE_TIMING[next].from}.` : ''}</p>
            </Card>
          ) : (
            open.map((st) => {
              const rows = stageRows(st).filter((r) => !s.shop[r.id]);
              if (!rows.length) return null;
              const title = SHOP_STAGES.find((x) => x.id === st)!.title.split(' · ')[0];
              return <Section key={st} title={st === 'bag' ? 'Hospital bag' : title} badge={STAGE_TIMING[st].by} rows={rows} />;
            })
          )}
          {week >= 28 && <ReadinessCard />}
          {next && (
            <Card className="flex flex-col gap-2 py-4">
              <button type="button" aria-expanded={showNext} onClick={() => setShowNext(!showNext)} className="flex min-h-[48px] items-center justify-between gap-2 text-left">
                <span className="flex flex-col">
                  <span className="font-semibold">Coming up from week {STAGE_TIMING[next].from}</span>
                  <span className="text-[15px] leading-[21px] text-neema-muted-strong">{stageRows(next).length} items · {STAGE_TIMING[next].by.toLowerCase()}</span>
                </span>
                <ChevronDown className={cn('h-5 w-5 text-neema-muted transition-transform', showNext && 'rotate-180')} />
              </button>
              {showNext && <ul className="flex flex-col">{stageRows(next).map((r) => <ItemRow key={r.id} row={r} />)}</ul>}
            </Card>
          )}
        </>
      )}

      {view === 'bag' && (
        <>
          <p className="rounded-xl bg-neema-ochre-soft px-3.5 py-3 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">
            Pack by week 36 and keep the bags by the door. Labour can start early.
          </p>
          {BAGS.map((b) => (
            <Section key={b.id} title={b.title} note={b.note}
              rows={[...items.filter((i) => i.when === 'bag' && i.cat === b.id).map(toRow), ...custom(b.id as CustomItem['group'])]}>
              <AddItem group={b.id as CustomItem['group']} label={b.id === 'kit' ? 'Add an item from your clinic’s list' : 'Add your own item'} />
            </Section>
          ))}
          <ReadinessCard />
        </>
      )}

      {view === 'pp' && (
        <>
          <Section title="For you" rows={ppMother} />
          <Section title="Feeding" note={SHOP_CATS.find((c) => c.id === 'feed')!.note} rows={ppFeed}>
            <AddItem group="feed" label="Add your own item" />
          </Section>
          <Section title="For baby" rows={ppBaby} />
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
            return rows.length ? <Section key={g.id} title={g.title} note={g.note} rows={rows} /> : null;
          })}
          <RemovedItems removed={removed} />
        </>
      )}

      <p className="rounded-xl bg-neema-ochre-soft px-3.5 py-3 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">
        Choose unperfumed products for baby, and never use skin lighteners or talc. Lay baby on their back on a firm, flat surface, under a treated net.
      </p>
    </div>
  );
}
