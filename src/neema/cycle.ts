/** Cycle and method date maths, shared by Home and the Planning tab. All results are estimates. */
export const DAY = 86_400_000;

export const isoDate = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const todayIso = () => isoDate(new Date());
export const fmtShort = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
export const fmtLong = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const midnight = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const fromIso = (s: string) => new Date(s + 'T00:00:00');
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
export const daysBetween = (a: Date, b: Date) => Math.round((midnight(b).getTime() - midnight(a).getTime()) / DAY);

export type CycleInfo = {
  cycleDay: number;
  ovulation: Date;
  fertileStart: Date;
  fertileEnd: Date;
  nextPeriod: Date;
  phase: 'period' | 'before' | 'fertile' | 'after' | 'late';
  /** Days until the next period (negative when late). */
  daysToPeriod: number;
};

/** Returns null until she has entered the first day of her last period: Neema never invents one. */
export function cycleInfo(lastPeriod: string, cycleLen: number, periodLen: number): CycleInfo | null {
  if (!lastPeriod) return null;
  const lmp = fromIso(lastPeriod);
  const today = midnight();
  const cycleDay = daysBetween(lmp, today) + 1;
  const ovuDay = cycleLen - 14;
  const day = (n: number) => addDays(lmp, n - 1);
  const nextPeriod = day(cycleLen + 1);
  const phase: CycleInfo['phase'] =
    cycleDay <= periodLen ? 'period'
      : cycleDay < ovuDay - 5 ? 'before'
        : cycleDay <= ovuDay + 1 ? 'fertile'
          : cycleDay <= cycleLen ? 'after' : 'late';
  return {
    cycleDay, ovulation: day(ovuDay), fertileStart: day(ovuDay - 5), fertileEnd: day(ovuDay + 1), nextPeriod, phase,
    daysToPeriod: daysBetween(today, nextPeriod),
  };
}

/** Contraceptive methods she can record as "my method", with how long each lasts. */
export type MyMethodId = 'coc' | 'pop' | 'inject3' | 'inject2' | 'implant3' | 'implant5' | 'cuiud' | 'hiud' | 'condom' | 'lam' | 'fam' | 'other';
export type MyMethod = { id: MyMethodId | ''; start: string };

type MethodDef = { id: MyMethodId; name: string; note: string; dateLabel?: string; renewDays?: number; graceText?: string };
export const MY_METHODS: MethodDef[] = [
  { id: 'coc', name: 'Combined pill', note: 'One pill every day, at about the same time.' },
  { id: 'pop', name: 'Progestin-only pill (mini-pill)', note: 'One pill every day, within the same 3 hours. Suitable while breastfeeding.' },
  { id: 'inject3', name: 'Injection every 3 months (Depo-Provera, Sayana Press)', dateLabel: 'Date of my last injection', renewDays: 91, graceText: 'You can still have it up to 4 weeks late and stay protected.', note: 'Go back on time for your next injection.' },
  { id: 'inject2', name: 'Injection every 2 months (Noristerat)', dateLabel: 'Date of my last injection', renewDays: 61, graceText: 'You can still have it up to 2 weeks late and stay protected.', note: 'Go back on time for your next injection.' },
  { id: 'implant3', name: 'Implant, 3 years (Implanon NXT)', dateLabel: 'Date it was inserted', renewDays: 3 * 365, note: 'Check the date on your family planning card.' },
  { id: 'implant5', name: 'Implant, 5 years (Jadelle)', dateLabel: 'Date it was inserted', renewDays: 5 * 365, note: 'Check the date on your family planning card.' },
  { id: 'cuiud', name: 'Copper IUD', dateLabel: 'Date it was inserted', renewDays: 12 * 365, note: 'Lasts up to 12 years. Check the date on your card.' },
  { id: 'hiud', name: 'Hormonal IUD', dateLabel: 'Date it was inserted', renewDays: 5 * 365, note: 'Usually lasts 5 years or more. Check the date on your card.' },
  { id: 'condom', name: 'Condoms', note: 'Use a new condom every time, from start to finish. Only condoms also protect against STIs and HIV.' },
  { id: 'lam', name: 'Breastfeeding method (LAM)', note: 'Protects only if baby is under 6 months, feeds only on breast milk day and night, and your period has not returned.' },
  { id: 'fam', name: 'Fertility awareness (calendar)', note: 'Avoid sex or use condoms on your fertile days. Add your period dates so Neema can estimate them.' },
  { id: 'other', name: 'Another method', note: 'Ask your health worker when you need your next check-up or refill.' },
];

export function methodStatus(m: MyMethod) {
  const def = MY_METHODS.find((x) => x.id === m.id);
  if (!def) return null;
  const due = def.renewDays && m.start ? addDays(fromIso(m.start), def.renewDays) : null;
  return { def, due, daysLeft: due ? daysBetween(new Date(), due) : null };
}

/** WHO postnatal contacts: within 24 hours, day 3, days 7–14 and week 6. */
export function nextPostnatalCheck(birth: Date) {
  const d = daysBetween(birth, new Date());
  if (d < 3) return { label: 'Day 3 check', date: addDays(birth, 2), text: 'A check for you and baby 2 to 3 days after birth.' };
  if (d < 14) return { label: 'Check between day 7 and 14', date: addDays(birth, 13), text: 'Go by this date if you haven’t been yet.' };
  if (d < 42) return { label: '6-week check', date: addDays(birth, 41), text: 'For you and baby. Ask about family planning at this visit.' };
  return null;
}

/** Cameroon routine baby vaccines (EPI): at birth, 6, 10 and 14 weeks, then 9 months. */
export function nextBabyVaccine(birth: Date) {
  const steps = [{ days: 0, label: 'At birth' }, { days: 42, label: '6 weeks' }, { days: 70, label: '10 weeks' }, { days: 98, label: '14 weeks' }, { days: 273, label: '9 months' }];
  const d = daysBetween(birth, new Date());
  const next = steps.find((s) => s.days >= d && s.days > 0);
  return next ? { label: next.label, date: addDays(birth, next.days) } : null;
}
