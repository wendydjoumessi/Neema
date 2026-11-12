import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { KB } from './data';
import type { JourneyId, Lang } from './data';

export type TabId = 'home' | 'ask' | 'diet' | 'fp' | 'shop' | 'profile';
export type ChatMessage = { id: number; role: 'user' | 'ai' | 'alert'; text: string; sources?: string[] };

/** useState that also remembers its value on this device (falls back silently if storage is unavailable). */
function usePersisted<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
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

function useNeemaState() {
  const [tab, setTab] = useState<TabId>('home');
  const [discreet, setDiscreet] = usePersisted('discreet', false);
  const [lang, setLang] = usePersisted<Lang>('lang', 'en');
  const [journey, setJourney] = usePersisted<JourneyId>('journey', 'preg');
  const [city, setCity] = usePersisted('city', 'Bonamoussadi, Douala');

  // Overlays
  const [notifOpen, setNotifOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [symptomOpen, setSymptomOpen] = useState(false);
  const [symptomResult, setSymptomResult] = useState<string | null>(null);
  const [dangerWord, setDangerWord] = useState('');

  // Daily habits
  const [water, setWater] = usePersisted('water', 5);
  const [iron, setIron] = usePersisted<Record<number, boolean>>('iron', { 0: true, 1: true });
  const [activeWeek, setActiveWeek] = usePersisted('activeWeek', 95);

  // Checklist
  const [shop, setShop] = usePersisted<Record<string, boolean>>('shop', { net: true, docs: true, onesies: true });

  // Trying to conceive
  const [ttc, setTtc] = usePersisted<Record<string, boolean>>('ttc', { folic: true });
  const [cycleLen, setCycleLen] = usePersisted('cycleLen', 28);
  const [periodLen, setPeriodLen] = usePersisted('periodLen', 5);
  const [lastPeriod, setLastPeriod] = usePersisted('lastPeriod', '');

  // Privacy
  const [pinLock, setPinLock] = usePersisted('pinLock', true);
  const [sharePreg, setSharePreg] = usePersisted('sharePreg', true);
  const [shareFp, setShareFp] = usePersisted('shareFp', false);

  // Ask Neema
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'user', text: 'Which local foods help with iron?' },
    { id: 2, role: 'ai', text: KB[0].text, sources: KB[0].sources },
  ]);

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

  return {
    tab, setTab, discreet, setDiscreet, lang, setLang, journey, setJourney, city, setCity,
    notifOpen, setNotifOpen, sosOpen, setSosOpen, symptomOpen, setSymptomOpen, symptomResult, setSymptomResult,
    dangerWord, setDangerWord, openSymptom, openSos,
    water, setWater, iron, setIron, activeWeek, setActiveWeek,
    shop, setShop, ttc, setTtc, cycleLen, setCycleLen, periodLen, setPeriodLen, lastPeriod, setLastPeriod,
    pinLock, setPinLock, sharePreg, setSharePreg, shareFp, setShareFp,
    messages, setMessages,
  };
}

export type NeemaStore = ReturnType<typeof useNeemaState>;
const NeemaContext = createContext<NeemaStore | null>(null);

export function NeemaProvider({ children }: { children: ReactNode }) {
  const store = useNeemaState();
  return <NeemaContext.Provider value={store}>{children}</NeemaContext.Provider>;
}

export function useNeema() {
  const ctx = useContext(NeemaContext);
  if (!ctx) throw new Error('useNeema must be used inside <NeemaProvider>');
  return ctx;
}
