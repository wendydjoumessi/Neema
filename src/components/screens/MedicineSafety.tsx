import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { unsafeMedications } from '@/data/pregnancyData';
import { Card, Disclaimer, H1, H2 } from '@/neema/ui';

// TODO: replace with the clinician-approved medicine list (~100 medicines, spec FR-RISK-09 to 11).
const LOCAL_NAMES: Record<string, string> = { Acetaminophen: 'Paracetamol (acetaminophen)' };

const STATUS = {
  safe: { label: 'Generally safe', cls: 'bg-neema-success-soft text-neema-success-ink' },
  caution: { label: 'Ask first', cls: 'bg-neema-ochre-soft text-neema-ochre-ink' },
  unsafe: { label: 'Avoid', cls: 'bg-neema-primary-soft text-neema-dark' },
} as const;

/** Medicine safety check: search a medicine and see whether it is generally safe in pregnancy. */
export function MedicineSafety({ withTitle = true }: { withTitle?: boolean }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const meds = unsafeMedications
    .map((m) => ({ ...m, name: LOCAL_NAMES[m.name] ?? m.name }))
    .filter((m) => !q || m.name.toLowerCase().includes(q))
    .sort((a, b) => ['unsafe', 'caution', 'safe'].indexOf(a.category) - ['unsafe', 'caution', 'safe'].indexOf(b.category));

  return (
    <div className="flex flex-col gap-4 [&>*]:shrink-0">
      {withTitle && (
        <div>
          <H1>Medicine safety check</H1>
          <p className="mt-1 text-neema-muted-strong">Search a medicine to see if it is generally safe during pregnancy.</p>
        </div>
      )}
      <div className="flex h-[52px] items-center gap-2 rounded-xl border border-neema-border bg-white px-3">
        <Search className="h-5 w-5 text-neema-muted" />
        <label htmlFor="neema-med" className="sr-only">Search a medicine</label>
        <input id="neema-med" type="text" placeholder="e.g. paracetamol, ibuprofen" value={query} onChange={(e) => setQuery(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-base outline-none" />
      </div>
      <Card className="flex flex-col p-0">
        {meds.map((m) => (
          <div key={m.name} className="flex items-start justify-between gap-3 border-b border-neema-line px-4 py-3 last:border-0">
            <div className="min-w-0">
              <div className="font-semibold">{m.name}</div>
              <div className="text-[15px] leading-[21px] text-neema-muted-strong">{m.notes}</div>
            </div>
            <span className={cn('flex-none rounded-full px-2.5 text-[13px] font-semibold leading-[22px]', STATUS[m.category].cls)}>{STATUS[m.category].label}</span>
          </div>
        ))}
        {meds.length === 0 && (
          <div className="flex items-start gap-2.5 p-4">
            <Info className="mt-0.5 h-5 w-5 flex-none text-neema-muted" />
            <p>This medicine isn’t in Neema’s list yet. Don’t take it until a pharmacist or health worker says it is safe in pregnancy.</p>
          </div>
        )}
      </Card>
      <section className="flex flex-col gap-1 rounded-2xl bg-neema-ochre-soft px-4 py-3.5 text-neema-ochre-ink">
        <H2 className="text-neema-ochre-ink">Before you take anything</H2>
        <p>Tell the pharmacist you are pregnant or breastfeeding. Avoid herbal mixtures and “roots” unless your health worker approves them.</p>
      </section>
      <Disclaimer />
    </div>
  );
}
