import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { KB } from './data';
import type { JourneyId, Lang } from './data';
import type { MyMethod } from './cycle';
import type { EmergencyContact } from './contacts';

/** Baby feeds counted for one day. */
export type Feeds = { date: string; count: number; last: 'left' | 'right' | '' };
export type Mood = 'good' | 'ok' | 'low' | 'hard';
/** Items she adds herself, e.g. from her clinic's maternity list. */
export type CustomItem = { id: string; name: string; group: 'mother' | 'baby' | 'kit' | 'feed' };

export type TabId = 'home' | 'ask' | 'diet' | 'fp' | 'shop' | 'profile';
export type ChatMessage = { id: number; role: 'user' | 'ai' | 'alert'; text: string; sources?: string[] };

/** Settings and progress saved to the user's account (and remembered on this device). */
export const PERSISTED_KEYS = [
  'discreet', 'lang', 'journey', 'city', 'water', 'iron', 'activeWeek', 'shop', 'ttc', 'cycleLen', 'periodLen', 'lastPeriod',
  'pinLock', 'sharePreg', 'shareFp', 'folic', 'pills', 'method', 'feeds', 'mood', 'shopCustom', 'contacts',
] as const;
export type PersistedKey = (typeof PERSISTED_KEYS)[number];
export type PersistedState = Partial<Record<PersistedKey, unknown>>;

/** useState that also remembers its value on this device (falls back silently if storage is unavailable).
 * A value saved in the user's account (`seed`) wins over the device copy. */
function usePersisted<T>(key: PersistedKey, initial: T, seed?: PersistedState): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (seed && seed[key] !== undefined && seed[key] !== null) return seed[key] as T;
    try {
      const raw = window.localStorage.getItem('neema:' + key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem('neema:' + key, JSON.stringify(value));
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, [key, value]);
  return [value, setValue];
}

function useNeemaState(seed?: PersistedState) {
  const [tab, setTab] = useState<TabId>('home');
  const [discreet, setDiscreet] = usePersisted('discreet', false, seed);
  const [lang, setLang] = usePersisted<Lang>('lang', 'en', seed);
  const [journey, setJourney] = usePersisted<JourneyId>('journey', 'preg', seed);
  const [city, setCity] = usePersisted('city', '', seed);

  // Overlays
  const [notifOpen, setNotifOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [symptomOpen, setSymptomOpen] = useState(false);
  const [symptomResult, setSymptomResult] = useState<string | null>(null);
  const [dangerWord, setDangerWord] = useState('');

  // Daily habits
  const [water, setWater] = usePersisted('water', 0, seed);
  const [iron, setIron] = usePersisted<Record<number, boolean>>('iron', {}, seed);
  const [activeWeek, setActiveWeek] = usePersisted('activeWeek', 0, seed);

  // Checklist
  const [shop, setShop] = usePersisted<Record<string, boolean>>('shop', {}, seed);

  const [shopCustom, setShopCustom] = usePersisted<CustomItem[]>('shopCustom', [], seed);

  // Trying to conceive
  const [ttc, setTtc] = usePersisted<Record<string, boolean>>('ttc', {}, seed);
  const [cycleLen, setCycleLen] = usePersisted('cycleLen', 28, seed);
  const [periodLen, setPeriodLen] = usePersisted('periodLen', 5, seed);
  const [lastPeriod, setLastPeriod] = usePersisted('lastPeriod', '', seed);

  // Daily ticks by date (YYYY-MM-DD)
  const [folic, setFolic] = usePersisted<Record<string, boolean>>('folic', {}, seed);
  const [pills, setPills] = usePersisted<Record<string, boolean>>('pills', {}, seed);
  // Avoiding pregnancy: the method she uses
  const [method, setMethod] = usePersisted<MyMethod>('method', { id: '', start: '' }, seed);
  // After birth
  const [feeds, setFeeds] = usePersisted<Feeds>('feeds', { date: '', count: 0, last: '' }, seed);
  const [mood, setMood] = usePersisted<Record<string, Mood>>('mood', {}, seed);

  // Emergency contacts (saved to their own table for signed-in users)
  const [contacts, setContacts] = usePersisted<EmergencyContact[]>('contacts', [], seed);

  // Privacy
  const [pinLock, setPinLock] = usePersisted('pinLock', true, seed);
  const [sharePreg, setSharePreg] = usePersisted('sharePreg', true, seed);
  const [shareFp, setShareFp] = usePersisted('shareFp', false, seed);

  // Ask Neema
  // A sample exchange only for pregnancy; other journeys start with their own suggestions.
  const [messages, setMessages] = useState<ChatMessage[]>(() => journey === 'preg' ? [
    { id: 1, role: 'user', text: 'Which local foods help with iron?' },
    { id: 2, role: 'ai', text: KB[0].text, sources: KB[0].sources },
  ] : []);

  const openSymptom = (result: string | null = null, word = '') => {
    setSymptomResult(result);
    setDangerWord(word);
    setSymptomOpen(true);
    setNotifOpen(false);
  };
  const openSos = (word = '') => {
    setDangerWord(word);
    setSymptomOpen(false);
    setNotifOpen(false);
    setSosOpen(true);
  };

  const persisted: PersistedState = {
    discreet, lang, journey, city, water, iron, activeWeek, shop, ttc, cycleLen, periodLen, lastPeriod, pinLock, sharePreg, shareFp,
    folic, pills, method, feeds, mood, shopCustom, contacts,
  };

  return {
    persisted,
    tab, setTab, discreet, setDiscreet, lang, setLang, journey, setJourney, city, setCity,
    notifOpen, setNotifOpen, sosOpen, setSosOpen, symptomOpen, setSymptomOpen, symptomResult, setSymptomResult,
    dangerWord, setDangerWord, openSymptom, openSos,
    water, setWater, iron, setIron, activeWeek, setActiveWeek,
    shop, setShop, ttc, setTtc, cycleLen, setCycleLen, periodLen, setPeriodLen, lastPeriod, setLastPeriod,
    pinLock, setPinLock, sharePreg, setSharePreg, shareFp, setShareFp,
    folic, setFolic, pills, setPills, method, setMethod, feeds, setFeeds, mood, setMood, shopCustom, setShopCustom, contacts, setContacts,
    messages, setMessages,
  };
}

export type NeemaStore = ReturnType<typeof useNeemaState>;
const NeemaContext = createContext<NeemaStore | null>(null);

export function NeemaProvider({ children, seed }: { children: ReactNode; seed?: PersistedState }) {
  const store = useNeemaState(seed);
  return <NeemaContext.Provider value={store}>{children}</NeemaContext.Provider>;
}

export function useNeema() {
  const ctx = useContext(NeemaContext);
  if (!ctx) throw new Error('useNeema must be used inside <NeemaProvider>');
  return ctx;
}
