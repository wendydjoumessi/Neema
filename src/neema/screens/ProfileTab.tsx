import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PregnancyData, User } from '@/types/pregnancy';
import { CONTACTS, JOURNEYS, T } from '../data';
import { useNeema } from '../store';
import type { ExtraScreen } from '../NeemaApp';
import { Card, H1, H2, OutlineButton, PrimaryButton, Segmented, SwitchRow } from '../ui';
import { fmtDate } from '../format';

export function ProfileTab({
  user, pregnancy, onLogout, extras, onOpenExtra,
}: {
  user: User | null;
  pregnancy: PregnancyData;
  onLogout: () => void;
  extras: ExtraScreen[];
  onOpenExtra: (id: string) => void;
}) {
  const s = useNeema();
  const t = T[s.lang];
  const [editing, setEditing] = useState(false);
  const [cityDraft, setCityDraft] = useState(s.city);
  const [exported, setExported] = useState(false);
  const [del, setDel] = useState<0 | 1 | 2>(0);
  const [chatsDeleted, setChatsDeleted] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinDraft, setPinDraft] = useState('');
  const [pinSaved, setPinSaved] = useState(false);
  const name = user?.name || 'Amina';
  const initials = name.split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();

  const facts = [
    { k: 'Email', v: user?.email || '—' },
    { k: 'Due date', v: fmtDate(new Date(pregnancy.dueDate)) },
    { k: 'Week', v: String(pregnancy.currentWeek) },
    { k: 'Trimester', v: String(pregnancy.trimester) },
  ];

  const privacy = [
    { key: 'disc', label: 'Discreet mode', sub: 'Neutral app name (“Notes”) and lock-screen messages', on: s.discreet, toggle: () => s.setDiscreet(!s.discreet) },
    { key: 'pin', label: 'PIN lock', sub: 'Locks Neema after 2 minutes in the background', on: s.pinLock, toggle: () => s.setPinLock(!s.pinLock) },
    { key: 'sp', label: 'Share pregnancy updates with my partner', sub: 'Weekly progress and visit reminders only', on: s.sharePreg, toggle: () => s.setSharePreg(!s.sharePreg) },
    { key: 'sf', label: 'Share family planning with my partner', sub: 'Off by default. Only you can turn this on.', on: s.shareFp, toggle: () => s.setShareFp(!s.shareFp) },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4">
      <div className="flex items-center gap-2">
        <button type="button" aria-label={t.back} onClick={() => s.setTab('home')} className="-ml-1 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <ChevronLeft className="h-[22px] w-[22px]" />
        </button>
        <H1>{t.profile}</H1>
      </div>

      <Card className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3.5">
          <div aria-hidden="true" className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-neema-primary-soft text-2xl font-bold text-neema-dark">{initials}</div>
          <div className="min-w-0">
            <div className="text-lg font-semibold leading-6">{name}</div>
            <div className="text-neema-muted">{s.city}</div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-2.5">
          {facts.map((f) => (
            <div key={f.k} className="min-w-0 rounded-xl bg-neema-cream px-3 py-2.5">
              <dt className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{f.k}</dt>
              <dd className="break-words font-semibold">{f.v}</dd>
            </div>
          ))}
        </dl>
        {editing && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="neema-city" className="text-sm font-semibold">Neighbourhood and city</label>
            <input id="neema-city" value={cityDraft} onChange={(e) => setCityDraft(e.target.value)} className="h-[52px] rounded-xl border border-neema-border px-3.5 text-base" />
          </div>
        )}
        {editing ? (
          <PrimaryButton onClick={() => { s.setCity(cityDraft.trim() || s.city); setEditing(false); }} className="min-h-[48px]">Save changes</PrimaryButton>
        ) : (
          <OutlineButton onClick={() => { setCityDraft(s.city); setEditing(true); }}>Edit profile</OutlineButton>
        )}
      </Card>

      <Card className="flex flex-col gap-2 px-5 pb-5 pt-4">
        <H2 className="mb-1">{t.journey}</H2>
        <div role="radiogroup" aria-label={t.journey} className="flex flex-col gap-2">
          {JOURNEYS.map((j) => {
            const on = j.id === s.journey;
            return (
              <button key={j.id} type="button" role="radio" aria-checked={on} onClick={() => s.setJourney(j.id as typeof s.journey)} className={cn('flex min-h-[60px] items-center gap-3 rounded-[14px] border-2 px-3.5 py-2 text-left', on ? 'border-neema-dark bg-neema-primary-soft' : 'border-neema-line bg-white')}>
                <span aria-hidden="true" className={cn('flex h-6 w-6 flex-none items-center justify-center rounded-full border-2', on ? 'border-neema-dark' : 'border-neema-border')}>
                  {on && <span className="h-3 w-3 rounded-full bg-neema-dark" />}
                </span>
                <span className="flex flex-col"><span className="font-semibold">{j.label}</span><span className="text-sm leading-5 text-neema-muted">{j.sub}</span></span>
              </button>
            );
          })}
        </div>
        {s.journey === 'avoid' && !s.discreet && (
          <div className="flex flex-col gap-2 rounded-xl bg-neema-lilac px-3.5 py-3">
            <div className="text-[15px] leading-[22px]">We recommend discreet mode for this journey, especially on a shared phone.</div>
            <button type="button" onClick={() => s.setDiscreet(true)} className="min-h-[48px] rounded-xl bg-neema-ink font-semibold text-white">Turn on discreet mode</button>
          </div>
        )}
      </Card>

      <Card className="flex flex-col px-5 py-4">
        <H2 className="mb-1">{t.privacy}</H2>
        {privacy.map((p) => (
          <SwitchRow key={p.key} label={p.label} sub={p.sub} on={p.on} onToggle={p.toggle} className="min-h-[68px] border-b border-neema-line py-2.5" />
        ))}
      </Card>

      <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <H2>{t.language}</H2>
        <Segmented role="radiogroup" label={t.language} value={s.lang} onChange={s.setLang} options={[{ id: 'en', label: 'English' }, { id: 'fr', label: 'Français' }]} />
        <p className="text-sm leading-5 text-neema-muted">Neema content and Ask Neema answers are available in English and French. Pidgin is planned for v1.1.</p>
      </Card>

      {extras.length > 0 && (
        <Card className="flex flex-col px-5 py-4">
          <H2 className="mb-1">More from Neema</H2>
          {extras.map((e) => (
            <button key={e.id} type="button" onClick={() => onOpenExtra(e.id)} className="flex min-h-[60px] items-center justify-between gap-3 border-b border-neema-line py-2 text-left">
              <span className="flex flex-col"><span className="font-semibold">{e.label}</span><span className="text-sm leading-5 text-neema-muted">{e.description}</span></span>
              <ChevronRight className="h-5 w-5 flex-none text-neema-muted" />
            </button>
          ))}
        </Card>
      )}

      <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <H2>{t.contacts}</H2>
        {/* TODO: load the user's saved emergency contacts. */}
        {CONTACTS.map((c) => (
          <div key={c.id} className="flex min-h-[48px] items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neema-cream font-bold">{c.name.charAt(0)}</span>
            <span className="flex flex-col"><span className="font-semibold">{c.name}</span><span className="text-[13px] font-medium leading-[18px] text-neema-muted">{c.role}</span></span>
          </div>
        ))}
      </Card>

      <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <H2>{t.data}</H2>
        {/* TODO: connect export and deletion to the back end (Law No. 2024/017 data rights). */}
        <OutlineButton onClick={() => setExported(true)} className="min-h-[56px]"><Download className="h-5 w-5" />{t.export}</OutlineButton>
        {exported && <div role="status" className="rounded-xl bg-neema-success-soft px-3 py-2.5 text-[15px] font-medium leading-[22px] text-neema-success-ink">We’re preparing your data file: profile, pregnancy log, habits and settings.</div>}
        <OutlineButton onClick={() => { s.setMessages([]); setChatsDeleted(true); }} className="min-h-[56px]">
          {chatsDeleted ? 'Ask Neema chats deleted' : 'Delete my Ask Neema chats'}
        </OutlineButton>
        {del === 0 && (
          <button type="button" onClick={() => setDel(1)} className="min-h-[56px] rounded-xl border-2 border-neema-dark bg-white font-semibold text-neema-dark">{t.deleteAll}</button>
        )}
        {del === 1 && (
          <div role="alertdialog" aria-label="Confirm deletion" className="flex flex-col gap-2.5 rounded-xl border-2 border-neema-dark px-3.5 py-3">
            <div className="font-semibold">Delete your account and all your data?</div>
            <div className="text-[15px] leading-[22px] text-neema-muted">This removes your profile, logs, Ask Neema chats and partner links. It can’t be undone.</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDel(0)} className="min-h-[48px] flex-1 rounded-xl border border-neema-border bg-white font-semibold">Cancel</button>
              <button type="button" onClick={() => setDel(2)} className="min-h-[48px] flex-1 rounded-xl bg-neema-dark font-semibold text-white">Delete</button>
            </div>
          </div>
        )}
        {del === 2 && <div role="status" className="rounded-xl bg-neema-cream px-3 py-2.5 text-[15px] leading-[22px]">Deletion requested. Your data will be erased within 30 days.</div>}
        <p className="text-[13px] font-medium leading-[18px] text-neema-muted">Your health data is encrypted and handled under Cameroon’s Law No. 2024/017 on personal data protection. Neema never sells your data or shows ads.</p>
      </Card>

      <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <H2>{t.security}</H2>
        <OutlineButton onClick={() => { setPinOpen(!pinOpen); setPinSaved(false); setPinDraft(''); }} className="min-h-[56px]">Change my PIN</OutlineButton>
        {pinOpen && (
          <div className="flex flex-col gap-1.5 rounded-xl bg-neema-cream p-3">
            <label htmlFor="neema-pin" className="text-sm font-semibold">New 4-digit PIN</label>
            <div className="flex gap-2">
              <input id="neema-pin" type="password" inputMode="numeric" maxLength={4} value={pinDraft} onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))} className="h-[52px] min-w-0 flex-1 rounded-xl border border-neema-border bg-white px-3.5 text-xl tracking-[0.4em]" />
              {/* TODO: store the PIN securely on the device. */}
              <button type="button" disabled={pinDraft.length !== 4} onClick={() => { setPinOpen(false); setPinSaved(true); s.setPinLock(true); }} className="min-h-[52px] min-w-[88px] rounded-xl bg-neema-dark font-semibold text-white disabled:opacity-50">Save</button>
            </div>
          </div>
        )}
        {pinSaved && <div role="status" className="rounded-xl bg-neema-success-soft px-3 py-2.5 text-[15px] font-semibold leading-[22px] text-neema-success-ink">PIN updated. Neema will ask for it after 2 minutes in the background.</div>}
        <button type="button" onClick={onLogout} className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 border-neema-ink bg-white font-semibold tracking-wide">
          <LogOut className="h-5 w-5" />LOG OUT
        </button>
        <p className="text-[13px] font-medium leading-[18px] text-neema-muted">Neema 1.0 · Educational information only. Neema is not a doctor or midwife and does not diagnose.</p>
      </Card>
    </div>
  );
}
