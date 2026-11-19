import { useState } from 'react';
import { LogOut, Link2, Bell, Languages } from 'lucide-react';
import { format } from 'date-fns';
import { User, PregnancyData } from '@/types/pregnancy';
import { Card, H1, H2, Segmented, SwitchRow } from '@/neema/ui';

interface ProfileScreenProps {
  user: User | null;
  pregnancy: PregnancyData | null;
  isPartnerMode: boolean;
  onTogglePartnerMode: () => void;
  onLogout: () => void;
}

/** Profile for partners and support persons. Mothers use the Neema Profile tab. */
export function ProfileScreen({ user, pregnancy, onLogout }: ProfileScreenProps) {
  const [alerts, setAlerts] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [sms, setSms] = useState(false);
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const name = user?.name || 'Support person';
  const initials = name.split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();
  const linked = !!pregnancy && pregnancy.id !== 'demo';

  return (
    <div className="flex flex-col gap-4 bg-neema-cream p-4 pb-8 font-sans text-neema-ink [&>*]:shrink-0">
      <H1>Profile & settings</H1>

      <Card className="flex items-center gap-3.5">
        <div aria-hidden="true" className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-neema-lilac text-2xl font-bold text-neema-lilac-ink">{initials}</div>
        <div className="min-w-0">
          <div className="text-lg font-semibold leading-6">{name}</div>
          <div className="break-all text-neema-muted">{user?.email}</div>
          <div className="text-[15px] font-medium text-neema-lilac-ink">Support person</div>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <H2 className="flex items-center gap-2"><Link2 className="h-5 w-5 text-neema-primary" />Who you support</H2>
        {linked ? (
          <p>You are linked to a pregnancy due on {pregnancy ? format(pregnancy.dueDate, 'd MMMM yyyy') : ''}. She decides what you can see.</p>
        ) : (
          <p className="text-neema-muted-strong">Not linked yet. Ask the mother to invite you from her Neema profile, then open the link she sends you.</p>
        )}
      </Card>

      <Card className="flex flex-col px-5 py-4">
        <H2 className="mb-1 flex items-center gap-2"><Bell className="h-5 w-5 text-neema-primary" />Notifications</H2>
        <SwitchRow label="Emergency alerts" sub="If she uses SOS, you are told straight away" on={alerts} onToggle={() => setAlerts(!alerts)} className="min-h-[68px] border-b border-neema-line py-2.5" />
        <SwitchRow label="Weekly update" sub="Her week, baby’s growth and how to help" on={weekly} onToggle={() => setWeekly(!weekly)} className="min-h-[68px] border-b border-neema-line py-2.5" />
        <SwitchRow label="Also send by SMS" sub="For when you have no data" on={sms} onToggle={() => setSms(!sms)} className="min-h-[68px] py-2.5" />
      </Card>

      <Card className="flex flex-col gap-2.5">
        <H2 className="flex items-center gap-2"><Languages className="h-5 w-5 text-neema-primary" />Language</H2>
        <Segmented role="radiogroup" label="Language" value={lang} onChange={setLang} options={[{ id: 'en', label: 'English' }, { id: 'fr', label: 'Français' }]} />
      </Card>

      {/* TODO: save these settings to the partner's account once sign-in is connected to Supabase. */}
      <button type="button" onClick={onLogout} className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 border-neema-ink bg-white font-semibold tracking-wide">
        <LogOut className="h-5 w-5" />LOG OUT
      </button>
      <p className="text-center text-[13px] font-medium leading-[18px] text-neema-muted">Neema 1.0 · Educational information only.</p>
    </div>
  );
}
