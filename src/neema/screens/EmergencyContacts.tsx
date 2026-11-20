import { FormEvent, useState } from 'react';
import { Phone, Pencil, Plus, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { emergencyContactSchema, fieldErrors } from '@/lib/form-validation';
import { MAX_CONTACTS, RELATIONSHIPS, formatPhone, newContactId, type EmergencyContact } from '../contacts';
import { useNeema } from '../store';
import { Card, H2, SwitchRow } from '../ui';

type Draft = { id: string | null; name: string; relationship: string; phone: string; sms: boolean };
const empty: Draft = { id: null, name: '', relationship: '', phone: '', sms: true };
const input = 'h-[52px] w-full rounded-xl border bg-white px-3.5 text-base focus:outline-none focus:ring-2 focus:ring-neema-primary/30';

function ContactForm({ draft, onSave, onCancel, onDelete, onMakeFirst }: { draft: Draft; onSave: (c: EmergencyContact) => void; onCancel: () => void; onDelete?: () => void; onMakeFirst?: () => void }) {
  const [d, setD] = useState(draft);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const preset = RELATIONSHIPS.includes(d.relationship) ? d.relationship : d.relationship ? 'Other' : '';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = emergencyContactSchema.safeParse({ name: d.name, relationship: d.relationship, phone: d.phone, sms: d.sms });
    if (!result.success) {
      const errs = fieldErrors(result.error);
      setErrors(errs);
      document.getElementById(errs.name ? 'ec-name' : 'ec-phone')?.focus();
      return;
    }
    setErrors({});
    onSave({ id: d.id ?? newContactId(), ...(result.data as Omit<EmergencyContact, 'id'>) });
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3 rounded-2xl bg-neema-cream p-4">
      <div className="font-semibold">{draft.id ? 'Edit contact' : 'New contact'}</div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ec-name" className="font-semibold">Name</label>
        <input id="ec-name" autoComplete="name" value={d.name} maxLength={80} onChange={(e) => setD({ ...d, name: e.target.value })}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ec-name-err' : undefined}
          className={cn(input, errors.name ? 'border-neema-dark' : 'border-neema-border')} />
        {errors.name && <p id="ec-name-err" className="text-[15px] font-medium text-neema-dark">{errors.name}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <span id="ec-rel-label" className="font-semibold">Who is this? <span className="font-normal text-neema-muted-strong">(optional)</span></span>
        <div role="radiogroup" aria-labelledby="ec-rel-label" className="flex flex-wrap gap-2">
          {[...RELATIONSHIPS, 'Other'].map((r) => (
            <button key={r} type="button" role="radio" aria-checked={preset === r}
              onClick={() => setD({ ...d, relationship: r === 'Other' ? (preset === 'Other' ? d.relationship : '') : preset === r ? '' : r })}
              className={cn('min-h-[44px] rounded-full border px-3.5 text-[15px] font-semibold', preset === r ? 'border-neema-dark bg-neema-primary-soft text-neema-dark' : 'border-neema-border bg-white')}>
              {r}
            </button>
          ))}
        </div>
        {(preset === 'Other') && (
          <input aria-label="Relationship" placeholder="e.g. Aunt, pastor, midwife" value={d.relationship === 'Other' ? '' : d.relationship} maxLength={40}
            onChange={(e) => setD({ ...d, relationship: e.target.value || 'Other' })} className={cn(input, 'border-neema-border')} />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ec-phone" className="font-semibold">Phone number</label>
        <input id="ec-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="6 77 12 34 56" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })}
          aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'ec-phone-err' : 'ec-phone-hint'}
          className={cn(input, errors.phone ? 'border-neema-dark' : 'border-neema-border')} />
        {errors.phone
          ? <p id="ec-phone-err" className="text-[15px] font-medium text-neema-dark">{errors.phone}</p>
          : <p id="ec-phone-hint" className="text-[15px] text-neema-muted-strong">Cameroon numbers get +237 added. For another country, start with +.</p>}
      </div>
      <div className="rounded-xl bg-white px-3">
        <SwitchRow label="Include in SOS alerts" sub="Ticked automatically when you send an SOS message" on={d.sms} onToggle={() => setD({ ...d, sms: !d.sms })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCancel} className="min-h-[52px] rounded-xl border border-neema-border bg-white font-semibold">Cancel</button>
        <button type="submit" className="min-h-[52px] rounded-xl bg-neema-dark font-semibold text-white">Save</button>
      </div>
      {onMakeFirst && (
        <button type="button" onClick={onMakeFirst} className="min-h-[48px] rounded-xl border border-neema-border bg-white font-semibold">Make {draft.name} the first to call</button>
      )}
      {onDelete && (
        confirmDelete ? (
          <div role="alert" className="flex flex-col gap-2 rounded-xl bg-white p-3">
            <span>Remove {draft.name} from your emergency contacts?</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmDelete(false)} className="min-h-[48px] rounded-xl border border-neema-border font-semibold">Keep</button>
              <button type="button" onClick={onDelete} className="min-h-[48px] rounded-xl border-2 border-neema-dark font-semibold text-neema-dark">Remove</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="min-h-[48px] font-semibold text-neema-dark">Remove this contact</button>
        )
      )}
    </form>
  );
}

/** Profile card: the people Neema shows in SOS, which she can add, edit, reorder and remove. */
export function EmergencyContactsCard({ title }: { title: string }) {
  const s = useNeema();
  const [editing, setEditing] = useState<Draft | null>(null);
  const list = s.contacts;
  const full = list.length >= MAX_CONTACTS;

  const save = (c: EmergencyContact) => {
    s.setContacts(list.some((x) => x.id === c.id) ? list.map((x) => (x.id === c.id ? c : x)) : [...list, c]);
    setEditing(null);
  };
  const makeFirst = (id: string) => {
    const c = list.find((x) => x.id === id);
    if (c) s.setContacts([c, ...list.filter((x) => x.id !== id)]);
    setEditing(null);
  };

  return (
    <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
      <div className="flex items-baseline justify-between gap-2">
        <H2>{title}</H2>
        <span className="text-[13px] font-semibold leading-[18px] text-neema-muted-strong">{list.length} of {MAX_CONTACTS}</span>
      </div>

      {list.length === 0 && !editing && (
        <div className="flex flex-col gap-1 rounded-xl bg-neema-cream px-3.5 py-3">
          <span className="font-semibold">No emergency contacts yet</span>
          <span className="text-[15px] leading-[22px] text-neema-muted-strong">Add the people you would call first: your partner, a relative or a neighbour who can take you to the facility. Ask them before you add them.</span>
        </div>
      )}

      {list.length > 0 && (
        <ul className="flex flex-col">
          {list.map((c, i) => (
            editing?.id === c.id ? (
              <li key={c.id} className="py-2"><ContactForm draft={{ ...c, id: c.id }} onSave={save} onCancel={() => setEditing(null)} onMakeFirst={i > 0 ? () => makeFirst(c.id) : undefined} onDelete={() => { s.setContacts(list.filter((x) => x.id !== c.id)); setEditing(null); }} /></li>
            ) : (
              <li key={c.id} className="flex items-center gap-2 border-b border-neema-line py-2 last:border-b-0">
                <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neema-primary-soft font-bold text-neema-dark">{c.name.charAt(0).toUpperCase()}</span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-semibold">{c.name}</span>
                  <span className="text-[15px] leading-[21px] text-neema-muted-strong">{[c.relationship, formatPhone(c.phone)].filter(Boolean).join(' · ')}</span>
                  {i === 0 && list.length > 1 && <span className="text-[13px] font-semibold leading-[18px] text-neema-success-ink">First to call</span>}
                  {!c.sms && <span className="text-[13px] font-medium leading-[18px] text-neema-muted">Not in SOS alerts</span>}
                </span>
                <a href={`tel:${c.phone}`} aria-label={`Call ${c.name}`} className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-neema-success-soft text-neema-success-ink"><Phone className="h-5 w-5" /></a>
                <button type="button" aria-label={`Edit ${c.name}`} onClick={() => setEditing({ ...c, id: c.id })} className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-neema-border"><Pencil className="h-5 w-5" /></button>
              </li>
            )
          ))}
        </ul>
      )}

      {editing && editing.id === null && <ContactForm draft={editing} onSave={save} onCancel={() => setEditing(null)} />}

      {!editing && (
        full ? <p className="text-[15px] text-neema-muted-strong">You’ve added the maximum of {MAX_CONTACTS}. Remove one to add someone else.</p> : (
          <button type="button" onClick={() => setEditing({ ...empty })} className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neema-border font-semibold text-neema-dark">
            {list.length ? <Plus className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />} Add a contact
          </button>
        )
      )}
    </Card>
  );
}
