import { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Heart, Wind, Share2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dailyPrayers } from '@/data/pregnancyData';
import { Card, H1, H2, Segmented } from '@/neema/ui';

type Faith = 'christian' | 'muslim' | 'none';
type Reading = { title: string; text: string; source?: string };

// TODO: faith content must be reviewed by faith advisers (spec: faith content never contradicts medical advice).
const READINGS: Record<Faith, Reading[]> = {
  christian: dailyPrayers.map((p) => ({ title: p.title, text: p.content, source: p.verse })),
  muslim: [
    { title: 'A dua for a good child', text: 'Ask Allah to bless you and your baby with health, goodness and peace through every day of this pregnancy.', source: '“My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.” — Qur’an 3:38' },
    { title: 'Ease after hardship', text: 'On the hard days, remember that difficulty does not last. Rest, and trust that ease will come.', source: '“For indeed, with hardship comes ease. Indeed, with hardship comes ease.” — Qur’an 94:5–6' },
    { title: 'You are given what you can carry', text: 'You are stronger than you feel today. Take one step, and one breath, at a time.', source: '“Allah does not burden a soul beyond that it can bear.” — Qur’an 2:286' },
  ],
  none: [
    { title: 'You are doing well', text: 'Growing a baby is hard work. Every glass of water, every rest and every visit to your midwife is an act of care.' },
    { title: 'One day at a time', text: 'You don’t need to have everything ready today. Choose one small thing to do, and let the rest wait.' },
    { title: 'Ask for help', text: 'Let the people around you carry some of the load: cooking, fetching water, or simply listening.' },
  ],
};

const AFFIRMATIONS = [
  'I am strong and capable of bringing new life into this world.',
  'My body knows how to care for my baby.',
  'I can ask for help, and I deserve support.',
  'Every day, my baby and I grow a little stronger.',
  'I am surrounded by love on this journey.',
];

const loadFaith = (): Faith => {
  try { return (window.localStorage.getItem('neema:faith') as Faith) || 'christian'; } catch { return 'christian'; }
};

function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  useEffect(() => { if (tick >= 60) { setRunning(false); setTick(0); } }, [tick]);
  const phase = tick % 8 < 4 ? 'Breathe in' : 'Breathe out';
  const inhale = tick % 8 < 4;

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <H2 className="flex items-center gap-2 self-start"><Wind className="h-5 w-5 text-neema-primary" />One-minute calm breathing</H2>
      <div className="flex h-36 w-36 items-center justify-center">
        <div
          aria-live="polite"
          className={cn('flex items-center justify-center rounded-full bg-neema-primary-soft font-semibold text-neema-dark transition-all duration-[4000ms] ease-in-out',
            running ? (inhale ? 'h-36 w-36' : 'h-20 w-20') : 'h-28 w-28')}
        >
          {running ? phase : 'Ready'}
        </div>
      </div>
      <p className="text-neema-muted-strong">Breathe in slowly for 4 seconds, then out for 4 seconds. Sit or lie on your side.</p>
      <button type="button" onClick={() => { setRunning(!running); setTick(0); }} className="min-h-[56px] w-full rounded-xl bg-neema-dark font-semibold tracking-wide text-white active:scale-[0.98]">
        {running ? `STOP · ${60 - tick}s left` : 'START'}
      </button>
    </Card>
  );
}

export function SpiritualScreen() {
  const [faith, setFaith] = useState<Faith>(loadFaith);
  const [index, setIndex] = useState(0);
  const [aff, setAff] = useState(0);
  const [shared, setShared] = useState(false);
  const list = READINGS[faith];
  const reading = list[Math.min(index, list.length - 1)];

  const chooseFaith = (f: Faith) => {
    setFaith(f);
    setIndex(0);
    try { window.localStorage.setItem('neema:faith', f); } catch { /* keep in memory only */ }
  };

  const share = async () => {
    const text = `${reading.title}\n\n${reading.text}${reading.source ? `\n\n${reading.source}` : ''}\n\n— shared from Neema`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); setShared(true); }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="flex flex-col gap-4 bg-neema-cream p-4 pb-8 font-sans text-neema-ink [&>*]:shrink-0">
      <div>
        <H1>Spiritual and emotional support</H1>
        <p className="mt-1 text-neema-muted-strong">A daily word of encouragement, in your faith or none.</p>
      </div>

      <div>
        <div className="mb-1.5 text-[13px] font-semibold uppercase leading-[18px] text-neema-muted-strong">My daily word</div>
        <Segmented
          role="radiogroup"
          label="Faith"
          value={faith}
          onChange={chooseFaith}
          options={[{ id: 'christian', label: 'Christian' }, { id: 'muslim', label: 'Muslim' }, { id: 'none', label: 'No faith' }]}
        />
      </div>

      <section className="flex flex-col gap-3 rounded-2xl bg-neema-ochre-soft p-5 shadow-neema-card">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-neema-ochre-ink">{faith === 'none' ? 'Today’s encouragement' : 'Today’s prayer'}</span>
          <button type="button" aria-label="Share" onClick={share} className="-m-2 flex h-12 w-12 items-center justify-center rounded-full text-neema-ochre-ink hover:bg-white/60">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <h2 className="text-xl font-bold leading-7">{reading.title}</h2>
        <p className="leading-relaxed">{reading.text}</p>
        {reading.source && (
          <div className="flex gap-2.5 rounded-xl bg-white px-3.5 py-3">
            <BookOpen className="mt-0.5 h-5 w-5 flex-none text-neema-ochre-ink" />
            <p className="italic">{reading.source}</p>
          </div>
        )}
        {shared && <p role="status" className="text-[15px] font-medium text-neema-success-ink">Copied — paste it into a message.</p>}
        <div className="flex items-center justify-between border-t border-[#F0DDBA] pt-2">
          <button type="button" aria-label="Previous" disabled={index === 0} onClick={() => setIndex(index - 1)} className="flex h-12 w-12 items-center justify-center rounded-full disabled:opacity-40"><ChevronLeft className="h-6 w-6" /></button>
          <span className="text-[15px] font-medium text-neema-ochre-ink">{index + 1} of {list.length}</span>
          <button type="button" aria-label="Next" disabled={index >= list.length - 1} onClick={() => setIndex(index + 1)} className="flex h-12 w-12 items-center justify-center rounded-full disabled:opacity-40"><ChevronRight className="h-6 w-6" /></button>
        </div>
      </section>

      <section className="flex flex-col items-center gap-3 rounded-2xl bg-neema-dark p-6 text-center text-white shadow-neema-hero">
        <Heart className="h-7 w-7" />
        <p className="text-lg font-semibold leading-7">“{AFFIRMATIONS[aff]}”</p>
        <button type="button" onClick={() => setAff((aff + 1) % AFFIRMATIONS.length)} className="flex min-h-[48px] items-center gap-1 rounded-xl bg-white/15 px-4 font-semibold">
          Next affirmation <ChevronRight className="h-5 w-5" />
        </button>
      </section>

      <BreathingExercise />

      <Card className="flex flex-col gap-2">
        <H2>When it feels like too much</H2>
        <p>Feeling low or anxious for more than two weeks is common in pregnancy and after birth, and it can be treated. Tell your midwife or health worker.</p>
        <p>If you think about harming yourself or your baby, get help now.</p>
        <a href="tel:119" className="mt-1 flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-neema-sos bg-neema-sos-soft font-semibold text-neema-sos">
          <Phone className="h-5 w-5" />Call 119 now
        </a>
      </Card>
    </div>
  );
}
