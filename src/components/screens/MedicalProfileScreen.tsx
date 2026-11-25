import { useState } from 'react';
import { ArrowLeft, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import type { MedicalProfile } from '@/lib/account';
import { CheckBox } from '@/neema/ui';

export type MedicalInput = Omit<MedicalProfile, 'user_id' | 'updated_at'>;

interface MedicalProfileScreenProps {
  initial: Partial<MedicalInput> | null;
  /** 'setup' shows the full-page sign-up step with Skip; 'edit' is used inside the app. */
  mode: 'setup' | 'edit';
  onSave: (data: MedicalInput) => Promise<void> | void;
  onSkip?: () => void;
  onBack?: () => void;
}

const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'];
const GENOTYPES = ['AA', 'AS', 'SS', 'AC', 'SC', 'unknown'];
const CONDITIONS = ['High blood pressure', 'Diabetes', 'Sickle cell disease', 'HIV', 'Hepatitis B', 'Epilepsy', 'Asthma', 'Heart condition'];

const label = 'mb-1.5 block text-[15px] font-semibold';
const input = 'min-h-[52px] w-full rounded-xl border border-neema-border bg-white px-4 text-base text-neema-ink focus:border-neema-primary focus:outline-none focus:ring-2 focus:ring-neema-primary/30';

function Chips({ options, value, onChange, name }: { options: string[]; value: string | null | undefined; onChange: (v: string) => void; name: string }) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn('min-h-[48px] min-w-[56px] rounded-full border px-4 font-semibold', value === o ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}
        >
          {o === 'unknown' ? 'I don’t know' : o}
        </button>
      ))}
    </div>
  );
}

export function MedicalProfileScreen({ initial, mode, onSave, onSkip, onBack }: MedicalProfileScreenProps) {
  const [f, setF] = useState<MedicalInput>({
    date_of_birth: initial?.date_of_birth ?? null,
    blood_group: initial?.blood_group ?? null,
    genotype: initial?.genotype ?? null,
    previous_pregnancies: initial?.previous_pregnancies ?? null,
    previous_births: initial?.previous_births ?? null,
    previous_caesarean: initial?.previous_caesarean ?? null,
    conditions: initial?.conditions ?? [],
    allergies: initial?.allergies ?? null,
    current_medicines: initial?.current_medicines ?? null,
    facility_name: initial?.facility_name ?? null,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const set = <K extends keyof MedicalInput>(k: K, v: MedicalInput[K]) => { setF((x) => ({ ...x, [k]: v })); setMessage(''); };
  const num = (v: string) => (v === '' ? null : Math.max(0, Math.min(20, parseInt(v, 10) || 0)));
  const toggleCondition = (c: string) => set('conditions', f.conditions.includes(c) ? f.conditions.filter((x) => x !== c) : [...f.conditions, c]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await onSave({ ...f, allergies: f.allergies?.trim() || null, current_medicines: f.current_medicines?.trim() || null, facility_name: f.facility_name?.trim() || null });
      if (mode === 'edit') setMessage('Saved.');
    } catch {
      setMessage('We couldn’t save this. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const body = (
    <div className="flex flex-col gap-4 [&>*]:shrink-0">
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-neema-card">
        <div>
          <label htmlFor="med-dob" className={label}>Date of birth</label>
          <input id="med-dob" type="date" className={input} value={f.date_of_birth ?? ''} max={new Date().toISOString().slice(0, 10)} onChange={(e) => set('date_of_birth', e.target.value || null)} />
        </div>
        <div><span className={label}>Blood group</span><Chips name="Blood group" options={BLOOD} value={f.blood_group} onChange={(v) => set('blood_group', v)} /></div>
        <div><span className={label}>Genotype</span><Chips name="Genotype" options={GENOTYPES} value={f.genotype} onChange={(v) => set('genotype', v)} /></div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-neema-card">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="med-preg" className={label}>Past pregnancies</label>
            <input id="med-preg" type="number" inputMode="numeric" min={0} max={20} className={input} value={f.previous_pregnancies ?? ''} onChange={(e) => set('previous_pregnancies', num(e.target.value))} />
          </div>
          <div>
            <label htmlFor="med-births" className={label}>Past births</label>
            <input id="med-births" type="number" inputMode="numeric" min={0} max={20} className={input} value={f.previous_births ?? ''} onChange={(e) => set('previous_births', num(e.target.value))} />
          </div>
        </div>
        <div>
          <span className={label}>Have you had a caesarean before?</span>
          <div role="radiogroup" aria-label="Previous caesarean" className="grid grid-cols-2 gap-2">
            {[{ v: true, l: 'Yes' }, { v: false, l: 'No' }].map((o) => (
              <button key={o.l} type="button" role="radio" aria-checked={f.previous_caesarean === o.v} onClick={() => set('previous_caesarean', o.v)}
                className={cn('min-h-[48px] rounded-xl border font-semibold', f.previous_caesarean === o.v ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-1 rounded-2xl bg-white p-5 shadow-neema-card">
        <span className={label}>Long-term conditions</span>
        {CONDITIONS.map((c) => (
          <button key={c} type="button" aria-pressed={f.conditions.includes(c)} onClick={() => toggleCondition(c)} className="flex min-h-[52px] items-center gap-3 border-b border-neema-line text-left last:border-0">
            <CheckBox on={f.conditions.includes(c)} />{c}
          </button>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-neema-card">
        <div>
          <label htmlFor="med-allergies" className={label}>Allergies</label>
          <input id="med-allergies" className={input} placeholder="e.g. penicillin" value={f.allergies ?? ''} onChange={(e) => set('allergies', e.target.value)} maxLength={500} />
        </div>
        <div>
          <label htmlFor="med-meds" className={label}>Medicines you take now</label>
          <input id="med-meds" className={input} placeholder="e.g. iron and folic acid" value={f.current_medicines ?? ''} onChange={(e) => set('current_medicines', e.target.value)} maxLength={500} />
        </div>
        <div>
          <label htmlFor="med-facility" className={label}>Where you plan to give birth</label>
          <input id="med-facility" className={input} placeholder="e.g. Hôpital Laquintinie, Douala" value={f.facility_name ?? ''} onChange={(e) => set('facility_name', e.target.value)} maxLength={160} />
        </div>
      </section>

      {message && <p role="status" className={cn('rounded-xl px-4 py-3 font-medium', message === 'Saved.' ? 'bg-neema-success-soft text-neema-success-ink' : 'bg-neema-primary-soft text-neema-dark')}>{message}</p>}
      <button type="button" onClick={save} disabled={saving} className="min-h-[56px] w-full rounded-xl bg-neema-dark text-lg font-semibold text-white shadow-neema-hero active:scale-[0.98] disabled:opacity-60">
        {saving ? 'Saving…' : mode === 'setup' ? 'Save and continue' : 'Save changes'}
      </button>
      {onSkip && <button type="button" onClick={onSkip} className="min-h-[48px] w-full font-semibold text-neema-muted-strong">Skip for now</button>}
      <p className="text-[15px] leading-[22px] text-neema-muted-strong">Only you can see this. It helps Neema give safer guidance; your health worker’s advice always comes first.</p>
    </div>
  );

  if (mode === 'edit') {
    return (
      <div className="flex flex-col gap-4 bg-neema-cream p-4 pb-8 font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans">
        <div>
          <h1 className="text-2xl font-bold leading-8">Medical profile</h1>
          <p className="mt-1 text-neema-muted-strong">Your health background. Everything is optional.</p>
        </div>
        {body}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans [&_h2]:tracking-normal">
      <div className="neema-rise mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-5 pb-8 pt-3">
        <header className="flex items-center justify-between">
          {onBack ? (
            <button type="button" onClick={onBack} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark hover:bg-neema-sand">
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
          ) : <span />}
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
        </header>
        <div>
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-neema-primary-soft text-neema-dark"><HeartPulse className="h-6 w-6" /></span>
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">Your health · optional</div>
          <h1 className="mt-2 text-3xl font-bold leading-tight">A little about your health</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">Answer what you know. You can add or change this later in your profile.</p>
        </div>
        {body}
      </div>
    </div>
  );
}
