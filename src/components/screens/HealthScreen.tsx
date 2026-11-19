import { useState } from 'react';
import { AlertTriangle, Phone, Check, Footprints } from 'lucide-react';
import { PregnancyData } from '@/types/pregnancy';
import { FOODS, STAGES, SYMPTOMS } from '@/neema/data';
import { Card, H1, H2, Pill, Segmented } from '@/neema/ui';
import { MedicineSafety } from './MedicineSafety';

interface HealthScreenProps {
  pregnancy: PregnancyData;
}

type Topic = 'signs' | 'food' | 'activity' | 'medicines';

// Everyday activity, in line with WHO's 150 active minutes a week. TODO: clinical review.
const ACTIVITIES = [
  { name: 'Walking', detail: 'To the market, church or a neighbour: 20–30 minutes most days.' },
  { name: 'Housework at a gentle pace', detail: 'Sweeping, cooking and washing count. Take breaks and don’t lift heavy loads.' },
  { name: 'Dancing', detail: 'At church or at home, as long as you can still talk while moving.' },
  { name: 'Pelvic floor exercises', detail: 'Squeeze as if stopping urine, hold for 5 seconds, relax. 10 times, 3 times a day.' },
  { name: 'Rest on your left side', detail: 'Short rests during the day help swelling and tiredness.' },
];

/** Partner "Support" tab: how to help her stay healthy, and when to get help. */
export function HealthScreen({ pregnancy }: HealthScreenProps) {
  const [topic, setTopic] = useState<Topic>('signs');
  const stage = STAGES[`t${pregnancy.trimester}` as keyof typeof STAGES] ?? STAGES.t2;
  const urgent = SYMPTOMS.filter((s) => s.level === 'now' || s.level === 'today');

  return (
    <div className="flex flex-col gap-4 bg-neema-cream p-4 pb-8 font-sans text-neema-ink [&>*]:shrink-0">
      <div>
        <H1>How to support her</H1>
        <p className="mt-1 text-neema-muted-strong">Trimester {pregnancy.trimester}: what to watch for and how to help her stay well.</p>
      </div>

      <Segmented
        label="Topic"
        value={topic}
        onChange={setTopic}
        options={[{ id: 'signs', label: 'Danger signs' }, { id: 'food', label: 'Food' }, { id: 'activity', label: 'Activity' }, { id: 'medicines', label: 'Medicines' }]}
      />

      {topic === 'signs' && (
        <>
          <Card className="flex flex-col gap-3">
            <H2 className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-neema-sos" />Get her to care if she has</H2>
            <ul className="flex flex-col gap-2">
              {urgent.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 border-b border-neema-line pb-2 last:border-0">
                  <span>{s.label}</span>
                  <Pill className={s.level === 'now' ? 'flex-none bg-neema-primary-soft text-neema-dark' : 'flex-none bg-neema-ochre-soft text-neema-ochre-ink'}>{s.level === 'now' ? 'Go now' : 'Today'}</Pill>
                </li>
              ))}
            </ul>
            <a href="tel:119" className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-neema-sos font-semibold text-white">
              <Phone className="h-5 w-5" />Call 119 · SAMU ambulance
            </a>
          </Card>
          <p className="text-[15px] leading-[22px] text-neema-muted-strong">Stay with her, bring her antenatal card, and arrange transport early — at night too.</p>
        </>
      )}

      {topic === 'food' && (
        <>
          <Card className="flex flex-col gap-3">
            <H2>{stage.label}: what she needs most</H2>
            <div className="flex flex-wrap gap-1.5">{stage.nutrients.map((n) => <Pill key={n} className="bg-neema-ochre-soft text-neema-ochre-ink">{n}</Pill>)}</div>
            <p>{stage.extra}</p>
            {stage.meals.map((m) => <div key={m} className="flex items-start gap-2.5"><Check className="mt-0.5 h-5 w-5 flex-none text-neema-success" />{m}</div>)}
          </Card>
          <Card className="flex flex-col gap-2">
            <H2>Local foods to buy</H2>
            {FOODS.map((f) => (
              <div key={f.name} className="border-b border-neema-line pb-2 last:border-0">
                <span className="font-semibold">{f.name}</span> <span className="text-neema-muted-strong">({f.local})</span>
                <div className="text-[15px] leading-[22px]">{f.benefit}</div>
              </div>
            ))}
          </Card>
        </>
      )}

      {topic === 'activity' && (
        <Card className="flex flex-col gap-3">
          <H2 className="flex items-center gap-2"><Footprints className="h-5 w-5 text-neema-primary" />Staying active together</H2>
          <p className="text-neema-muted-strong">About 150 minutes of gentle activity a week, built into daily life. Walk with her.</p>
          {ACTIVITIES.map((a) => (
            <div key={a.name} className="rounded-xl bg-neema-cream px-3.5 py-3"><div className="font-semibold">{a.name}</div><div className="text-[15px] leading-[22px]">{a.detail}</div></div>
          ))}
          <p className="text-[15px] leading-[22px]">She should stop and get checked if she has pain, bleeding, dizziness or fluid leaking.</p>
        </Card>
      )}

      {topic === 'medicines' && <MedicineSafety withTitle={false} />}
    </div>
  );
}
