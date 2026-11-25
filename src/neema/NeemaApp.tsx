import { ReactNode, useEffect, useRef, useState } from 'react';
import { Bell, Home, MessageCircle, Leaf, CalendarDays, ShoppingBag, NotebookText, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PregnancyData, User } from '@/types/pregnancy';
import emblem from '@/assets/neema-emblem.png';
import { T } from './data';
import { NeemaProvider, PersistedState, TabId, useNeema } from './store';
import { SosPill } from './ui';
import { HomeTab } from './screens/HomeTab';
import { AskTab } from './screens/AskTab';
import { DietTab } from './screens/DietTab';
import { FamilyPlanningTab } from './screens/FamilyPlanningTab';
import { ShopTab } from './screens/ShopTab';
import { BodySkinScreen } from './screens/BodySkinScreen';
import { ProfileTab } from './screens/ProfileTab';
import { SosSheet } from './overlays/SosSheet';
import { SymptomSheet } from './overlays/SymptomSheet';
import { NotificationsPanel } from './overlays/NotificationsPanel';

/** Existing NurtureLife-era screens that stay available from Profile › More. */
export type ExtraScreen = { id: string; label: string; description: string; render: (nav: { goTab: (tab: TabId) => void }) => ReactNode };

/** Account actions available when the user is signed in (not a guest). */
export type AccountActions = {
  exportData: () => Promise<void>;
  requestDeletion: () => Promise<void>;
};

export interface NeemaAppProps {
  user: User | null;
  pregnancy: PregnancyData;
  onLogout: () => void;
  extras: ExtraScreen[];
  /** Settings and progress loaded from the user's account. */
  seed?: PersistedState;
  /** Called (debounced) when settings or progress change, to save them to the account. */
  onPersist?: (state: PersistedState) => void;
  /** Health facts to show on the profile card, e.g. blood group. */
  profileFacts?: { k: string; v: string }[];
  account?: AccountActions;
}

export function NeemaApp(props: NeemaAppProps) {
  return (
    <NeemaProvider seed={props.seed}>
      <NeemaShell {...props} />
    </NeemaProvider>
  );
}

function NeemaShell({ user, pregnancy, onLogout, extras, onPersist, profileFacts, account }: NeemaAppProps) {
  const s = useNeema();
  const serialized = JSON.stringify(s.persisted);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!onPersist) return;
    const id = window.setTimeout(() => onPersist(JSON.parse(serialized)), 800);
    return () => window.clearTimeout(id);
  }, [serialized, onPersist]);
  const { extraId, setExtraId } = s;
  const t = T[s.lang];
  const firstName = (user?.name || 'Amina').split(' ')[0];
  const initials = (user?.name || 'Amina').split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();
  // Body & skin is built in; the other extras come from the app (account screens etc.).
  const bodyExtra: ExtraScreen = {
    id: 'body',
    label: s.journey === 'pp' ? 'Your body after birth' : 'Healthy body & skin',
    description: s.journey === 'pp' ? 'Tummy, stretch marks, skin and safe products' : 'Safe activity, skin changes and an ingredient checker',
    render: ({ goTab }) => <BodySkinScreen pregnancy={pregnancy} goTab={goTab} />,
  };
  const allExtras = [bodyExtra, ...extras];
  const extra = allExtras.find((e) => e.id === extraId);

  const go = (tab: TabId) => {
    setExtraId(null);
    s.setNotifOpen(false);
    s.setTab(tab);
  };

  // Each journey gets the tabs it needs: no baby shopping list when she isn't expecting.
  const fpLabel = s.discreet ? t.fpDiscreet : s.journey === 'ttc' ? t.fpTtc : s.journey === 'avoid' ? t.fpAvoid : t.fp;
  const tab = {
    home: { id: 'home' as TabId, label: t.home, Icon: Home },
    ask: { id: 'ask' as TabId, label: t.ask, Icon: MessageCircle },
    diet: { id: 'diet' as TabId, label: t.diet, Icon: Leaf },
    fp: { id: 'fp' as TabId, label: fpLabel, Icon: CalendarDays },
    shop: { id: 'shop' as TabId, label: t.shop, Icon: ShoppingBag },
  };
  // Same order in every journey, so tabs never move when she changes journey.
  const tabs = s.journey === 'ttc' || s.journey === 'avoid'
    ? [tab.home, tab.ask, tab.diet, tab.fp]
    : [tab.home, tab.ask, tab.diet, tab.fp, tab.shop];
  useEffect(() => {
    if (!tabs.some((x) => x.id === s.tab) && s.tab !== 'profile') s.setTab('home');
  }, [s.journey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-[100dvh] bg-neema-sand/60 font-sans text-base leading-6 tracking-normal text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans [&_h2]:tracking-normal [&_h3]:font-sans">
      <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-neema-cream md:shadow-xl">
        {/* Header: logo, then notifications, SOS and her profile. Compact so content gets the room. */}
        <header className="flex flex-none items-center justify-between gap-2 bg-neema-cream/95 px-4 pb-2 pt-2.5 backdrop-blur">
          <button type="button" onClick={() => go('home')} className="flex min-h-[48px] min-w-0 items-center gap-2" aria-label={s.discreet ? 'Notes, home' : 'Neema, home'}>
            {s.discreet ? (
              <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#8A8FA3] text-white">
                <NotebookText className="h-5 w-5" />
              </span>
            ) : (
              <img src={emblem} alt="" className="h-10 w-10 flex-none rounded-xl object-cover" />
            )}
            <span className={cn('text-xl font-bold leading-6', s.discreet ? 'text-neema-ink' : 'text-neema-dark')}>
              {s.discreet ? 'Notes' : 'Neema'}
            </span>
          </button>
          <div className="flex items-center gap-1.5">
            <SosPill onClick={() => s.openSos()} />
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => s.setNotifOpen(!s.notifOpen)}
              className="neema-press flex h-12 w-12 items-center justify-center rounded-full bg-white text-neema-ink shadow-sm"
            >
              <Bell className="h-[22px] w-[22px]" />
            </button>
            <button
              type="button"
              aria-label={t.openProfile}
              title={`${firstName} · ${t.myProfile}`}
              onClick={() => go('profile')}
              className={cn(
                'neema-press flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 bg-gradient-to-br from-neema-primary to-neema-dark text-base font-bold text-white shadow-sm',
                s.tab === 'profile' && !extra ? 'border-neema-ochre' : 'border-white',
              )}
            >
              {initials}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex min-h-0 flex-1 flex-col">
          {extra ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-none items-center gap-2 border-b border-neema-line bg-white px-2 py-1">
                <button type="button" onClick={() => setExtraId(null)} className="flex min-h-[48px] items-center gap-1 px-2 font-semibold text-neema-dark">
                  <ChevronLeft className="h-5 w-5" /> {s.tab === 'profile' ? 'Back to Profile' : 'Back'}
                </button>
              </div>
              <div key={extra.id} className="neema-fade min-h-0 flex-1 overflow-y-auto">{extra.render({ goTab: go })}</div>
            </div>
          ) : (
            <div key={s.tab} className="neema-fade flex min-h-0 flex-1 flex-col">
              {s.tab === 'home' && <HomeTab firstName={firstName} pregnancy={pregnancy} />}
              {s.tab === 'ask' && <AskTab week={pregnancy.currentWeek} />}
              {s.tab === 'diet' && <DietTab trimester={pregnancy.trimester} />}
              {s.tab === 'fp' && <FamilyPlanningTab />}
              {s.tab === 'shop' && <ShopTab week={pregnancy.currentWeek} />}
              {s.tab === 'profile' && (
                <ProfileTab user={user} pregnancy={pregnancy} onLogout={onLogout} extras={allExtras} onOpenExtra={setExtraId} extraFacts={profileFacts} account={account} />
              )}
            </div>
          )}
        </main>

        {/* Tab bar: the active tab sits on a soft pill that slides in */}
        <nav aria-label="Main" className={cn('grid flex-none border-t border-neema-line bg-white px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5', tabs.length === 4 ? 'grid-cols-4' : 'grid-cols-5')}>
          {tabs.map(({ id, label, Icon }) => {
            const on = s.tab === id && !extra;
            return (
              <button
                key={id}
                type="button"
                aria-current={on ? 'page' : undefined}
                onClick={() => go(id)}
                className={cn('neema-press flex min-h-[56px] flex-col items-center justify-center gap-1 text-[13px] font-semibold leading-4', on ? 'text-neema-dark' : 'text-neema-muted')}
              >
                <span className={cn('flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300', on ? 'scale-100 bg-neema-primary-soft' : 'scale-90 bg-transparent')}>
                  <Icon className={cn('h-[22px] w-[22px] transition-transform duration-300', on && '-translate-y-px')} strokeWidth={on ? 2.4 : 2} />
                </span>
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
