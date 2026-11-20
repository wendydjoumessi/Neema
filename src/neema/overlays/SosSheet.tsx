import { useEffect, useState } from 'react';
import { X, Phone, Mail, MapPin, UserPlus, LocateFixed } from 'lucide-react';
import { FACILITIES } from '../data';
import { formatPhone, smsLink } from '../contacts';
import { useNeema } from '../store';
import { CheckBox, H2 } from '../ui';

const mapsLink = (name: string, area: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${area}, Cameroon`)}`;

export function SosSheet({ firstName }: { firstName: string }) {
  const s = useNeema();
  const [picked, setPicked] = useState<Record<string, boolean>>(() => Object.fromEntries(s.contacts.map((c) => [c.id, c.sms])));
  const [gps, setGps] = useState<{ state: 'finding' | 'ok' | 'none'; link?: string }>({ state: 'finding' });
  // Ask for the location as soon as SOS opens, so it is ready by the time she sends the message.
  useEffect(() => {
    if (!('geolocation' in navigator)) { setGps({ state: 'none' }); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setGps({ state: 'ok', link: `https://maps.google.com/?q=${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}` }),
      () => setGps({ state: 'none' }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);
  const chosen = s.contacts.filter((c) => picked[c.id]);
  const n = chosen.length;
  const reason = s.dangerWord ? ` Reason: ${s.dangerWord}.` : '';
  const where = gps.link ? ` My location: ${gps.link}` : s.city ? ` I am in ${s.city}.` : '';
  const sms = `URGENT from ${firstName}: I need help now.${reason}${where} Please call me or come.`;
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
            {s.contacts.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-[15px] leading-[22px] text-neema-muted-strong">You haven’t added emergency contacts yet. Add the people you would call first, so you can alert them in one tap next time.</p>
                <button type="button" onClick={() => { close(); s.setTab('profile'); window.setTimeout(() => document.getElementById('emergency-contacts')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-neema-border font-semibold text-neema-dark">
                  <UserPlus className="h-5 w-5" /> Add emergency contacts
                </button>
              </div>
            ) : (
              <>
                <ul className="flex flex-col">
                  {s.contacts.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 border-b border-neema-line last:border-b-0">
                      <button type="button" aria-pressed={!!picked[c.id]} onClick={() => setPicked({ ...picked, [c.id]: !picked[c.id] })} className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 text-left">
                        <CheckBox on={!!picked[c.id]} tone="ink" />
                        <span className="flex min-w-0 flex-col"><span className="truncate font-semibold">{c.name}</span><span className="text-[13px] font-medium leading-[18px] text-neema-muted">{[c.relationship, formatPhone(c.phone)].filter(Boolean).join(' · ')}</span></span>
                      </button>
                      <a href={`tel:${c.phone}`} aria-label={`Call ${c.name}`} className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-neema-success-soft text-neema-success-ink"><Phone className="h-5 w-5" /></a>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-neema-cream px-3 py-2.5 text-[15px] leading-[22px]">
                  <div className="mb-0.5 text-[13px] font-semibold leading-[18px] text-neema-muted-strong">MESSAGE PREVIEW</div>
                  {sms}
                  <div role="status" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium leading-[18px] text-neema-muted-strong">
                    <LocateFixed className="h-4 w-4" />
                    {gps.state === 'finding' ? 'Finding your location…' : gps.state === 'ok' ? 'Your GPS location is included.' : 'Location not available. Allow location for Neema to include it.'}
                  </div>
                </div>
                {n ? (
                  <a href={smsLink(chosen.map((c) => c.phone), sms)} className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-neema-ink font-semibold tracking-wide text-white">
                    <Mail className="h-5 w-5" />SEND SMS TO {n} {n === 1 ? 'CONTACT' : 'CONTACTS'}
                  </a>
                ) : (
                  <button type="button" disabled className="min-h-[56px] rounded-xl bg-neema-ink font-semibold tracking-wide text-white opacity-50">CHOOSE A CONTACT</button>
                )}
                <p className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">Opens your messages app with the text ready: press send. Standard SMS rates apply; no internet needed.</p>
              </>
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
          <p className="mb-2 text-[13px] font-medium leading-[18px] text-neema-muted">Your location is shared only in the message you send.</p>
        </div>
      </div>
    </div>
  );
}
