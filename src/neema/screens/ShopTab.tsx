import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SHOP, SHOP_CATS, SHOP_STAGES, STAGE_TAG, ShopItem } from '../data';
import { useNeema } from '../store';
import { CheckBox, H1, H2, Segmented, SwitchRow } from '../ui';

export function ShopTab() {
  const s = useNeema();
  const [groupBy, setGroupBy] = useState<'cat' | 'stage'>('cat');
  const [essOnly, setEssOnly] = useState(false);
  const [openGuide, setOpenGuide] = useState('');

  const list = SHOP.filter((it) => !essOnly || it.ess);
  const done = list.filter((it) => s.shop[it.id]).length;
  const pct = list.length ? Math.round((100 * done) / list.length) : 0;
  const groups = (groupBy === 'cat' ? SHOP_CATS : SHOP_STAGES)
    .map((g) => ({ ...g, items: list.filter((it) => (groupBy === 'cat' ? it.cat : it.when) === g.id) }))
    .filter((g) => g.items.length);
  const catTitle = (id: string) => SHOP_CATS.find((c) => c.id === id)?.title ?? '';

  const Item = ({ it }: { it: ShopItem }) => {
    const on = !!s.shop[it.id];
    const open = openGuide === it.id;
    return (
      <article className="flex flex-col gap-2.5 rounded-2xl bg-white px-4 py-3.5 shadow-neema-card">
        <div className="flex items-start gap-3">
          <button type="button" aria-label={`Got it: ${it.name}`} aria-pressed={on} onClick={() => s.setShop({ ...s.shop, [it.id]: !on })} className="-my-2 -ml-2.5 flex h-12 w-12 flex-none items-center justify-center">
            <CheckBox on={on} />
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className={cn('font-semibold', on && 'line-through')}>{it.name}</span>
            <span className="text-[15px] leading-[21px] text-neema-muted">{it.qty}</span>
            <div className="flex flex-wrap gap-1.5">
              <span className={cn('rounded-full px-2 text-xs font-semibold leading-[18px]', it.ess ? 'bg-neema-success-soft text-neema-success-ink' : 'bg-neema-sand')}>
                {it.ess ? 'Essential' : 'Nice to have'}
              </span>
              <span className="rounded-full bg-neema-cream px-2 text-xs font-semibold leading-[18px]">
                {groupBy === 'cat' ? STAGE_TAG[it.when as keyof typeof STAGE_TAG] : catTitle(it.cat)}
              </span>
            </div>
            <div className="text-[15px] leading-[22px]">{it.tip}</div>
          </div>
        </div>
        {it.guide && (
          <>
            <button type="button" aria-expanded={open} onClick={() => setOpenGuide(open ? '' : it.id)} className="flex min-h-[48px] items-center justify-between rounded-xl border border-[#E3C9BE] bg-neema-primary-soft px-3.5 text-[15px] font-semibold text-neema-dark">
              <span className="flex items-center gap-2"><BookOpen className="h-[18px] w-[18px]" />How to use</span>
              <ChevronDown className={cn('h-[18px] w-[18px] transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
              <ol className="flex list-decimal flex-col gap-1.5 rounded-xl bg-neema-cream py-3 pl-8 pr-3.5 text-[15px] leading-[22px]">
                {it.guide.map((step) => <li key={step}>{step}</li>)}
              </ol>
            )}
          </>
        )}
      </article>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4">
      <div>
        <H1>Baby &amp; mother checklist</H1>
        <p className="mt-1 text-neema-muted-strong">Everything for you, your baby and your delivery, in one list.</p>
      </div>

      <section className="flex flex-col gap-2.5 rounded-2xl bg-white px-5 py-4 shadow-neema-card">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold leading-6">{done} of {list.length} ready</span>
          <span className="font-bold text-neema-success-ink">{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-neema-sand" role="img" aria-label={`${done} of ${list.length} items ready`}>
          <div className="h-full rounded-full bg-neema-success" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[15px] leading-[21px] text-neema-muted">Unticked hospital-bag items appear in your reminders at weeks 32 and 36.</div>
      </section>

      <div className="flex flex-col gap-2">
        <Segmented label="Group the list" value={groupBy} onChange={setGroupBy} options={[{ id: 'cat', label: 'By category' }, { id: 'stage', label: 'By trimester' }]} />
        <div className="rounded-[14px] bg-white px-4 shadow-sm">
          <SwitchRow label="Essentials only" on={essOnly} onToggle={() => setEssOnly(!essOnly)} className="min-h-[56px]" />
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.id} className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline justify-between gap-2">
              <H2>{g.title}</H2>
              <span className="whitespace-nowrap text-[13px] font-semibold leading-[18px] text-neema-muted-strong">
                {g.items.filter((it) => s.shop[it.id]).length} of {g.items.length}
              </span>
            </div>
            {g.note && <p className="text-[15px] leading-[21px] text-neema-muted-strong">{g.note}</p>}
          </div>
          {g.items.map((it) => <Item key={it.id} it={it} />)}
        </section>
      ))}

      <p className="rounded-xl bg-neema-ochre-soft px-3.5 py-3 text-[15px] font-medium leading-[22px] text-neema-ochre-ink">
        WHO recommends breastfeeding only for baby’s first 6 months. Choose unperfumed products for baby and never use skin lighteners. Lay baby on their back on a firm, flat surface, under the net.
      </p>
    </div>
  );
}
