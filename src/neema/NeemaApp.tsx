import { ReactNode, useState } from 'react';
import { Bell, Home, MessageCircle, Leaf, CalendarDays, ShoppingBag, NotebookText, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PregnancyData, User } from '@/types/pregnancy';
import emblem from '@/assets/neema-emblem.png';
import { T } from './data';
import { NeemaProvider, TabId, useNeema } from './store';
import { SosPill } from './ui';
import { HomeTab } from './screens/HomeTab';
import { AskTab } from './screens/AskTab';
import { DietTab } from './screens/DietTab';
import { FamilyPlanningTab } from './screens/FamilyPlanningTab';
import { ShopTab } from './screens/ShopTab';
import { ProfileTab } from './screens/ProfileTab';
import { SosSheet } from './overlays/SosSheet';
import { SymptomSheet } from './overlays/SymptomSheet';
import { NotificationsPanel } from './overlays/NotificationsPanel';

/** Existing NurtureLife-era screens that stay available from Profile › More. */
export type ExtraScreen = { id: string; label: string; description: string; render: () => ReactNode };

export interface NeemaAppProps {
  user: User | null;
  pregnancy: PregnancyData;
  onLogout: () => void;
  extras: ExtraScreen[];
}

export function NeemaApp(props: NeemaAppProps) {
  return (
    <NeemaProvider>
      <NeemaShell {...props} />
    </NeemaProvider>
  );
}

function NeemaShell({ user, pregnancy, onLogout, extras }: NeemaAppProps) {
  const s = useNeema();
  const [extraId, setExtraId] = useState<string | null>(null);
  const t = T[s.lang];
  const firstName = (user?.name || 'Amina').split(' ')[0];
  const initials = (user?.name || 'Amina').split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();
  const extra = extras.find((e) => e.id === extraId);

  const go = (tab: TabId) => {
    setExtraId(null);
    s.setNotifOpen(false);
    s.setTab(tab);
  };

  const tabs: { id: TabId; label: string; Icon: typeof Home }[] = [
    { id: 'home', label: t.home, Icon: Home },
    { id: 'ask', label: t.ask, Icon: MessageCircle },
    { id: 'diet', label: t.diet, Icon: Leaf },
    { id: 'fp', label: s.discreet ? t.fpDiscreet : t.fp, Icon: CalendarDays },
    { id: 'shop', label: t.shop, Icon: ShoppingBag },
  ];

  return (
    <div className="min-h-[100dvh] bg-neema-sand/60 font-sans text-base leading-6 tracking-normal text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans [&_h2]:tracking-normal [&_h3]:font-sans">
      <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-neema-cream md:shadow-xl">
        {/* Header */}
        <header className="flex flex-none items-center justify-between gap-3 border-b border-neema-line bg-neema-cream px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {s.discreet ? (
              <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#8A8FA3] text-white">
                <NotebookText className="h-[22px] w-[22px]" />
              </span>
            ) : (
              <img src={emblem} alt="Neema logo" className="h-11 w-11 flex-none rounded-xl object-cover" />
            )}
            <button type="button" onClick={() => go('profile')} className="min-h-[48px] min-w-0 text-left">
              <span className={cn('block text-lg font-bold leading-6', s.discreet ? 'text-neema-ink' : 'text-neema-dark')}>
                {s.discreet ? 'Notes' : 'Neema'}
              </span>
              <span className="block whitespace-nowrap text-[13px] font-medium leading-[18px] text-neema-muted-strong">
                {firstName} · {t.myProfile}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={t.openProfile}
              onClick={() => go('profile')}
              className={cn(
                'flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 bg-neema-primary-soft text-base font-bold text-neema-dark',
                s.tab === 'profile' && !extra ? 'border-neema-primary' : 'border-transparent',
              )}
            >
              {initials}
            </button>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => s.setNotifOpen(!s.notifOpen)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-neema-ink shadow-sm"
            >
              <Bell className="h-6 w-6" />
            </button>
            <SosPill onClick={() => s.openSos()} />
          </div>
        </header>

        {/* Content */}
        <main className="flex min-h-0 flex-1 flex-col">
          {extra ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-none items-center gap-2 border-b border-neema-line bg-white px-2 py-1">
                <button type="button" onClick={() => setExtraId(null)} className="flex min-h-[48px] items-center gap-1 px-2 font-semibold text-neema-dark">
                  <ChevronLeft className="h-5 w-5" /> Back to Profile
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{extra.render()}</div>
            </div>
          ) : (
            <>
              {s.tab === 'home' && <HomeTab firstName={firstName} pregnancy={pregnancy} />}
              {s.tab === 'ask' && <AskTab week={pregnancy.currentWeek} />}
              {s.tab === 'diet' && <DietTab trimester={pregnancy.trimester} />}
              {s.tab === 'fp' && <FamilyPlanningTab />}
              {s.tab === 'shop' && <ShopTab />}
              {s.tab === 'profile' && (
                <ProfileTab user={user} pregnancy={pregnancy} onLogout={onLogout} extras={extras} onOpenExtra={setExtraId} />
              )}
            </>
          )}
        </main>

        {/* Tab bar */}
        <nav aria-label="Main" className="grid flex-none grid-cols-5 border-t border-neema-line bg-white px-1 pb-2.5 pt-1.5">
          {tabs.map(({ id, label, Icon }) => {
            const on = s.tab === id && !extra;
            return (
              <button
                key={id}
                type="button"
                aria-current={on ? 'page' : undefined}
                onClick={() => go(id)}
                className={cn('flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-semibold leading-4', on ? 'text-neema-primary' : 'text-neema-muted')}
              >
                <Icon className="h-6 w-6" />
                {label}
              </button>
            );
          })}
        </nav>

        {s.notifOpen && <NotificationsPanel />}
        {s.symptomOpen && <SymptomSheet />}
        {s.sosOpen && <SosSheet firstName={firstName} />}
      </div>
    </div>
  );
}
