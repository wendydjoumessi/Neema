import { X, ChevronLeft, ChevronRight, HeartHandshake, Phone } from 'lucide-react';
import { LEVELS, SYMPTOMS } from '../data';
import { useNeema } from '../store';
import { Disclaimer } from '../ui';

type Result = { level: keyof typeof LEVELS; lead: string; why: string; steps: string[] };

/**
 * Symptom checker. Results always lead with calm guidance, then next steps, then a way to reach care.
 * The rules are fixed and clinician-approved, never AI-generated.
 */
export function SymptomSheet() {
  const s = useNeema();
  let r: Result | null = null;
  if (s.symptomResult === 'chat') {
    r = {
      level: 'now',
      lead: 'Thank you for telling Neema. Asking for help early is the safest thing you can do.',
      why: `You mentioned ${s.dangerWord || 'a possible danger sign'}. Neema can’t check this in a chat, but a midwife can, and it is best done today, as soon as you can.`,
      steps: [
        'Go to your maternity unit now, or call it first if you are unsure.',
        'Ask someone to go with you, and bring your antenatal card.',
        'If you feel very unwell, use SOS to call 119 and alert your family.',
      ],
    };
  } else if (s.symptomResult) {
    r = (SYMPTOMS.find((x) => x.id === s.symptomResult) as Result) ?? null;
  }
  const lv = r ? LEVELS[r.level] : null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-neema-ink/40">
      <div role="dialog" aria-modal="true" aria-label="Symptom checker" className="flex max-h-[94%] flex-col gap-3 overflow-y-auto [&>*]:shrink-0 rounded-t-3xl bg-white px-4 pb-6 pt-5">
        <div className="flex items-center justify-between gap-2">
          {r && (
            <button type="button" aria-label="Back to symptom list" onClick={() => { s.setSymptomResult(null); s.setDangerWord(''); }} className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-neema-cream">
              <ChevronLeft className="h-[22px] w-[22px]" />
            </button>
          )}
          <h2 className="flex-1 text-2xl font-bold leading-8">{r ? 'Here’s what to do' : 'Check a symptom'}</h2>
          <button type="button" aria-label="Close symptom checker" onClick={() => s.setSymptomOpen(false)} className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-neema-cream">
            <X className="h-[22px] w-[22px]" />
          </button>
        </div>

        {!r && (
          <div className="flex flex-col gap-2.5">
            <p>How are you feeling today? Tap what feels closest. This checker works offline.</p>
            {SYMPTOMS.map((sy) => (
              <button key={sy.id} type="button" onClick={() => { s.setSymptomResult(sy.id); s.setDangerWord(sy.word); }} className="flex min-h-[56px] items-center justify-between gap-3 rounded-[14px] border border-neema-line bg-white px-4 text-left font-medium">
                <span>{sy.label}</span>
                <ChevronRight className="h-5 w-5 text-neema-muted" />
              </button>
            ))}
          </div>
        )}

        {r && lv && (
          <div role="status" className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-2xl bg-neema-success-soft px-4 py-3.5 text-neema-success-ink">
              <HeartHandshake className="h-[26px] w-[26px] flex-none" />
              <span className="font-semibold">{r.lead}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="self-start rounded-full px-3 py-[3px] text-[13px] font-bold leading-[18px] tracking-[0.04em]" style={{ background: lv.bg, color: lv.ink }}>{lv.label}</span>
              <p>{r.why}</p>
            </div>
            <div className="rounded-2xl bg-neema-cream px-4 py-3.5">
              <div className="mb-1.5 font-semibold">What you can do</div>
              <ul className="flex list-disc flex-col gap-1.5 pl-5">
                {r.steps.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
            {/* TODO: add a "Call my facility" button using the user's registered facility and its phone number. */}
            {r.level === 'now' && (
              <a href="tel:119" className="flex min-h-[56px] items-center justify-center gap-2 rounded-[14px] bg-neema-dark font-semibold text-white">
                <Phone className="h-5 w-5" />Call 119 for an ambulance
              </a>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => s.openSos(s.dangerWord)} className="min-h-[52px] flex-1 rounded-[14px] border border-neema-border bg-white text-[15px] font-semibold">Nearest facilities</button>
              <button type="button" onClick={() => s.openSos(s.dangerWord)} className="min-h-[52px] min-w-[96px] flex-none rounded-[14px] border-[1.5px] border-neema-sos bg-neema-sos-soft text-[15px] font-bold tracking-[0.04em] text-neema-sos">Use SOS</button>
            </div>
            <button type="button" onClick={() => { s.setSymptomOpen(false); s.setTab('ask'); }} className="min-h-[48px] font-semibold text-neema-dark underline">Ask Neema about this</button>
          </div>
        )}
        <Disclaimer className="mt-1 text-[15px] leading-[22px] text-neema-ink" />
      </div>
    </div>
  );
}
