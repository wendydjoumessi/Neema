import { useEffect, useRef, useState } from 'react';
import { Baby, Heart, Lightbulb, ChevronLeft, ChevronRight, Ruler, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PregnancyData } from '@/types/pregnancy';
import { weeklyData } from '@/data/pregnancyData';
import { babySizeFor, milestoneFor } from '@/neema/data';
import { Card, H1, H2, Pill, Segmented } from '@/neema/ui';

interface WeeklyTrackingScreenProps {
  pregnancy: PregnancyData;
}

type Section = 'baby' | 'body' | 'tips';

const MOODS = [
  { id: 'good', label: 'Good' },
  { id: 'calm', label: 'Calm' },
  { id: 'tired', label: 'Tired' },
  { id: 'low', label: 'Low' },
  { id: 'worried', label: 'Worried' },
];

/** The weekly content covers stages of about four weeks: show the stage this week belongs to. */
function stageFor(week: number) {
  let best = weeklyData[0];
  for (const w of weeklyData) if (w.week <= week) best = w;
  const next = weeklyData.find((w) => w.week > best.week);
  return { data: best, from: best.week, to: next ? next.week - 1 : 40 };
}

export function WeeklyTrackingScreen({ pregnancy }: WeeklyTrackingScreenProps) {
  const [week, setWeek] = useState(Math.min(40, Math.max(1, pregnancy.currentWeek)));
  const [section, setSection] = useState<Section>('baby');
  const [mood, setMood] = useState('');
  const stripRef = useRef<HTMLDivElement>(null);
  const stage = stageFor(week);
  const size = babySizeFor(week);
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  const when = week === pregnancy.currentWeek ? 'This week' : week < pregnancy.currentWeek ? 'Earlier week' : 'Coming up';

  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-week="${week}"]`);
    el?.scrollIntoView?.({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [week]);

  return (
    <div className="flex flex-col gap-4 bg-neema-cream p-4 pb-8 font-sans text-neema-ink [&>*]:shrink-0">
      <div>
        <H1>Week by week</H1>
        <p className="mt-1 text-neema-muted-strong">How your baby and your body change through all 40 weeks.</p>
      </div>

      <Card className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <button type="button" aria-label="Previous week" disabled={week <= 1} onClick={() => setWeek(week - 1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-neema-cream disabled:opacity-40">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="text-center">
            <Pill className="bg-neema-primary-soft text-neema-dark">Trimester {trimester}</Pill>
            <div className="mt-1 text-[32px] font-bold leading-10">Week {week}</div>
            <div className="text-[15px] text-neema-muted-strong">{when}</div>
          </div>
          <button type="button" aria-label="Next week" disabled={week >= 40} onClick={() => setWeek(week + 1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-neema-cream disabled:opacity-40">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <div ref={stripRef} role="tablist" aria-label="Choose a week" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => (
            <button
              key={w}
              type="button"
              role="tab"
              data-week={w}
              aria-selected={w === week}
              aria-label={`Week ${w}`}
              onClick={() => setWeek(w)}
              className={cn(
                'h-12 w-12 flex-none rounded-xl text-[15px] font-semibold',
                w === week ? 'bg-neema-dark text-white' : w === pregnancy.currentWeek ? 'border-2 border-neema-primary bg-white' : w < pregnancy.currentWeek ? 'bg-neema-primary-soft' : 'bg-neema-cream',
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </Card>

      <Segmented
        label="Topic"
        value={section}
        onChange={setSection}
        options={[{ id: 'baby', label: 'Baby' }, { id: 'body', label: 'Your body' }, { id: 'tips', label: 'Tips' }]}
      />

      {section === 'baby' && (
        <>
          <section className="flex items-center gap-4 rounded-2xl bg-neema-dark p-5 text-white shadow-neema-hero">
            <span aria-hidden="true" className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white text-neema-dark"><Ruler className="h-7 w-7" /></span>
            <div>
              <div className="text-[13px] font-bold uppercase tracking-[0.08em]">Baby is about the size of</div>
              <div className="text-2xl font-bold leading-8">{size.size}</div>
              <div>Around {size.length}{size.weight ? ` and ${size.weight}` : ''}</div>
            </div>
          </section>
          <Card className="flex flex-col gap-3">
            <H2 className="flex items-center gap-2"><Baby className="h-5 w-5 text-neema-primary" />Baby’s development</H2>
            <p className="rounded-xl bg-neema-ochre-soft px-3.5 py-2.5 font-medium text-neema-ochre-ink">{milestoneFor(week)}</p>
            <ul className="flex flex-col gap-2.5">
              {stage.data.babyDevelopment.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-neema-primary-soft text-[13px] font-bold text-neema-dark">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">Development notes for weeks {stage.from}–{stage.to}.</p>
          </Card>
        </>
      )}

      {section === 'body' && (
        <>
          <Card className="flex flex-col gap-3">
            <H2 className="flex items-center gap-2"><Heart className="h-5 w-5 text-neema-primary" />Your body in weeks {stage.from}–{stage.to}</H2>
            <ul className="flex flex-col gap-2.5">
              {stage.data.motherChanges.map((item) => (
                <li key={item} className="flex items-start gap-3"><span className="mt-2.5 h-2 w-2 flex-none rounded-full bg-neema-primary" />{item}</li>
              ))}
            </ul>
          </Card>
          <Card className="flex flex-col gap-3">
            <H2>How are you feeling today?</H2>
            <div role="radiogroup" aria-label="Your mood" className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={mood === m.id}
                  onClick={() => setMood(m.id)}
                  className={cn('min-h-[48px] rounded-full border px-4 font-semibold', mood === m.id ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {mood && (
              <p role="status" className="rounded-xl bg-neema-cream px-3.5 py-3 text-[15px] leading-[22px]">
                {mood === 'low' || mood === 'worried'
                  ? 'Thank you for sharing. Many women feel this way in pregnancy. If you have felt low or worried most days for two weeks, tell your midwife — help is available.'
                  : 'Thank you for checking in. Keep resting, eating well and drinking water.'}
              </p>
            )}
          </Card>
        </>
      )}

      {section === 'tips' && (
        <>
          <Card className="flex flex-col gap-3">
            <H2 className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-neema-ochre-ink" />Tips for weeks {stage.from}–{stage.to}</H2>
            {stage.data.tips.map((tip) => (
              <p key={tip} className="rounded-xl bg-neema-ochre-soft px-3.5 py-3 text-neema-ink">{tip}</p>
            ))}
          </Card>
          <Card className="flex items-start gap-3">
            <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-neema-success-soft text-neema-success-ink"><CalendarCheck className="h-6 w-6" /></span>
            <div>
              <H2>Antenatal visits</H2>
              <p className="text-neema-muted-strong">WHO recommends at least eight contacts during pregnancy. Bring your antenatal card to every visit.</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
