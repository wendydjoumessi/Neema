import { useState } from 'react';
import { MessageCircle, AlertTriangle, CalendarDays, Lightbulb, Ruler, Info } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PregnancyData } from '@/types/pregnancy';
import { weeklyData } from '@/data/pregnancyData';
import { babySizeFor, milestoneFor } from '@/neema/data';
import { Card, CheckBox, H2 } from '@/neema/ui';

interface PartnerDashboardProps {
  pregnancy: PregnancyData;
  onNavigate: (screen: string) => void;
}

// TODO: load the partner's tasks and the mother's shared data from the back end once partners are linked.
const TASKS = [
  { id: 'visit', title: 'Go with her to an antenatal visit', week: 20 },
  { id: 'signs', title: 'Learn the danger signs and when to call 119', week: 24 },
  { id: 'money', title: 'Save money for the birth and the mama kit', week: 28 },
  { id: 'transport', title: 'Plan transport to the maternity unit, day and night', week: 32 },
  { id: 'bag', title: 'Pack the hospital bag together', week: 34 },
  { id: 'phones', title: 'Save the maternity unit’s and family phone numbers', week: 36 },
];

const TIPS = [
  'Fetch water or cook a meal today so she can rest.',
  'Ask how she is feeling, and really listen.',
  'Remind her to take her iron and folic acid tablet with an orange.',
  'Offer a gentle back or foot rub this evening.',
  'Make sure she sleeps under the treated bed net tonight.',
];

export function PartnerDashboard({ pregnancy, onNavigate }: PartnerDashboardProps) {
  const [done, setDone] = useState<Record<string, boolean>>({ visit: true });
  const week = Math.max(1, Math.min(40, pregnancy.currentWeek));
  const daysToGo = Math.max(0, differenceInDays(pregnancy.dueDate, new Date()));
  const progress = Math.min(100, Math.round((week / 40) * 100));
  const size = babySizeFor(week);
  let stage = weeklyData[0];
  for (const w of weeklyData) if (w.week <= week) stage = w;
  const tip = TIPS[new Date().getDay() % TIPS.length];
  const isSample = pregnancy.id === 'demo';
  const doneCount = TASKS.filter((t) => done[t.id]).length;
  const message = encodeURIComponent('Thinking of you and our baby today. Tell me what I can do to help.');

  return (
    <div className="flex flex-col gap-4 bg-neema-cream p-4 pb-8 font-sans text-neema-ink [&>*]:shrink-0">
      {isSample && (
        <div role="status" className="flex items-start gap-2.5 rounded-xl bg-neema-lilac px-3.5 py-3 text-[15px] leading-[22px]">
          <Info className="mt-0.5 h-5 w-5 flex-none text-neema-lilac-ink" />
          <span>You’re seeing sample information. When the mother invites you, Neema will show her pregnancy and the updates she chooses to share.</span>
        </div>
      )}

      <section className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-neema-dark p-5 text-white shadow-neema-hero">
        <div aria-hidden="true" className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-neema-primary" />
        <span className="relative text-[13px] font-bold uppercase tracking-[0.08em]">Supporting her · week {week} of 40</span>
        <h1 className="relative text-[32px] font-bold leading-10">{daysToGo} days to go</h1>
        <span className="relative">Due {format(pregnancy.dueDate, 'd MMMM yyyy')}</span>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-white/30" role="img" aria-label={`${progress} percent of pregnancy completed`}>
          <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-2xl bg-neema-ochre-soft p-4">
        <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white text-neema-ochre-ink"><Lightbulb className="h-6 w-6" /></span>
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-neema-ochre-ink">Today’s way to help</div>
          <p className="font-semibold">{tip}</p>
        </div>
      </section>

      <section aria-label="Quick actions" className="grid grid-cols-3 gap-2.5">
        <a href={`sms:?body=${message}`} className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-2xl bg-neema-primary-soft p-2 text-center text-[15px] font-semibold leading-5">
          <MessageCircle className="h-6 w-6 text-neema-dark" />Send her a message
        </a>
        <button type="button" onClick={() => onNavigate('health')} className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-2xl bg-neema-sos-soft p-2 text-center text-[15px] font-semibold leading-5">
          <AlertTriangle className="h-6 w-6 text-neema-sos" />Danger signs
        </button>
        <button type="button" onClick={() => onNavigate('tracking')} className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-2xl bg-neema-success-soft p-2 text-center text-[15px] font-semibold leading-5">
          <CalendarDays className="h-6 w-6 text-neema-success-ink" />Week by week
        </button>
      </section>

      <Card className="flex flex-col gap-3">
        <H2>Baby this week</H2>
        <div className="flex items-center gap-3 rounded-xl bg-neema-cream px-3.5 py-3">
          <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-neema-ochre-soft text-neema-ochre-ink"><Ruler className="h-6 w-6" /></span>
          <span className="flex flex-col"><span className="font-semibold">About the size of {size.size}</span><span className="text-[15px] text-neema-muted-strong">Around {size.length}{size.weight ? ` and ${size.weight}` : ''}</span></span>
        </div>
        <p>{milestoneFor(week)}</p>
      </Card>

      <Card className="flex flex-col gap-2.5">
        <H2>What she may be feeling</H2>
        <ul className="flex flex-col gap-2">
          {stage.motherChanges.map((c) => <li key={c} className="flex items-start gap-2.5"><span className="mt-2.5 h-2 w-2 flex-none rounded-full bg-neema-primary" />{c}</li>)}
        </ul>
      </Card>

      <Card className="flex flex-col px-5 py-4">
        <div className="mb-1 flex items-baseline justify-between">
          <H2>Your tasks</H2>
          <span className="text-[15px] font-semibold text-neema-success-ink">{doneCount} of {TASKS.length} done</span>
        </div>
        {TASKS.map((t) => (
          <button key={t.id} type="button" aria-pressed={!!done[t.id]} onClick={() => setDone({ ...done, [t.id]: !done[t.id] })} className="flex min-h-[60px] items-center gap-3 border-b border-neema-line py-2 text-left last:border-0">
            <CheckBox on={!!done[t.id]} />
            <span className="flex flex-col">
              <span className={cn('font-semibold', done[t.id] && 'text-neema-muted line-through')}>{t.title}</span>
              <span className="text-[15px] text-neema-muted">By week {t.week}</span>
            </span>
          </button>
        ))}
      </Card>
    </div>
  );
}
