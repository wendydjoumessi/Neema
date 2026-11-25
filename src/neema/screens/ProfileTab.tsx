import { useState } from 'react';
import {
  ChevronLeft, Download, LogOut, Check, MessageSquareX, KeyRound, EyeOff, Lock, Users, CalendarHeart, NotebookText, Sparkles, Stethoscope, Pill, CalendarDays, Timer, HeartHandshake, UserRound,
} from 'lucide-react';
import emblem from '@/assets/neema-emblem.png';
import { methodStatus, fmtShort } from '../cycle';
import { ListRow, Reveal } from '../motion';
import { MotherBabyArt, PregnantArt, ShieldArt, TryingArt } from '../art';

const JOURNEY_ART = { ttc: TryingArt, preg: PregnantArt, pp: MotherBabyArt, avoid: ShieldArt };
const EXTRA_ICON: Record<string, { Icon: typeof Sparkles; tint: string }> = {
  body: { Icon: Sparkles, tint: 'bg-neema-lilac text-[#4A3F6B]' },
  medical: { Icon: Stethoscope, tint: 'bg-neema-success-soft text-neema-success-ink' },
  medicines: { Icon: Pill, tint: 'bg-neema-primary-soft text-neema-dark' },
  tracking: { Icon: CalendarDays, tint: 'bg-neema-ochre-soft text-neema-ochre-ink' },
  labour: { Icon: Timer, tint: 'bg-neema-primary-soft text-neema-dark' },
  spiritual: { Icon: HeartHandshake, tint: 'bg-neema-lilac text-[#4A3F6B]' },
  partner: { Icon: UserRound, tint: 'bg-neema-success-soft text-neema-success-ink' },
};
import { cn } from '@/lib/utils';
import type { PregnancyData, User } from '@/types/pregnancy';
import { JOURNEYS, T } from '../data';
import { EmergencyContactsCard } from './EmergencyContacts';
import { useNeema } from '../store';
import type { AccountActions, ExtraScreen } from '../NeemaApp';
import { Card, H1, H2, Segmented, SwitchRow } from '../ui';
import { fmtDate } from '../format';

export function ProfileTab({
  user, pregnancy, onLogout, extras, onOpenExtra, extraFacts = [], account,
}: {
  user: User | null;
  pregnancy: PregnancyData;
  onLogout: () => void;
  extras: ExtraScreen[];
  onOpenExtra: (id: string) => void;
  extraFacts?: { k: string; v: string }[];
  account?: AccountActions;
}) {
  const s = useNeema();
  const t = T[s.lang];
  const [editing, setEditing] = useState(false);
  const [cityDraft, setCityDraft] = useState(s.city);
  const [exported, setExported] = useState<'' | 'busy' | 'done' | 'error'>('');
  const [delError, setDelError] = useState('');
  const [del, setDel] = useState<0 | 1 | 2>(0);
  const [chatsDeleted, setChatsDeleted] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinDraft, setPinDraft] = useState('');
  const [pinSaved, setPinSaved] = useState(false);
  const name = user?.name || 'Amina';
  const initials = name.split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();

  const pregnant = pregnancy.id !== 'none' && !pregnancy.birthDate && s.journey === 'preg';
  const facts = [
    { k: 'Email', v: user?.email || '—' },
    ...(pregnant
      ? [
          { k: 'Due date', v: fmtDate(new Date(pregnancy.dueDate)) },
          { k: 'Week', v: String(pregnancy.currentWeek) },
        ]
      : pregnancy.birthDate && s.journey === 'pp'
        ? [{ k: 'Baby born', v: fmtDate(pregnancy.birthDate) }]
        : []),
    ...extraFacts,
  ];

  const doExport = async () => {
    if (!account) { setExported('done'); return; }
    setExported('busy');
    try { await account.exportData(); setExported('done'); } catch { setExported('error'); }
  };
  const confirmDelete = async () => {
    setDelError('');
    try { if (account) await account.requestDeletion(); setDel(2); } catch { setDelError('We couldn’t send your request. Check your connection and try again.'); }
  };

  const st = methodStatus(s.method);
  const lockMessage =
    s.journey === 'preg' ? `Week ${Math.max(1, pregnancy.currentWeek)}: time for your iron and folic acid tablet`
      : s.journey === 'pp' ? 'Time for a feed and a cup of water'
        : s.journey === 'ttc' ? 'Time for your folic acid tablet'
          : s.method.id === 'coc' || s.method.id === 'pop' ? 'Time for your pill'
            : st?.due ? `Reminder: your next appointment is on ${fmtShort(st.due)}` : 'You have a new reminder';

  const privacy = [
    { key: 'disc', Icon: EyeOff, label: 'Discreet mode', sub: 'Neutral app name (“Notes”) and lock-screen messages', on: s.discreet, toggle: () => s.setDiscreet(!s.discreet) },
    { key: 'pin', Icon: Lock, label: 'PIN lock', sub: 'Locks Neema after 2 minutes in the background', on: s.pinLock, toggle: () => s.setPinLock(!s.pinLock) },
    { key: 'sp', Icon: Users, label: 'Share pregnancy updates with my partner', sub: 'Weekly progress and visit reminders only', on: s.sharePreg, toggle: () => s.setSharePreg(!s.sharePreg) },
    { key: 'sf', Icon: CalendarHeart, label: 'Share family planning with my partner', sub: 'Off by default. Only you can turn this on.', on: s.shareFp, toggle: () => s.setShareFp(!s.shareFp) },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0 p-4">
      <div className="flex items-center gap-2">
        <button type="button" aria-label={t.back} onClick={() => s.setTab('home')} className="-ml-1 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <ChevronLeft className="h-[22px] w-[22px]" />
        </button>
        <H1>{t.profile}</H1>
      </div>

      <Reveal i={0}>
        <section className="relative flex flex-col gap-3.5 overflow-hidden rounded-[28px] bg-gradient-to-br from-neema-primary to-neema-dark p-5 text-white shadow-neema-hero">
          <div aria-hidden="true" className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3.5">
            <div aria-hidden="true" className="flex h-16 w-16 flex-none items-center justify-center rounded-full border-[3px] border-white/70 bg-white text-2xl font-bold text-neema-dark">{initials}</div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-semibold leading-7">{name}</div>
              <div className="text-[15px] text-white/90">{s.city || 'Add your neighbourhood and city'}</div>
            </div>
          </div>
          <dl className="relative grid grid-cols-2 gap-2">
            {facts.map((f) => (
              <div key={f.k} className={cn('min-w-0 rounded-2xl bg-white/15 px-3 py-2', f.k === 'Email' && 'col-span-2')}>
                <dt className="text-[13px] font-medium leading-[18px] text-white/85">{f.k}</dt>
                <dd className="break-words font-semibold">{f.v}</dd>
              </div>
            ))}
          </dl>
          {editing && (
            <div className="relative flex flex-col gap-1.5">
              <label htmlFor="neema-city" className="text-sm font-semibold">Neighbourhood and city</label>
              <input id="neema-city" value={cityDraft} onChange={(e) => setCityDraft(e.target.value)} className="h-[52px] rounded-xl border border-white/40 px-3.5 text-base text-neema-ink" />
            </div>
          )}
          {editing ? (
            <button type="button" onClick={() => { s.setCity(cityDraft.trim()); setEditing(false); }} className="neema-press relative min-h-[48px] rounded-2xl bg-white font-semibold text-neema-dark">Save changes</button>
          ) : (
            <button type="button" onClick={() => { setCityDraft(s.city); setEditing(true); }} className="neema-press relative min-h-[48px] rounded-2xl border border-white/60 font-semibold">Edit profile</button>
          )}
        </section>
      </Reveal>

      <Reveal i={1}>
        <Card className="flex flex-col gap-2.5 rounded-[24px] px-4 pb-4 pt-4">
          <H2 className="px-1">{t.journey}</H2>
          <div role="radiogroup" aria-label={t.journey} className="grid grid-cols-2 gap-2.5">
            {JOURNEYS.map((j) => {
              const on = j.id === s.journey;
              const Art = JOURNEY_ART[j.id as keyof typeof JOURNEY_ART];
              return (
                <button key={j.id} type="button" role="radio" aria-checked={on} onClick={() => s.setJourney(j.id as typeof s.journey)}
                  className={cn('neema-press relative flex min-h-[128px] flex-col items-start gap-1 rounded-3xl border-2 p-3 text-left transition-colors', on ? 'border-neema-dark bg-neema-primary-soft' : 'border-transparent bg-neema-cream')}>
                  <span className="h-11 w-11"><Art className="h-full w-full" /></span>
                  <span className="font-semibold leading-5">{j.label}</span>
                  <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{j.sub}</span>
                  {on && <span aria-hidden="true" className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-neema-dark text-white"><Check className="h-4 w-4" /></span>}
                </button>
              );
            })}
          </div>
          {s.journey === 'avoid' && !s.discreet && (
            <div className="flex flex-col gap-2 rounded-2xl bg-neema-lilac px-3.5 py-3">
              <div className="text-[15px] leading-[22px]">We recommend discreet mode for this journey, especially on a shared phone.</div>
              <button type="button" onClick={() => s.setDiscreet(true)} className="min-h-[48px] rounded-xl bg-neema-ink font-semibold text-white">Turn on discreet mode</button>
            </div>
          )}
        </Card>
      </Reveal>

      <Reveal i={2}>
        <Card className="flex flex-col rounded-[24px] px-4 py-4">
          <H2 className="mb-1 px-1">{t.privacy}</H2>
          {privacy.map((p) => (
            <div key={p.key} className="flex flex-col border-b border-neema-line last:border-b-0">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-neema-cream text-neema-dark"><p.Icon className="h-5 w-5" /></span>
                <SwitchRow label={p.label} sub={p.sub} on={p.on} onToggle={p.toggle} className="min-h-[68px] flex-1 py-2.5" />
              </div>
              {p.key === 'disc' && (
                <div className="mb-3 ml-[52px] flex flex-col gap-1.5">
                  <div className="text-[13px] font-semibold leading-[18px] text-neema-muted">LOCK-SCREEN PREVIEW</div>
                  <div className="flex items-center gap-3 rounded-2xl bg-neema-ink px-3.5 py-3 text-white">
                    {s.discreet ? (
                      <>
                        <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-[#8A8FA3]"><NotebookText className="h-[22px] w-[22px]" /></span>
                        <span className="flex flex-col"><span className="text-[13px] font-semibold leading-[18px] text-[#D9DBE3]">NOTES · now</span><span>You have a new message</span></span>
                      </>
                    ) : (
                      <>
                        <img src={emblem} alt="" className="h-10 w-10 flex-none rounded-[10px] object-cover" />
                        <span className="flex flex-col"><span className="text-[13px] font-semibold leading-[18px] text-[#D9DBE3]">NEEMA · now</span><span>{lockMessage}</span></span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
      </Reveal>

      <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <H2>{t.language}</H2>
        <Segmented role="radiogroup" label={t.language} value={s.lang} onChange={s.setLang} options={[{ id: 'en', label: 'English' }, { id: 'fr', label: 'Français' }]} />
        <p className="text-sm leading-5 text-neema-muted">Neema content and Ask Neema answers are available in English and French. Pidgin is planned for v1.1.</p>
      </Card>

      {extras.length > 0 && (
        <Card className="flex flex-col rounded-[24px] px-4 py-4">
          <H2 className="mb-1 px-1">More from Neema</H2>
          {extras.map((e) => {
            const meta = EXTRA_ICON[e.id] ?? { Icon: Sparkles, tint: 'bg-neema-cream text-neema-dark' };
            return (
              <div key={e.id} className="border-b border-neema-line last:border-b-0">
                <ListRow icon={<meta.Icon className="h-5 w-5" />} tint={meta.tint} title={e.label} sub={e.description} onClick={() => onOpenExtra(e.id)} />
              </div>
            );
          })}
        </Card>
      )}

      <div id="emergency-contacts"><EmergencyContactsCard title={t.contacts} /></div>

      <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <H2>{t.data}</H2>
        {/* Export downloads the data now; deletion is logged in data_requests and completed by staff within 30 days. */}
        <div className="flex flex-col divide-y divide-neema-line">
          <ListRow icon={<Download className="h-5 w-5" />} tint="bg-neema-success-soft text-neema-success-ink" title={exported === 'busy' ? 'Preparing your file…' : t.export} onClick={doExport} />
          <ListRow icon={<MessageSquareX className="h-5 w-5" />} tint="bg-neema-cream text-neema-ink" title={chatsDeleted ? 'Ask Neema chats deleted' : 'Delete my Ask Neema chats'} onClick={() => { s.setMessages([]); setChatsDeleted(true); }} />
        </div>
        {exported === 'done' && <div role="status" className="rounded-xl bg-neema-success-soft px-3 py-2.5 text-[15px] font-medium leading-[22px] text-neema-success-ink">{account ? 'Your data file has downloaded: profile, pregnancy, health profile, habits and settings.' : 'Guests have no saved data. Create an account to keep your information.'}</div>}
        {exported === 'error' && <div role="alert" className="rounded-xl bg-neema-primary-soft px-3 py-2.5 text-[15px] font-medium leading-[22px] text-neema-dark">We couldn’t prepare your file. Check your connection and try again.</div>}
        {del === 0 && (
          <button type="button" onClick={() => setDel(1)} className="min-h-[56px] rounded-xl border-2 border-neema-dark bg-white font-semibold text-neema-dark">{t.deleteAll}</button>
        )}
        {del === 1 && (
          <div role="alertdialog" aria-label="Confirm deletion" className="flex flex-col gap-2.5 rounded-xl border-2 border-neema-dark px-3.5 py-3">
            <div className="font-semibold">Delete your account and all your data?</div>
            <div className="text-[15px] leading-[22px] text-neema-muted">This removes your profile, logs, Ask Neema chats and partner links. It can’t be undone.</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDel(0)} className="min-h-[48px] flex-1 rounded-xl border border-neema-border bg-white font-semibold">Cancel</button>
              <button type="button" onClick={confirmDelete} className="min-h-[48px] flex-1 rounded-xl bg-neema-dark font-semibold text-white">Delete</button>
            </div>
          </div>
        )}
        {delError && <div role="alert" className="rounded-xl bg-neema-primary-soft px-3 py-2.5 text-[15px] leading-[22px] text-neema-dark">{delError}</div>}
        {del === 2 && <div role="status" className="rounded-xl bg-neema-cream px-3 py-2.5 text-[15px] leading-[22px]">Deletion requested. Your data will be erased within 30 days.</div>}
        <p className="text-[13px] font-medium leading-[18px] text-neema-muted">Your health data is encrypted and handled under Cameroon’s Law No. 2024/017 on personal data protection. Neema never sells your data or shows ads.</p>
      </Card>

      <Card className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <H2>{t.security}</H2>
        <ListRow icon={<KeyRound className="h-5 w-5" />} tint="bg-neema-cream text-neema-ink" title="Change my PIN" onClick={() => { setPinOpen(!pinOpen); setPinSaved(false); setPinDraft(''); }} />
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
