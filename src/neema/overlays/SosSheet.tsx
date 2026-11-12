import { useState } from 'react';
import { X, Phone, Mail, Check, MapPin } from 'lucide-react';
import { CONTACTS, FACILITIES } from '../data';
import { useNeema } from '../store';
import { CheckBox, H2 } from '../ui';

const mapsLink = (name: string, area: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${area}, Cameroon`)}`;

export function SosSheet({ firstName }: { firstName: string }) {
  const s = useNeema();
  const [picked, setPicked] = useState<Record<string, boolean>>({ paul: true, rose: true });
  const [sent, setSent] = useState(false);
  const n = CONTACTS.filter((c) => picked[c.id]).length;
  const reason = s.dangerWord ? ` Reason: ${s.dangerWord}.` : '';
  const sms = `URGENT from ${firstName} via Neema: I need help now.${reason} My location: ${s.city} (GPS link). Please call me or come.`;
  const close = () => { s.setSosOpen(false); s.setDangerWord(''); };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-neema-ink/50">
      <div role="dialog" aria-modal="true" aria-label="Emergency SOS" className="flex max-h-[96%] flex-col overflow-y-auto [&>*]:shrink-0 rounded-t-3xl bg-white">
        <div className="flex items-center justify-between rounded-t-3xl bg-neema-sos py-4 pl-5 pr-4 text-white">
          <div>
            <div className="text-[13px] font-bold leading-[18px] tracking-[0.08em]">EMERGENCY</div>
            <h2 className="text-2xl font-bold leading-8">Get help now</h2>
          </div>
          <button type="button" aria-label="Close SOS" onClick={close} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <X className="h-[22px] w-[22px]" />
          </button>
        </div>
        <div className="flex flex-col gap-3.5 p-4">
          {s.dangerWord && (
            <div role="status" className="flex flex-col gap-1 rounded-2xl bg-neema-primary-soft px-4 py-3.5">
              <div className="font-semibold">You’re taking the right step.</div>
              <div className="text-[15px] leading-[22px]">Your alert will mention {s.dangerWord}. Choose who to call, or let the people closest to you know.</div>
            </div>
          )}

          <a href="tel:119" className="flex min-h-[72px] items-center gap-3.5 rounded-2xl bg-neema-sos px-[18px] text-white">
            <Phone className="h-7 w-7" />
            <span className="flex flex-col"><span className="text-xl font-bold leading-[26px]">Call 119 · SAMU ambulance</span><span className="text-sm leading-5">Free from any phone</span></span>
          </a>
          <div className="grid grid-cols-3 gap-2">
            {[['117', 'Police'], ['118', 'Fire'], ['112', 'General']].map(([num, label]) => (
              <a key={num} href={`tel:${num}`} className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-neema-line bg-white text-[15px] font-semibold leading-5">
                <span className="text-lg font-bold">{num}</span>{label}
              </a>
            ))}
          </div>

          <section className="flex flex-col gap-2.5 rounded-2xl border border-neema-line px-4 py-3.5">
            <H2>Alert my people by SMS</H2>
            {CONTACTS.map((c) => (
              <button key={c.id} type="button" aria-pressed={!!picked[c.id]} onClick={() => { setPicked({ ...picked, [c.id]: !picked[c.id] }); setSent(false); }} className="flex min-h-[52px] items-center gap-3 text-left">
                <CheckBox on={!!picked[c.id]} tone="ink" />
                <span className="flex flex-col"><span className="font-semibold">{c.name}</span><span className="text-[13px] font-medium leading-[18px] text-neema-muted">{c.role}</span></span>
              </button>
            ))}
            <div className="rounded-xl bg-neema-cream px-3 py-2.5 text-[15px] leading-[22px]">
              <div className="mb-0.5 text-[13px] font-semibold leading-[18px] text-neema-muted-strong">MESSAGE PREVIEW</div>
              {sms}
            </div>
            {sent ? (
              <div role="status" className="flex items-center gap-2.5 rounded-xl bg-neema-success-soft px-3.5 py-3 font-semibold text-neema-success-ink">
                <Check className="h-[22px] w-[22px]" strokeWidth={2.5} />Alert sent to {n} {n === 1 ? 'contact' : 'contacts'} with your location.
              </div>
            ) : (
              // TODO: send through the SMS gateway with the device's GPS location (works without data).
              <button type="button" disabled={!n} onClick={() => setSent(true)} className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-neema-ink font-semibold tracking-wide text-white disabled:opacity-50">
                <Mail className="h-5 w-5" />{n ? `SEND ALERT TO ${n} ${n === 1 ? 'CONTACT' : 'CONTACTS'}` : 'CHOOSE A CONTACT'}
              </button>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <H2>Nearest maternity facilities</H2>
            {/* TODO: sort by real GPS distance from the facility directory. */}
            {FACILITIES.map((f) => (
              <div key={f.name} className="flex items-center gap-3 rounded-2xl border border-neema-line py-3 pl-4 pr-3">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-[22px]">{f.name}</div>
                  <div className="text-[13px] font-medium leading-[18px] text-neema-muted">{f.area} · {f.note}</div>
                </div>
                <a href={mapsLink(f.name, f.area)} target="_blank" rel="noreferrer" aria-label={`Directions to ${f.name}`} className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[14px] bg-neema-primary-soft text-neema-dark">
                  <MapPin className="h-[22px] w-[22px]" />
                </a>
              </div>
            ))}
          </section>
          <p className="mb-2 text-[13px] font-medium leading-[18px] text-neema-muted">Without data, the SMS is sent from your phone. Your location is shared only in this alert.</p>
        </div>
      </div>
    </div>
  );
}
