import { useState } from 'react';
import { ArrowLeft, ShieldCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { CheckBox, SwitchRow } from '@/neema/ui';

interface ConsentScreenProps {
  role: 'mother' | 'partner';
  onAccept: (choices: { sms: boolean; partnerSharing: boolean }) => Promise<void> | void;
  onBack: () => void;
}

// TODO: legal review of this text (Cameroon Law No. 2024/017 on personal data protection).
const NOTICE = [
  { title: 'What we collect', text: 'Your name, email, pregnancy dates, the health information you choose to enter (such as blood group or conditions), and how you use Neema.' },
  { title: 'Why', text: 'To give you guidance for your stage, reminders, and help when something feels wrong. Never for advertising.' },
  { title: 'Who can see it', text: 'Only you. A partner or support person sees only what you choose to share. Neema never sells your data.' },
  { title: 'Your rights', text: 'You can download your data or ask us to delete it at any time from Profile › My data.' },
  { title: 'Not medical advice', text: 'Neema is an education and navigation tool. It does not diagnose or prescribe. Always consult a qualified health worker.' },
];

export function ConsentScreen({ role, onAccept, onBack }: ConsentScreenProps) {
  const [terms, setTerms] = useState(false);
  const [health, setHealth] = useState(false);
  const [sms, setSms] = useState(true);
  const [partnerSharing, setPartnerSharing] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const ready = terms && health;

  const accept = async () => {
    if (!ready) return;
    setSaving(true);
    setError('');
    try {
      await onAccept({ sms, partnerSharing });
    } catch {
      setError('We couldn’t save your choices. Check your connection and try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans [&_h2]:tracking-normal">
      <div className="neema-rise mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-5 pb-8 pt-3">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark hover:bg-neema-sand">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
        </header>

        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">Your privacy</div>
          <h1 className="mt-2 text-3xl font-bold leading-tight">Your data, your choice</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">Before we start, please read how Neema looks after your information.</p>
        </div>

        <section className="flex flex-col rounded-2xl bg-white p-5 shadow-neema-card">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 flex-none text-neema-success-ink" />
            <p>Your health data is encrypted and handled under Cameroon’s Law No. 2024/017 on personal data protection.</p>
          </div>
          <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="mt-3 flex min-h-[48px] items-center justify-between rounded-xl bg-neema-cream px-4 font-semibold text-neema-dark">
            Read the privacy notice
            <ChevronDown className={cn('h-5 w-5 transition-transform', open && 'rotate-180')} />
          </button>
          {open && (
            <dl className="mt-3 flex flex-col gap-3">
              {NOTICE.map((n) => (
                <div key={n.title}>
                  <dt className="font-semibold">{n.title}</dt>
                  <dd className="text-neema-muted-strong">{n.text}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <section className="flex flex-col gap-1 rounded-2xl bg-white p-5 shadow-neema-card">
          <h2 className="text-lg font-semibold">Required to use Neema</h2>
          <button type="button" aria-pressed={terms} onClick={() => setTerms(!terms)} className="flex min-h-[60px] items-start gap-3 py-2 text-left">
            <span className="mt-0.5"><CheckBox on={terms} /></span>
            <span>I have read the privacy notice and accept Neema’s terms of use.</span>
          </button>
          <button type="button" aria-pressed={health} onClick={() => setHealth(!health)} className="flex min-h-[60px] items-start gap-3 py-2 text-left">
            <span className="mt-0.5"><CheckBox on={health} /></span>
            <span>I agree that Neema may store the health information I enter, to give me guidance for my stage.</span>
          </button>
        </section>

        <section className="flex flex-col rounded-2xl bg-white px-5 py-4 shadow-neema-card">
          <h2 className="mb-1 text-lg font-semibold">Optional — change any time</h2>
          <SwitchRow label="Reminders by SMS" sub="Visit and tablet reminders, even without data" on={sms} onToggle={() => setSms(!sms)} className="min-h-[68px] border-b border-neema-line py-2.5" />
          {role === 'mother' && (
            <SwitchRow label="Share pregnancy updates with a partner" sub="Only after you invite someone. Off by default." on={partnerSharing} onToggle={() => setPartnerSharing(!partnerSharing)} className="min-h-[68px] py-2.5" />
          )}
        </section>

        {error && <p role="alert" className="rounded-xl bg-neema-primary-soft px-4 py-3 font-medium text-neema-dark">{error}</p>}

        <button
          type="button"
          disabled={!ready || saving}
          onClick={accept}
          className="mt-auto min-h-[56px] w-full rounded-xl bg-neema-dark text-lg font-semibold text-white shadow-neema-hero active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Agree and continue'}
        </button>
        {!ready && <p className="-mt-2 text-center text-[15px] text-neema-muted-strong">Tick both required boxes to continue.</p>}
      </div>
    </div>
  );
}
